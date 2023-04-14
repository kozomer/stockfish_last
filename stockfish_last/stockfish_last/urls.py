"""stockfish_last URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from stockfish_api.views import ( AddCustomersView, AddSalesView, AddProductsView, AddWarehouseView, AddSalerView,
                                 ViewSalesView,  ViewWarehouseView, ViewProductsView, ChartView, ItemListView, ViewCustomersView, CollapsedSalerView, SalerView, SalesReportView, ROPView, OrderListView,
                                 DeleteSaleView, DeleteCustomerView, DeleteProductView, DeleteSalerView, DeleteWarehouseView,
                                 EditProductView, EditCustomerView, EditSaleView, EditWarehouseView,  EditSalerView, EditOrderListView,
                                 LoginView, LogoutView,
                                 TopCustomersView, TopProductsView,
                                 ExchangeRateAPIView, SalerDataView, TotalDataView, TotalDataByMonthlyView, CustomerAreaPieChartView, 
                                 ExportCustomersView, ExportSalesView, ExportWarehouseView, ExportProductsView, 
                                 MahmutView


                                 )
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
    
)


urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('add_customers/', AddCustomersView.as_view(), name='add_customers'),
    path('add_warehouse/', AddWarehouseView.as_view(), name='add_warehouse'),
    path('add_sales/', AddSalesView.as_view(), name='add_sales'),
    path('add_products/',AddProductsView.as_view(), name='add_pricelists'),
    path('add_salers/',AddSalerView.as_view(), name='add_salers'),

    path('customers/', ViewCustomersView.as_view(), name='view_customers'),
    path('sales/', ViewSalesView.as_view(), name='view_sales'),
    path('warehouse/', ViewWarehouseView.as_view(), name='view_warehouse'),
    path('charts/', ChartView.as_view(), name='view_charts'),
    path('products/', ViewProductsView.as_view(), name='view_pricelists'),
    path('salers/', SalerView.as_view(), name='view_saler'),
    path('collapsed_salers/', CollapsedSalerView.as_view(), name='view_saler_collapsed'),
    path('rop/', ROPView.as_view(), name='view_rop'),
    path('order_list/', OrderListView.as_view(), name='order_list'),



    path('delete_sales/',  DeleteSaleView.as_view(), name='delete_sales'),
    path('delete_customers/',  DeleteCustomerView.as_view(), name='delete_customers'),
    path('delete_products/', DeleteProductView.as_view(), name='delete_goods'),
    path('delete_saler/', DeleteSalerView.as_view(), name='delete_saler'),
    path('delete_warehouse/', DeleteWarehouseView.as_view(), name='delete_warehouse'),
    
    path('item_list/',  ItemListView.as_view(), name='item_list'),
    path('item_list_filter/', ItemListView.as_view(), name='item_list_filter'),
    path('sales_report/', SalesReportView.as_view(), name='sales_report'),

    path('edit_products/', EditProductView.as_view(), name='edit_product'),
    path('edit_customers/', EditCustomerView.as_view(), name='edit_customer'),
    path('edit_sales/', EditSaleView.as_view(), name='edit_sale'),
    path('edit_warehouse/', EditWarehouseView.as_view(), name='edit_warehouse'),
    path('edit_salers/', EditSalerView.as_view(), name='edit_saler'),
    path('edit_order_list/', EditOrderListView.as_view(), name='edit_order_list'),

    path('top_customers/', TopCustomersView.as_view(), name= 'top_customers'),
    path('top_products/', TopProductsView.as_view(), name= 'top_products'),
    path('customer_area/', CustomerAreaPieChartView.as_view(), name='customer_area'),

    path('exchange_rate/', ExchangeRateAPIView.as_view(), name='exchange_rate'),
    path('daily_report/saler_data/', SalerDataView.as_view(), name='saler_data'),
    path('daily_report/total_data/', TotalDataView.as_view(), name='total_data'),
    path('daily_report/total_data_by_monthly/', TotalDataByMonthlyView.as_view(), name='total_data_by_monthly'),
    

    path('export_customers/', ExportCustomersView.as_view(), name= 'export_customers'),
    path('export_sales/', ExportSalesView.as_view(), name= 'export_sales'),
    path('export_warehouse/', ExportWarehouseView.as_view(), name= 'export_warehouse'),
    path('export_products/', ExportProductsView.as_view(), name= 'export_products'),
    path('mahmut/', MahmutView.as_view(), name= 'mahmut'),



]
