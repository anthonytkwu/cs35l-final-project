from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwards = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class DrawingSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'drawing', 'created_at', 'author']
        extra_kwards = {'author': {'read_only': True}}

