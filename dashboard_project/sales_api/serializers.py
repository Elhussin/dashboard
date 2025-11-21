# sales_api/serializers.py
from rest_framework import serializers
from .models import Product, Sale

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['product_id', 'product_name', 'supplier_name']

class SaleSerializer(serializers.ModelSerializer):
    # تضمين بيانات المنتج مباشرة في رد المبيعات
    product = ProductSerializer(read_only=True) 

    class Meta:
        model = Sale
        # fields = '__all__'
        fields = ['sale_id', 'sale_date', 'quantity', 'unit_price', 'product']