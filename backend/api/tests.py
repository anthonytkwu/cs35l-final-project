
# Create your tests here.
# tests.py
# tests.py
from django.test import TestCase, Client
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Session

class SessionViewTest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpass')

        # Create a test client
        self.client = Client()

    def test_create_session(self):
        # Get a JWT token for the test user
        refresh = RefreshToken.for_user(self.user)
        token = str(refresh.access_token)

        # Set the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        # Make a POST request to the SessionView
        response = self.client.post('/api/session/create', {'draw_time': 45, 'desc_time': 30})

        # Check the response
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['draw_time'], 45)
        self.assertEqual(response.data['desc_time'], 30)

    def test_join_session(self):
        # Create a test session
        session = Session.objects.create(draw_time=30, desc_time=15)

        # Get a JWT token for the test user
        refresh = RefreshToken.for_user(self.user)
        token = str(refresh.access_token)

        # Set the Authorization header
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        # Make a POST request to the JoinSessionView
        response = self.client.post('/api/session/join', {'game_code': session.game_code})

        # Check the response
        self.assertEqual(response.status_code, 200)
        self.assertIn(self.user.id, response.data['users'])