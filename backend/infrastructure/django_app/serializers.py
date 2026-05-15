from rest_framework import serializers

class LoginInputSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField()

class RegisterInputSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    apellido_paterno = serializers.CharField()
    apellido_materno = serializers.CharField(required=False, allow_blank=True)
    ci = serializers.CharField()
    telefono = serializers.CharField(required=False, allow_blank=True)
    correo = serializers.EmailField()
    password = serializers.CharField(min_length=6)
    genero = serializers.CharField(required=False, allow_blank=True)
    ubicacion = serializers.CharField(required=False, allow_blank=True)
    fecha_de_nacimiento = serializers.DateField(required=False, allow_null=True)

class UserOutputSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nombre = serializers.CharField()
    correo = serializers.EmailField()
    rol = serializers.CharField()
    estado = serializers.CharField()