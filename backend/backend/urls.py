"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', UserCreateView.as_view(), name='register'),
    path('api/user/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/user/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/session/create/', SessionCreateView.as_view(), name='create-session'),
    path('api/session/<str:game_code>/join/', SessionJoinView.as_view(), name='join-session'),
    path('api/session/<str:game_code>/wait/', SessionWaitView.as_view(), name='wait-session'),
    path('api/session/<str:game_code>/info/', SessionInfoView.as_view(), name='info-session'),
    path('api/session/<str:game_code>/start/', SessionStartView.as_view(), name='start-session'),
    path('api/session/<str:game_code>/<int:round>/<int:chain>/image', DrawingCreateView.as_view(), name='draw-session'),
    # path('api/session/<str:game_code>/<int:round>/<int:chain>/desc', .as_view(), name='desc-session'),
]
