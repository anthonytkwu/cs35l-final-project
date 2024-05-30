from rest_framework import viewsets
from .models import *
from .serializers import ImageSerializer
from django.shortcuts import get_object_or_404
from django.http import HttpResponse

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Drawing.objects.all()
    serializer_class = ImageSerializer

class GameDetailView(viewsets.ModelViewSet):
    