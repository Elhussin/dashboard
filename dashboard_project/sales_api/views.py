from django.shortcuts import render

# Create your views here.
# sales_api/views.py
from rest_framework import viewsets
from .models import Sale
from .serializers import SaleSerializer
from .filters import SaleFilter
from django_filters.rest_framework import DjangoFilterBackend

class SalesDashboardViewSet(viewsets.ReadOnlyModelViewSet):
    # نستخدم ReadOnlyModelViewSet لأننا نريد عمليات GET فقط
    
    # select_related لتحميل بيانات المنتج في نفس الاستعلام (يقلل من استعلامات DB)
    queryset = Sale.objects.select_related('product').all() 
    serializer_class = SaleSerializer
    
    # تمكين التصفية
    filter_backends = [DjangoFilterBackend]
    filterset_class = SaleFilter