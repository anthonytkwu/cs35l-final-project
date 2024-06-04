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
        fields = '__all__'
        read_only_fields = ['game_code', 'created_at', 'users', 'round', 'last_modified']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['users'] = [user.username for user in instance.users.all()]
        return representation