from rest_framework import serializers
from .models import *

class DrawingPhrasePairSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrawingPhrasePair
        fields = ['id', 'prompt', 'author', 'image', 'artist',
                  'previous_pair', 'starter']