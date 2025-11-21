from django.db import models

# Create your models here.
# sales_api/models.py
from django.db import models

# 1. نموذج المنتج (Product Model)
class Product(models.Model):
    # نستخدم الحقول الأساسية المطلوبة فقط للوحة التحكم
    product_id = models.IntegerField(primary_key=True) 
    product_name = models.CharField(max_length=255)
    supplier_name = models.CharField(max_length=150) 
    # ... أي حقول أخرى مثل 'category' أو 'current_price'

    class Meta:
        managed = False # لا تسمح لـ Django بتعديل هذا الجدول
        db_table = 'Products_Master' # اسم الجدول الفعلي في SQL Server
        
    def __str__(self):
        return self.product_name

# 2. نموذج المبيعات (Sales Model)
class Sale(models.Model):
    # db_column يحدد اسم العمود الفعلي في جدول SQL Server
    sale_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING, db_column='Product_FK')
    sale_date = models.DateField()
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False # لا تسمح لـ Django بتعديل هذا الجدول
        db_table = 'Sales_Transactions' # اسم الجدول الفعلي في SQL Server