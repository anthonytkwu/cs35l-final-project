from rest_framework import serializers
from .models import *

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drawing
        fields = ['id', 'image', 'creator']

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'players', 'created_at', 'is_active']