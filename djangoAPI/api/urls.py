# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'images', ImageViewSet, basename='image')
router.register(r'game', GameDetailView, basename='game')

urlpatterns = [
    path('', include(router.urls)),
]
