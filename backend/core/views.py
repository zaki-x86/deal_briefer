from rest_framework import viewsets
from rest_framework.response import Response

class HealthViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response({"status": "ok"})