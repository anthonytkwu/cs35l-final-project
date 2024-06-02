# djangoAPI/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.views import UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', UserViewSet.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path("api-auth/", include("rest_framework.urls")),
    path('api/', include('api.urls')),  # Make sure this line is correct
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
