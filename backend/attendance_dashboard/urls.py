from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for the API
router = DefaultRouter()
router.register(r'attendance', views.AttendanceViewSet)

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('api/', include(router.urls)),  # API endpoints
]