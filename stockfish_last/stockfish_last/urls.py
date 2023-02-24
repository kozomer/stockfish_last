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
from stockfish_api.views import (ViewCustomersView, AddCustomersView, AddSalesView, AddProductsView, AddWarehouseView,
                                 ViewSalesView,  ViewWarehouseView, ViewProductsView, ChartView, ItemListView,
                                 DeleteSaleView, DeleteCustomerView, DeleteProductView, 
                                 EditProductView
                                 )


urlpatterns = [
    path('admin/', admin.site.urls),
    path('add_customers/', AddCustomersView.as_view(), name='add_customers'),
    #path('add_goods/', AddGoodsView.as_view(), name='add_goods'),
    path('add_warehouse/', AddWarehouseView.as_view(), name='add_warehouse'),
    path('add_sales/', AddSalesView.as_view(), name='add_sales'),
    path('add_products/',AddProductsView.as_view(), name='add_pricelists'),

    path('customers/', ViewCustomersView.as_view(), name='view_customers'),
    #path('goods/', ViewGoodsView.as_view(), name='view_goods'),
    path('sales/', ViewSalesView.as_view(), name='view_sales'),
    path('warehouse/', ViewWarehouseView.as_view(), name='view_warehouse'),
    path('charts/', ChartView.as_view(), name='view_charts'),
    path('products/', ViewProductsView.as_view(), name='view_pricelists'),

    #path('delete_goods/',  DeleteGoodView.as_view(), name='delete_goods'),
    path('delete_sales/',  DeleteSaleView.as_view(), name='delete_sales'),
    path('delete_customers/',  DeleteCustomerView.as_view(), name='delete_customers'),
    path('delete_products/', DeleteProductView.as_view(), name='delete_goods'),
    
    path('item_list/',  ItemListView.as_view(), name='item_list'),
    path('item_list_filter/', ItemListView.as_view(), name='item_list_filter'),

    path('edit_products/', EditProductView.as_view(), name='edit_product'),
]
