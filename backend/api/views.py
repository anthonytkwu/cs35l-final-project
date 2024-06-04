from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *

# Create your views here.
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

class SessionCreateView(generics.CreateAPIView):
    serializer_class = SessionSerializer
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        session = serializer.save()
        return Response(self.serializer_class(session).data, status=status.HTTP_201_CREATED)
    
class SessionJoinView(generics.UpdateAPIView):
    serializer_class = JoinSessionSerializer
    permission_classes = (AllowAny,)

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        game_code = serializer.validated_data['game_code']
        try:
            session = Session.objects.get(game_code=game_code)
            session.add_user(request.user)
            session.save()  # Save the session after adding the user
            return Response(SessionCreateView(session).data, status=status.HTTP_200_OK)
        except Session.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)