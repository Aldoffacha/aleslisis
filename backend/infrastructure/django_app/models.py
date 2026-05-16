from django.db import models

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, null=True, blank=True)
    apellido_paterno = models.CharField(max_length=50, null=True, blank=True)
    apellido_materno = models.CharField(max_length=50, null=True, blank=True)
    ci = models.CharField(max_length=20, unique=True, null=True, blank=True)
    telefono = models.CharField(max_length=15, null=True, blank=True)
    correo = models.CharField(max_length=100, unique=True, null=True, blank=True)
    contrasena = models.CharField(max_length=255)
    genero = models.CharField(max_length=20, null=True, blank=True)
    estado = models.CharField(max_length=20, null=True, blank=True)
    fecha_de_nacimiento = models.DateField(null=True, blank=True)
    fecha_de_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuario'
        managed = False

class Empleado(models.Model):
    id_usuario = models.OneToOneField(Usuario, primary_key=True, db_column='id_usuario', on_delete=models.CASCADE)
    cargo = models.CharField(max_length=50, null=True, blank=True)
    horarios = models.CharField(max_length=100, null=True, blank=True)
    turno = models.CharField(max_length=50, null=True, blank=True)
    estado = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'empleado'
        managed = False

class Administrador(models.Model):
    id_usuario = models.OneToOneField(Usuario, primary_key=True, db_column='id_usuario', on_delete=models.CASCADE)
    estado = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'administrador'
        managed = False

class Cliente(models.Model):
    id_usuario = models.OneToOneField(Usuario, primary_key=True, db_column='id_usuario', on_delete=models.CASCADE)
    nit = models.CharField(max_length=20, null=True, blank=True)
    ubicacion = models.CharField(max_length=255, null=True, blank=True)
    preferencias = models.TextField(null=True, blank=True)
    estado = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'cliente'
        managed = False


class CategoriaProducto(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, null=True, blank=True)
    descripcion = models.TextField(null=True, blank=True)
    estado = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'categoria_producto'
        managed = False


class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField(default=0)
    image = models.FileField(upload_to='productos/', max_length=255, null=True, blank=True)
    estado = models.CharField(max_length=20, null=True, blank=True)
    id_categoria = models.ForeignKey(
        CategoriaProducto,
        db_column='id_categoria',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='productos',
    )

    class Meta:
        db_table = 'producto'
        managed = False