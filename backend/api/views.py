from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
import time
from django.http import FileResponse


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
        if session.round != -1:
            return Response({'detail': 'Session in progress'}, status=status.HTTP_400_BAD_REQUEST)
        if request.user not in session.users.all():
            if session.users.count() < 10:
                session.users.add(request.user)
            else:
                return Response({'detail': 'Session full'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(session)
        return Response({'detail': 'Joined session'}, status=status.HTTP_200_OK)
    
class SessionInfoView(generics.RetrieveAPIView):
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
        serializer = self.get_serializer(session)
        return Response(serializer.data)
    
class SessionWaitView(generics.GenericAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = (IsAuthenticated,)
    lookup_field = 'game_code'

    def post(self, request, *args, **kwargs):
        game_code = self.kwargs.get('game_code')
        if request.data['game_code'] != int(game_code):
            return Response({'detail': 'Game code does not match'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            session = Session.objects.get(game_code=game_code)
        except Session.DoesNotExist:
            return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        timeout = 10  # timeout period in seconds
        start_time = time.time()

        if session.round == -1:
            client_session_state = request.data['last_modified']
            while True:
                # Retrieve the current state of the session
                server_session_state = SessionSerializer(session).data['last_modified']

                # Check if the session on the server side has changed
                if client_session_state != server_session_state or time.time() - start_time > timeout:
                    return Response(SessionSerializer(session).data, status=status.HTTP_200_OK)
                # Sleep for a short time to avoid busy waiting
                time.sleep(0.5)
        else:
            client_session_state = request.data['round']
            while True:
                server_session_state = SessionSerializer(session).data['round']
                if client_session_state != server_session_state or time.time() - start_time > timeout:
                    return Response(SessionSerializer(session).data, status=status.HTTP_200_OK)
                time.sleep(0.5)


class SessionStartView(generics.UpdateAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = (IsAuthenticated,)
    lookup_field = 'game_code'

    def update(self, request, *args, **kwargs):
        game_code = self.kwargs.get('game_code')
        try:
            session = Session.objects.get(game_code=game_code)
        except Session.DoesNotExist:
            return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        if session.users.count() < 2:
            return Response({'detail': 'Not enough players'}, status=status.HTTP_400_BAD_REQUEST)
        elif session.round != -1:
            return Response({'detail': 'Session in progress'}, status=status.HTTP_400_BAD_REQUEST)
        session.start()
        return Response(SessionSerializer(session).data)
    
class DrawingCreateView(generics.CreateAPIView):
    queryset = Drawing.objects.all()
    serializer_class = DrawingSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        game_code = int(self.kwargs.get('game_code'))
        round = int(self.kwargs.get('round'))
        chain_id = int(self.kwargs.get('chain'))

        if Session.objects.get(game_code=game_code).round != round:
            return Response({'detail': 'Round mismatch'}, status=status.HTTP_400_BAD_REQUEST)
        if round < 0 or round % 2 == 0:
            return Response({'detail': 'Round is not drawing'}, status=status.HTTP_400_BAD_REQUEST)
        if Chain.objects.get(id=chain_id).session.game_code != game_code:
            return Response({'detail': 'Chain mismatch'}, status=status.HTTP_400_BAD_REQUEST)

        chain = Chain.objects.get(id=chain_id)
        user = self.request.user
        if user != chain.users.all()[round]:
            return Response({'detail': 'Not your turn'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if serializer.is_valid():
                serializer.save(author=user, chain=chain)
                Session.objects.get(game_code=game_code).check_completed_round()
            else:
                print(serializer.errors)
        except Chain.DoesNotExist:
            return Response({'detail': 'Chain not found'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request, *args, **kwargs):
        file = request.data.get('drawing')
        if not file:
            return Response({'detail': 'No file'}, status=status.HTTP_400_BAD_REQUEST)
        
        drawing_instance = Drawing(drawing=file)
        self.perform_create(self.serializer_class(drawing_instance, data=request.data, context={'request': request}))
        headers = self.get_success_headers(DrawingSerializer(instance=drawing_instance).data)
        return Response(DrawingSerializer(instance=drawing_instance).data, status=status.HTTP_201_CREATED, headers=headers)


class DescCreateView(generics.CreateAPIView):
    queryset = Description.objects.all()
    serializer_class = DescSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        game_code = int(self.kwargs.get('game_code'))
        round = int(self.kwargs.get('round'))
        chain_id = int(self.kwargs.get('chain'))
        print(Session.objects.get(game_code=game_code).round)
        if Session.objects.get(game_code=game_code).round != round:
            return Response({'detail': 'Round mismatch'}, status=status.HTTP_400_BAD_REQUEST)
        if round < 0 or round % 2 == 1:
            return Response({'detail': 'Round is not desc'}, status=status.HTTP_400_BAD_REQUEST)
        if Chain.objects.get(id=chain_id).session.game_code != game_code:
            return Response({'detail': 'Chain mismatch'}, status=status.HTTP_400_BAD_REQUEST)
        
        chain = Chain.objects.get(id=chain_id)
        user = User.objects.get(id=2)
        # user = self.request.user
        # if user != chain.users.all()[round]:
        #     return Response({'detail': 'Not your turn'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if serializer.is_valid():
                serializer.save(author=user, chain=chain, description=self.request.data['description'])
            else:
                print(serializer.errors)
        except Chain.DoesNotExist:
            return Response({'detail': 'Chain not found'}, status=status.HTTP_404_NOT_FOUND)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class DrawingRetrieveView(generics.RetrieveAPIView):
    queryset = Drawing.objects.all()
    serializer_class = DrawingSerializer
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        chain_id = self.kwargs.get('chain')
        round = self.kwargs.get('round')
        if round % 2 == 0:
            return Response({'detail': 'Round is not drawing'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            drawing = Chain.objects.get(id=chain_id).drawings.all()[round // 2]
        except Drawing.DoesNotExist:
            return Response({'detail': 'Drawing not found'}, status=status.HTTP_404_NOT_FOUND)
        except Chain.DoesNotExist:
            return Response({'detail': 'Chain not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(drawing)
        return Response(serializer.data)

class MediaRetrieveView(generics.RetrieveAPIView):
    queryset = Drawing.objects.all()
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        filename = self.kwargs.get('filename')
        try:
            drawing = Drawing.objects.get(drawing=filename)
            return drawing
        except Drawing.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def retrieve(self, request, *args, **kwargs):
        drawing = self.get_object()
        file_handle = drawing.drawing.open()
        response = FileResponse(file_handle, content_type='image/svg+xml')
        return response
    
class DescRetrieveView(generics.RetrieveAPIView):
    queryset = Description.objects.all()
    serializer_class = DescSerializer
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        chain_id = self.kwargs.get('chain')
        round = self.kwargs.get('round')
        if round % 2 == 1:
            return Response({'detail': 'Round is not desc'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            desc = Chain.objects.get(id=chain_id).descriptions.all()[round // 2]
        except Description.DoesNotExist:
            return Response({'detail': 'Description not found'}, status=status.HTTP_404_NOT_FOUND)
        except Chain.DoesNotExist:
            return Response({'detail': 'Chain not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(desc)
        return Response(serializer.data)
    
