from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, DrawingSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *

# Create your views here.

class DrawingListCreate(generics.ListCreateAPIView):
    serializer_class = DrawingSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # Get the current user
        user = self.request.user

        # Get the sessions that the user is part of
        user_sessions = user.sessions.all()

        # Get the chains that are in the same sessions as the user
        chains_in_user_sessions = Chain.objects.filter(session__in=user_sessions)

        # Get the drawings that are in the same chains as the user's sessions
        drawings = Drawing.objects.filter(chain__in=chains_in_user_sessions)

        return drawings
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class UserCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

