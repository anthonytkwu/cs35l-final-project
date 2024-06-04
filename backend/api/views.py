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
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        print(self.request.is_secure())
        if serializer.is_valid():
            serializer.save(users=[self.request.user])
        else:
            print(serializer.errors)
    
class SessionJoinView(generics.RetrieveAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    lookup_field = 'game_code'

    def get_object(self):
        game_code = self.kwargs.get('game_code')
        try:
            session = Session.objects.get(game_code=game_code)
            return session
        except Session.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    def retrieve(self, request, *args, **kwargs):
        session = self.get_object()
        if request.user in session.users.all():
            return Response({'detail': 'User already in session'}, status=status.HTTP_400_BAD_REQUEST)
        elif session.round != 0:
            return Response({'detail': 'Session in progress'}, status=status.HTTP_400_BAD_REQUEST)
        elif session.users.count() >= 10:
            return Response({'detail': 'Session full'}, status=status.HTTP_400_BAD_REQUEST)
        session.users.add(request.user)
        serializer = self.get_serializer(session)
        return Response(serializer.data)
