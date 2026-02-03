from rest_framework import viewsets
from .models import Deal
from .serializers import DealSerializer, CreateDealSerializer
from rest_framework.response import Response
from services.deal_briefer import DealBrieferSvc, DuplicatedDealError
from services.llm import DealLLMBriefer
from traceback import print_exc

class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all().order_by("-created_at")
    serializer_class = DealSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return CreateDealSerializer
        return DealSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
        try:
            briefer = DealBrieferSvc(DealLLMBriefer())
            deal = briefer.create_brief(serializer.validated_data['raw_text'])
        except DuplicatedDealError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            print_exc()
            return Response({"error": "Internal server error."}, status=500)
        
        output_serializer = DealSerializer(deal)
        return Response(output_serializer.data, status=201)
        