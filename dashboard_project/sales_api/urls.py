# sales_api/urls.py
from rest_framework.routers import DefaultRouter
from .views import SalesDashboardViewSet

router = DefaultRouter()
# /api/sales/
router.register(r'sales', SalesDashboardViewSet, basename='sales')

urlpatterns = router.urls