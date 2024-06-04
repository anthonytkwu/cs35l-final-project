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
    
class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['game_code', 'draw_time', 'desc_time', 'created_at', 'users', 'round']

class NewSessionSerializer(serializers.ModelSerializer):
    draw_time = serializers.IntegerField(choices=[(30, '30 seconds'), (45, '45 seconds'), (60, '60 seconds')])
    desc_time = serializers.IntegerField(choices = [(15, '15 seconds'), (30, '30 seconds'), (45, '45 seconds')])
    user = UserSerializer()  # Add this line to include UserSerializer in SessionSerializer


class JoinSessionSerializer(serializers.Serializer):
    game_code = serializers.IntegerField()