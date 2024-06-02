from rest_framework import viewsets, filters
from .models import *
from .serializers import *

class BaseViewSet(viewsets.ModelViewSet):
    """
    Base viewset that applies a custom filtering logic based on query parameters.
    """
    def get_queryset(self):
        queryset = super().get_queryset()
        search_term = self.request.query_params.get('search', None)
        search_field = self.request.query_params.get('field', None)

        # Ensure that search_field is in the list of allowed search fields for safety
        if search_term and search_field and search_field in self.search_fields:
            filter_kwargs = {f"{search_field}__icontains": search_term}
            queryset = queryset.filter(**filter_kwargs)
        return queryset

class GameViewSet(BaseViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['game_id', 'is_active']

class PlayerViewSet(BaseViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username']  # assuming 'user' is a related User model

class DrawingPhrasePairViewSet(BaseViewSet):
    queryset = DrawingPhrasePair.objects.all()
    serializer_class = DrawingPhrasePairSerializer
    search_fields = ['prompt', 'description']  # example fields

class ChainViewSet(BaseViewSet):
    queryset = Chain.objects.all()
    serializer_class = ChainSerializer
    search_fields = ['starter__name', 'game__title']  # example fields assuming relational fields