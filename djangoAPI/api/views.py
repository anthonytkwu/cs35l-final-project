from rest_framework import viewsets
from .models import *
from .serializers import *

class DrawingPhrasePairViewSet(viewsets.ModelViewSet):
    queryset = DrawingPhrasePair.objects.all()
    serializer_class = DrawingPhrasePairSerializer