from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
import time

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
        if serializer.is_valid():
            serializer.save(users=[self.request.user])
        else:
            print(serializer.errors)
    
class SessionJoinView(generics.RetrieveAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = (IsAuthenticated,)
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
        session.add_user(request.user)
        serializer = self.get_serializer(session)
        return Response(serializer.data)
    
class SessionWaitView(generics.GenericAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = (AllowAny,)
    lookup_field = 'game_code'

    def post(self, request, *args, **kwargs):
        game_code = self.kwargs.get('game_code')
        if request.data['game_code'] != int(game_code):
            return Response({'detail': 'Game code does not match'}, status=status.HTTP_400_BAD_REQUEST)
        

        client_session_state = request.data['last_modified']

        try:
            session = Session.objects.get(game_code=game_code)
        except Session.DoesNotExist:
            return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        timeout = 10  # timeout period in seconds
        start_time = time.time()

        while True:
            # Retrieve the current state of the session
            server_session_state = SessionSerializer(session).data['last_modified']

            # Check if the session on the server side has changed
            if client_session_state != server_session_state or time.time() - start_time > timeout:
                return Response(SessionSerializer(session).data, status=status.HTTP_200_OK)
            # Sleep for a short time to avoid busy waiting
            time.sleep(0.5)

class SessionStartView(generics.UpdateAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = (AllowAny,)
    lookup_field = 'game_code'

    def update(self, request, *args, **kwargs):
        game_code = self.kwargs.get('game_code')
        try:
            session = Session.objects.get(game_code=game_code)
        except Session.DoesNotExist:
            return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if session.users.count() < 2:
            return Response({'detail': 'Not enough players'}, status=status.HTTP_400_BAD_REQUEST)
        elif session.round != 0:
            return Response({'detail': 'Session in progress'}, status=status.HTTP_400_BAD_REQUEST)
        session.start_round()
        return Response(SessionSerializer(session).data)