# sales_api/filters.py
import django_filters
from .models import Sale

class SaleFilter(django_filters.FilterSet):
    # تصفية حسب الفترة الزمنية
    start_date = django_filters.DateFilter(field_name='sale_date', lookup_expr='gte') # أكبر من أو يساوي
    end_date = django_filters.DateFilter(field_name='sale_date', lookup_expr='lte')   # أقل من أو يساوي
    
    # تصفية حسب المورد (باستخدام حقل العلاقة)
    supplier = django_filters.CharFilter(field_name='product__supplier_name', lookup_expr='icontains')
    
    # تصفية حسب السعر (نطاق الأسعار)
    min_price = django_filters.NumberFilter(field_name='unit_price', lookup_expr='gte')
    
    class Meta:
        model = Sale
        fields = ['product', 'supplier', 'start_date', 'end_date', 'min_price']