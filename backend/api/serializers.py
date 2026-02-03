# deals/serializers.py
from rest_framework import serializers
from django.db import IntegrityError
from .models import Deal
import hashlib
from traceback import print_exc

class CreateDealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = ['raw_text']

class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = '__all__'