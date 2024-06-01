from rest_framework import serializers
from .models import *

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['game_id', 'players', 'created_at', 'is_active']

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'user', 'current_game']

class DrawingPhrasePairSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrawingPhrasePair
        fields = ['id', 'prompt', 'author', 'image', 'artist',
                  'previous_pair', 'starter']
        
class ChainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chain
        fields = ['starter', 'game']