from __future__ import annotations

import bcrypt
from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Q, QuerySet

from backend.infrastructure.django_app.models import Administrador, Cliente, Empleado, Usuario

PAGE_SIZE = 10
ACTIVE_STATES = {'activo', 'activa', 'disponible', 'visible'}
ROLE_PRIORITY = ('administrador', 'empleado', 'cliente')


def _normalize_optional_string(value: str | None) -> str | None:
    if value is None:
        return None

    normalized_value = value.strip()
    return normalized_value or None


def _normalize_state(value: str | None, fallback: str = 'activo') -> str:
    normalized_value = (value or '').strip().lower()
    return normalized_value or fallback


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _build_user_maps(user_ids: list[int]) -> tuple[dict[int, Cliente], dict[int, Empleado], dict[int, Administrador]]:
    client_map = {
        cliente.id_usuario_id: cliente
        for cliente in Cliente.objects.filter(id_usuario_id__in=user_ids)
    }
    employee_map = {
        empleado.id_usuario_id: empleado
        for empleado in Empleado.objects.filter(id_usuario_id__in=user_ids)
    }
    admin_map = {
        administrador.id_usuario_id: administrador
        for administrador in Administrador.objects.filter(id_usuario_id__in=user_ids)
    }

    return client_map, employee_map, admin_map


def _resolve_role(user_id: int, client_map: dict[int, Cliente], employee_map: dict[int, Empleado], admin_map: dict[int, Administrador]) -> str:
    if user_id in admin_map:
        return 'administrador'

    if user_id in employee_map:
        return 'empleado'

    if user_id in client_map:
        return 'cliente'

    return 'cliente'


def _resolve_role_for_user(usuario: Usuario) -> str:
    if Administrador.objects.filter(id_usuario=usuario).exists():
        return 'administrador'

    if Empleado.objects.filter(id_usuario=usuario).exists():
        return 'empleado'

    if Cliente.objects.filter(id_usuario=usuario).exists():
        return 'cliente'

    return 'cliente'


def _full_name(usuario: Usuario) -> str:
    name_parts = [usuario.nombre or '', usuario.apellido_paterno or '', usuario.apellido_materno or '']
    return ' '.join(part for part in name_parts if part).strip()


def _serialize_user(
    usuario: Usuario,
    client_map: dict[int, Cliente],
    employee_map: dict[int, Empleado],
    admin_map: dict[int, Administrador],
) -> dict:
    cliente = client_map.get(usuario.id_usuario)
    empleado = employee_map.get(usuario.id_usuario)
    administrador = admin_map.get(usuario.id_usuario)
    rol = _resolve_role(usuario.id_usuario, client_map, employee_map, admin_map)

    return {
        'id': usuario.id_usuario,
        'nombre': usuario.nombre or '',
        'apellidoPaterno': usuario.apellido_paterno or '',
        'apellidoMaterno': usuario.apellido_materno or '',
        'nombreCompleto': _full_name(usuario),
        'ci': usuario.ci or '',
        'telefono': usuario.telefono or '',
        'correo': usuario.correo or '',
        'genero': usuario.genero or '',
        'estado': usuario.estado or '',
        'fechaNacimiento': usuario.fecha_de_nacimiento.isoformat() if usuario.fecha_de_nacimiento else None,
        'fechaCreacion': usuario.fecha_de_creacion.isoformat() if usuario.fecha_de_creacion else None,
        'rol': rol,
        'cliente': {
            'nit': cliente.nit or '',
            'ubicacion': cliente.ubicacion or '',
            'preferencias': cliente.preferencias or '',
            'estado': cliente.estado or '',
        } if cliente else None,
        'empleado': {
            'cargo': empleado.cargo or '',
            'horarios': empleado.horarios or '',
            'turno': empleado.turno or '',
            'estado': empleado.estado or '',
        } if empleado else None,
        'administrador': {
            'estado': administrador.estado or '',
        } if administrador else None,
    }


def _collect_available_letters(queryset: QuerySet[Usuario]) -> list[str]:
    letters = {
        (nombre or '').strip()[:1].upper()
        for nombre in queryset.values_list('nombre', flat=True)
        if nombre and nombre.strip()
    }
    return sorted(letter for letter in letters if letter)


def _apply_common_filters(queryset: QuerySet[Usuario], query: str | None, letter: str | None) -> QuerySet[Usuario]:
    normalized_query = (query or '').strip()
    normalized_letter = (letter or '').strip()[:1]

    if normalized_query:
        queryset = queryset.filter(
            Q(nombre__icontains=normalized_query)
            | Q(apellido_paterno__icontains=normalized_query)
            | Q(apellido_materno__icontains=normalized_query)
            | Q(ci__icontains=normalized_query)
            | Q(correo__icontains=normalized_query)
        )

    if normalized_letter:
        queryset = queryset.filter(nombre__istartswith=normalized_letter)

    return queryset


def _apply_sort(queryset: QuerySet[Usuario], sort: str | None) -> QuerySet[Usuario]:
    if (sort or '').strip().lower() == 'desc':
        return queryset.order_by('-nombre', '-apellido_paterno', '-correo')

    return queryset.order_by('nombre', 'apellido_paterno', 'correo')


def list_users(*, query: str | None = None, letter: str | None = None, sort: str | None = None, page: int = 1) -> dict:
    base_queryset = _apply_common_filters(Usuario.objects.all(), query, letter)
    available_letters = _collect_available_letters(base_queryset)
    ordered_queryset = _apply_sort(base_queryset, sort)
    page_obj = Paginator(ordered_queryset, PAGE_SIZE).get_page(page)
    user_ids = [usuario.id_usuario for usuario in page_obj.object_list]
    client_map, employee_map, admin_map = _build_user_maps(user_ids)

    return {
        'items': [_serialize_user(usuario, client_map, employee_map, admin_map) for usuario in page_obj.object_list],
        'pagination': {
            'page': page_obj.number,
            'pageSize': PAGE_SIZE,
            'totalItems': page_obj.paginator.count,
            'totalPages': page_obj.paginator.num_pages,
            'hasNext': page_obj.has_next(),
            'hasPrevious': page_obj.has_previous(),
        },
        'filters': {
            'query': (query or '').strip(),
            'letter': (letter or '').strip()[:1].upper(),
            'sort': 'desc' if (sort or '').strip().lower() == 'desc' else 'asc',
            'availableLetters': available_letters,
        },
    }


def list_employees(*, query: str | None = None, letter: str | None = None, sort: str | None = None, page: int = 1) -> dict:
    employee_ids = Empleado.objects.values_list('id_usuario_id', flat=True)
    base_queryset = Usuario.objects.filter(id_usuario__in=employee_ids)
    base_queryset = _apply_common_filters(base_queryset, query, letter)
    available_letters = _collect_available_letters(base_queryset)
    ordered_queryset = _apply_sort(base_queryset, sort)
    page_obj = Paginator(ordered_queryset, PAGE_SIZE).get_page(page)
    user_ids = [usuario.id_usuario for usuario in page_obj.object_list]
    client_map, employee_map, admin_map = _build_user_maps(user_ids)

    return {
        'items': [_serialize_user(usuario, client_map, employee_map, admin_map) for usuario in page_obj.object_list],
        'pagination': {
            'page': page_obj.number,
            'pageSize': PAGE_SIZE,
            'totalItems': page_obj.paginator.count,
            'totalPages': page_obj.paginator.num_pages,
            'hasNext': page_obj.has_next(),
            'hasPrevious': page_obj.has_previous(),
        },
        'filters': {
            'query': (query or '').strip(),
            'letter': (letter or '').strip()[:1].upper(),
            'sort': 'desc' if (sort or '').strip().lower() == 'desc' else 'asc',
            'availableLetters': available_letters,
        },
    }


def get_user_payload(user_id: int) -> dict | None:
    usuario = Usuario.objects.filter(id_usuario=user_id).first()
    if not usuario:
        return None

    client_map, employee_map, admin_map = _build_user_maps([usuario.id_usuario])
    return _serialize_user(usuario, client_map, employee_map, admin_map)


def get_employee_payload(user_id: int) -> dict | None:
    if not Empleado.objects.filter(id_usuario_id=user_id).exists():
        return None

    return get_user_payload(user_id)


def _ensure_unique_fields(*, correo: str | None, ci: str | None, exclude_user_id: int | None = None):
    if correo and Usuario.objects.filter(correo__iexact=correo).exclude(id_usuario=exclude_user_id).exists():
        raise ValueError('Ya existe un usuario con ese correo.')

    if ci and Usuario.objects.filter(ci__iexact=ci).exclude(id_usuario=exclude_user_id).exists():
        raise ValueError('Ya existe un usuario con ese CI.')


def _sync_role_tables(usuario: Usuario, payload: dict):
    role = payload.get('rol') or _resolve_role_for_user(usuario)
    normalized_state = _normalize_state(payload.get('estado'), fallback=usuario.estado or 'activo')

    if role == 'cliente':
        cliente, _ = Cliente.objects.get_or_create(id_usuario=usuario)
        cliente.nit = _normalize_optional_string(payload.get('nit'))
        cliente.ubicacion = _normalize_optional_string(payload.get('ubicacion'))
        cliente.preferencias = _normalize_optional_string(payload.get('preferencias'))
        cliente.estado = normalized_state
        cliente.save()
        Empleado.objects.filter(id_usuario=usuario).delete()
        Administrador.objects.filter(id_usuario=usuario).delete()
        return

    if role == 'empleado':
        empleado, _ = Empleado.objects.get_or_create(id_usuario=usuario)
        if 'cargo' in payload:
            empleado.cargo = _normalize_optional_string(payload.get('cargo'))
        if 'horarios' in payload:
            empleado.horarios = _normalize_optional_string(payload.get('horarios'))
        if 'turno' in payload:
            empleado.turno = _normalize_optional_string(payload.get('turno'))
        empleado.estado = normalized_state
        empleado.save()
        Cliente.objects.filter(id_usuario=usuario).delete()
        Administrador.objects.filter(id_usuario=usuario).delete()
        return

    administrador, _ = Administrador.objects.get_or_create(id_usuario=usuario)
    administrador.estado = normalized_state
    administrador.save()
    Cliente.objects.filter(id_usuario=usuario).delete()
    Empleado.objects.filter(id_usuario=usuario).delete()


@transaction.atomic
def create_user(payload: dict) -> dict:
    password = (payload.get('password') or '').strip()
    if not password:
        raise ValueError('Debes registrar una contraseña para crear el usuario.')

    normalized_email = _normalize_optional_string(payload.get('correo'))
    normalized_ci = _normalize_optional_string(payload.get('ci'))
    _ensure_unique_fields(correo=normalized_email, ci=normalized_ci)

    usuario = Usuario.objects.create(
        nombre=_normalize_optional_string(payload.get('nombre')),
        apellido_paterno=_normalize_optional_string(payload.get('apellido_paterno')),
        apellido_materno=_normalize_optional_string(payload.get('apellido_materno')),
        ci=normalized_ci,
        telefono=_normalize_optional_string(payload.get('telefono')),
        correo=normalized_email,
        contrasena=_hash_password(password),
        genero=_normalize_optional_string(payload.get('genero')),
        estado=_normalize_state(payload.get('estado')),
        fecha_de_nacimiento=payload.get('fecha_de_nacimiento') or None,
    )

    _sync_role_tables(usuario, payload)
    return get_user_payload(usuario.id_usuario)


@transaction.atomic
def update_user(user_id: int, payload: dict) -> dict | None:
    usuario = Usuario.objects.filter(id_usuario=user_id).first()
    if not usuario:
        return None

    normalized_email = _normalize_optional_string(payload.get('correo', usuario.correo))
    normalized_ci = _normalize_optional_string(payload.get('ci', usuario.ci))
    _ensure_unique_fields(correo=normalized_email, ci=normalized_ci, exclude_user_id=usuario.id_usuario)

    if 'nombre' in payload:
        usuario.nombre = _normalize_optional_string(payload.get('nombre'))
    if 'apellido_paterno' in payload:
        usuario.apellido_paterno = _normalize_optional_string(payload.get('apellido_paterno'))
    if 'apellido_materno' in payload:
        usuario.apellido_materno = _normalize_optional_string(payload.get('apellido_materno'))
    if 'ci' in payload:
        usuario.ci = normalized_ci
    if 'telefono' in payload:
        usuario.telefono = _normalize_optional_string(payload.get('telefono'))
    if 'correo' in payload:
        usuario.correo = normalized_email
    if 'genero' in payload:
        usuario.genero = _normalize_optional_string(payload.get('genero'))
    if 'estado' in payload:
        usuario.estado = _normalize_state(payload.get('estado'))
    if 'fecha_de_nacimiento' in payload:
        usuario.fecha_de_nacimiento = payload.get('fecha_de_nacimiento') or None

    password = (payload.get('password') or '').strip()
    if password:
        usuario.contrasena = _hash_password(password)

    usuario.save()
    _sync_role_tables(usuario, payload)
    return get_user_payload(usuario.id_usuario)


@transaction.atomic
def logical_delete_user(user_id: int) -> dict | None:
    usuario = Usuario.objects.filter(id_usuario=user_id).first()
    if not usuario:
        return None

    usuario.estado = 'inactivo'
    usuario.save(update_fields=['estado'])
    Cliente.objects.filter(id_usuario=usuario).update(estado='inactivo')
    Empleado.objects.filter(id_usuario=usuario).update(estado='inactivo')
    Administrador.objects.filter(id_usuario=usuario).update(estado='inactivo')
    return get_user_payload(usuario.id_usuario)


@transaction.atomic
def update_employee_assignment(user_id: int, payload: dict) -> dict | None:
    usuario = Usuario.objects.filter(id_usuario=user_id).first()
    empleado = Empleado.objects.filter(id_usuario_id=user_id).first()
    if not usuario or not empleado:
        return None

    if 'cargo' in payload:
        empleado.cargo = _normalize_optional_string(payload.get('cargo'))
    if 'horarios' in payload:
        empleado.horarios = _normalize_optional_string(payload.get('horarios'))
    if 'turno' in payload:
        empleado.turno = _normalize_optional_string(payload.get('turno'))
    if 'estado' in payload:
        normalized_state = _normalize_state(payload.get('estado'))
        empleado.estado = normalized_state
        usuario.estado = normalized_state
        usuario.save(update_fields=['estado'])

    empleado.save()
    return get_employee_payload(user_id)
