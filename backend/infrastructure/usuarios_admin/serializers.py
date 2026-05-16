from rest_framework import serializers


ROLE_CHOICES = [
    ('cliente', 'Cliente'),
    ('empleado', 'Empleado'),
    ('administrador', 'Administrador'),
]


class AdminUserInputSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=50)
    apellido_paterno = serializers.CharField(max_length=50, required=False, allow_blank=True)
    apellido_materno = serializers.CharField(max_length=50, required=False, allow_blank=True)
    ci = serializers.CharField(max_length=20, required=False, allow_blank=True)
    telefono = serializers.CharField(max_length=15, required=False, allow_blank=True)
    correo = serializers.EmailField(max_length=100)
    password = serializers.CharField(min_length=6, required=False, allow_blank=True)
    genero = serializers.CharField(max_length=20, required=False, allow_blank=True)
    estado = serializers.CharField(max_length=20, required=False, allow_blank=True, default='activo')
    fecha_de_nacimiento = serializers.DateField(required=False, allow_null=True)
    rol = serializers.ChoiceField(choices=ROLE_CHOICES)
    nit = serializers.CharField(max_length=20, required=False, allow_blank=True)
    ubicacion = serializers.CharField(max_length=255, required=False, allow_blank=True)
    preferencias = serializers.CharField(required=False, allow_blank=True)
    cargo = serializers.CharField(max_length=50, required=False, allow_blank=True)
    horarios = serializers.CharField(max_length=100, required=False, allow_blank=True)
    turno = serializers.CharField(max_length=50, required=False, allow_blank=True)


class EmployeeAssignmentInputSerializer(serializers.Serializer):
    cargo = serializers.CharField(max_length=50, required=False, allow_blank=True)
    horarios = serializers.CharField(max_length=100, required=False, allow_blank=True)
    turno = serializers.CharField(max_length=50, required=False, allow_blank=True)
    estado = serializers.CharField(max_length=20, required=False, allow_blank=True)
