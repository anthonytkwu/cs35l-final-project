# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameViewSet, PlayerViewSet, DrawingPhrasePairViewSet, ChainViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'games', GameViewSet, basename='game')
router.register(r'players', PlayerViewSet, basename='player')
router.register(r'drawing_phrase_pairs', DrawingPhrasePairViewSet, basename='drawing_phrase_pair')
router.register(r'chains', ChainViewSet, basename='chain')

urlpatterns = [
    path('', include(router.urls)),
]
