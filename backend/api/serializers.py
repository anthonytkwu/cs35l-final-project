from django.contrib.auth.models import User
from .models import Session, Drawing
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
        model = Drawing
        fields = ['id', 'drawing', 'created_at', 'author']
        extra_kwards = {'author': {'read_only': True}}

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id', 'game_code', 'draw_time', 'desc_time', 'created_at', 'users', 'round']
        read_only_fields = ['game_code', 'created_at', 'round']

class JoinSessionSerializer(serializers.Serializer):
    game_code = serializers.IntegerField()