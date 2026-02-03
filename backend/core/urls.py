# config/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import DealViewSet
from .views import HealthViewSet

router = DefaultRouter()
router.register(r"deals", DealViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("health/", HealthViewSet.as_view({'get': 'list'})),
]
