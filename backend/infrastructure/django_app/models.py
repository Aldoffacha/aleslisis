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