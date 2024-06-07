from django.contrib.auth.models import User
from .models import *
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
        read_only_fields = ['game_code', 'created_at', 'users', 'round', 'last_modified', 'chains']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['users'] = [user.username for user in instance.users.all()]
        if instance.round != -2:
            representation['chains'] = dict()
            for chain in instance.chains.all():
                representation['chains'][chain.users.all()[instance.round].username] = chain.id
        else:
            representation['chains'] = dict()
            for chain in instance.chains.all():
                representation['chains'][chain.id] = [user.username for user in chain.users.all()]

        return representation

class DrawingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drawing
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'chain']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['author'] = instance.author.username
        return representation

class DescSerializer(serializers.ModelSerializer):
    class Meta:
        model = Description
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'chain']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['author'] = instance.author.username
        return representation
    