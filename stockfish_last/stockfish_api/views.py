from django.shortcuts import render
import pandas as pd
from .models import Customers, Products, Sales, Warehouse, ROP
from django.views import View
from django.http import JsonResponse, HttpResponse
import json
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver



# region Customers

class AddCustomersView(View):
    def post(self, request,*args, **kwargs):
        if request.method == 'POST':
            data = pd.read_excel(request.FILES['file'])
            for i, row in data.iterrows():
                customer_code = row["Customer Code"]
                if Customers.objects.filter(customer_code=customer_code).exists():
                    continue
                customer = Customers(customer_code=customer_code, description=row["Description"], quantity=row["Quantity"],
                                    area_code=row["Area Code"], code=row["Code"], city=row["City"], area=row["Area"])
                customer.save()
            return render(request, 'success.html', {})
        return render(request, 'upload.html', {})

class ViewCustomersView(View):
    def get(self,request,*args, **kwargs):
         customers = Customers.objects.values().all()
         customer_list = [[customer['customer_code'], customer['description'], customer['quantity'],
                      customer['area_code'], customer['code'], customer['city'], customer['area']]
                     for customer in customers]
         return JsonResponse(customer_list,safe=False)

class DeleteCustomerView(View):
    def post(self, request, *args, **kwargs):
        customer_code = request.POST.get('customer_code')
        Customers.objects.filter(customer_code=customer_code).delete()
        return HttpResponse('OK')


# endregion

# region Sales

class AddSalesView(View):
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = pd.read_excel(request.FILES['file'])
            for i, row in data.iterrows():
                no = row["No"]
                if Sales.objects.filter(no=no).exists():
                    continue
                sale = Sales(no=no, bill_number=row["Bill Number"], date=row["Date"],
                            psr=row["PSR"], customer_code=row["Customer Code"], name=row["Name"], area=row["Area"], group=row["Group"],
                            good_code=row["Good Code"], goods=row["Goods"], unit=row["Unit"], original_value=row["The Original Value"],
                            original_output_value=row["Original Output Value"], secondary_output_value=row["Secondary Output Value"],
                            price=row["Price"], original_price=row["Original Price"], discount_percentage=row["Discount Percantage (%)"],
                            amount_sale=row["Amount Sale"], discount=row["Discount"], additional_sales=row["Additional Sales"],
                            net_sales=row["Net Sales"], discount_percentage_2=row["Discount Percantage 2(%)"],
                            real_discount_percentage=row["Real Discount Percantage (%)"], payment_cash=row["Payment Cash"],
                            payment_check=row["Payment Check"], balance=row["Balance"], saler=row["Saler"], currency=row["Currency"],
                            dollar=row["Dollar"], manager_rating=row["Manager Rating"], senior_saler=row["Senior Saler"],
                            tot_monthly_sales=row["Tot Monthly Sales"], receipment=row["Receipment"], ct=row["CT"],
                            payment_type=row["Payment Type"], customer_size=row["Customer Size"], saler_factor=row["Saler Factor"],
                            prim_percentage=row["Prim Percantage"], bonus_factor=row["Bonus Factor"], bonus=row["Bonus"])
                sale.save()
                try:
                    warehouse_item = Warehouse.objects.get(product_code=sale.good_code)
                    warehouse_item.stock -= sale.original_output_value
                    warehouse_item.save()
                except Warehouse.DoesNotExist:
                    warehouse_item = None

            return render(request, 'success.html', {})
        return render(request, 'upload.html', {})

class ViewSalesView(View):
    def get(self, request, *args, **kwargs):
        sales = Sales.objects.values().all()
        sale_list = [[sale['no'], sale['bill_number'], sale['date'], sale['psr'], sale['customer_code'],
                      sale['name'], sale['area'], sale['group'], sale['good_code'], sale['goods'], sale['unit'],
                      sale['original_value'], sale['original_output_value'], sale['secondary_output_value'],
                      sale['price'], sale['original_price'], sale['discount_percentage'], sale['amount_sale'],
                      sale['discount'], sale['additional_sales'], sale['net_sales'], sale['discount_percentage_2'],
                      sale['real_discount_percentage'], sale['payment_cash'], sale['payment_check'], sale['balance'],
                      sale['saler'], sale['currency'], sale['dollar'], sale['manager_rating'], sale['senior_saler'],
                      sale['tot_monthly_sales'], sale['receipment'], sale['ct'], sale['payment_type'], sale['customer_size'],
                      sale['saler_factor'], sale['prim_percentage'], sale['bonus_factor'], sale['bonus']]
                     for sale in sales]
        return JsonResponse(sale_list, safe=False)

class DeleteSaleView(View):
    def post(self, request, *args, **kwargs):
        no = request.POST.get('no', None)
        product_code = request.POST.get('good_code', None)
        original_output_value = request.POST.get('original_output_value', None)
        Sales.objects.filter(no=no).delete()
        try:
            warehouse_item = Warehouse.objects.get(product_code=product_code)
            warehouse_item.stock += float(original_output_value)
            warehouse_item.save()
        except Warehouse.DoesNotExist:
            warehouse_item = None
        return HttpResponse('OK')

# endregion

# region Warehouse

class AddWarehouseView(View):
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = pd.read_excel(request.FILES['file'])
            for i, row in data.iterrows():
                product_code = row["Product Code"]
                if Warehouse.objects.filter(product_code=product_code).exists():
                    continue
                warehouse_item = Warehouse(product_code=product_code, title=row["Product Title"], unit=row["Unit"], stock=row["Stock"])
                warehouse_item.save()
            return render(request, 'success.html', {})
        return render(request, 'upload.html', {})

class ViewWarehouseView(View):
    def get(self, request, *args, **kwargs):
        warehouse_items = Warehouse.objects.values().all()
        warehouse_list = [[item['product_code'], item['title'], item['unit'], item['stock']] for item in warehouse_items]
        return JsonResponse(warehouse_list, safe=False)

class DeleteWarehouseView(View):
    def post(self, request, *args, **kwargs):
        product_code = request.POST.get('product_code')
        Warehouse.objects.filter(product_code=product_code).delete()
        return HttpResponse('OK')



# endregion

# region Products

class AddProductsView(View):
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            data = pd.read_excel(request.FILES['file'])
            for i, row in data.iterrows():
                product_code_ir = row["Product Number IR"]
                if Products.objects.filter(product_code_ir=product_code_ir).exists():
                    continue
                product = Products(
                    group=row["Group"],
                    subgroup=row["Subgroup"],
                    feature=row["Feature"],
                    product_code_ir=product_code_ir,
                    product_code_tr=row["Product Number TR"],
                    description_tr=row["Description TR"],
                    description_ir=row["Description IR"],
                    unit=row["Unit"],
                    unit_secondary=row["Unit Secondary"],
                    weight = row["Weight"],
                    currency = row["Currency"],
                    price= row["Price"]
                )
                product.save()
            return render(request, 'success.html', {})
        return render(request, 'upload.html', {})

class ViewProductsView(View):
    def get(self, request, *args, **kwargs):
        products = Products.objects.values().all()
        product_list = [[p['group'], p['subgroup'], p['feature'], p['product_code_ir'], p['product_code_tr'],
                         p['description_tr'], p['description_ir'], p['unit'], p['unit_secondary'],p['weight'],p['currency'], p['price']] for p in products]
        return JsonResponse(product_list, safe=False)

class DeleteProductView(View):
    def post(self, request, *args, **kwargs):
        product_code_ir = request.POST.get('product_code_ir')
        Products.objects.filter(product_code_ir=product_code_ir).delete()
        return HttpResponse('OK')

# endregion

# region Charts

class ChartView(View):
    def post(self, request, *args, **kwargs):
        #start_date = request.POST.get('start_date')
        #end_date = request.POST.get('end_date')
        #product_code = request.POST.get('product_code')
        #start_date = date(1400,4,1)
        #end_date = date(1400,4,30)
        data = Sales.objects.filter(group = "Boya").values('date', 'original_output_value')
        date_list = [obj['date'] for obj in data]
        output_value_list = [obj['original_output_value'] for obj in data]
        response_data = {'date_list': date_list, 'output_value_list': output_value_list}

        return JsonResponse(response_data, safe=False)

class ItemListView(View):
    def get(self, request, *args, **kwargs):
        product_codes = Products.objects.values_list('product_code_ir', flat=True)
        return JsonResponse(list(product_codes), safe=False)
    
    def post(self, request, *args, **kwargs):
        # Get the product_title from the POST data

        data = json.loads(request.body)
        product_code = data.get('product_code')

        # Filter Sales by the product_title
        data = Sales.objects.filter(good_code=product_code).values('date', 'original_output_value')
        product_name = Products.objects.filter(product_code_ir=product_code).values('description_ir')
        # Get the original_output_value of each sale
        date_list = [obj['date'] for obj in data]
        output_value_list = [obj['original_output_value'] for obj in data]
        product_name = [obj["product_title"] for obj in product_name]

        response_data = {'product_name':product_name ,'date_list': date_list, 'output_value_list': output_value_list}

        # Return the list of output_values as a JSON response
        return JsonResponse(response_data, safe=False)

# endregion 

# region ROP
@receiver(post_save, sender=Warehouse)
def create_rop_for_warehouse(sender, instance, created, **kwargs):
    if created:
        sales = Sales.objects.filter(good_code=instance.good_code)
        product = Products.objects.filter(product_code_ir = instance.product_code)
        rop = ROP(
            group = product.group,
            subgroup = product.subgroup,
            feature = product.feature,
            new_or_old_product = None,
            related = None,
            origin = None,
            product_code_ir = instance.product_code,
            product_code_tr = product.product_code_tr,
            dont_order_again = None,
            description_tr = product.description_tr,
            description_ir = product.description_ir,
            unit = product.unit,
            weight = product.weight,
            unit_secondary = product.unit_secondary,
            price = product.price,
            #color_making_room_1400 = None,
            avarage_previous_year = None,
            month_1 = None,
            month_2 = None,
            month_3 = None,
            month_4 = None,
            month_5 = None,
            month_6 = None,
            month_7 = None,
            month_8 = None,
            month_9 = None,
            month_10 = None,
            month_11 = None,
            month_12 = None,
            total_sale = None,
            warehouse = None,
            goods_on_the_road = None,
            total_stock_all = None,
            total_month_stock = None,
            standart_deviation = None,
            lead_time = None,
            product_coverage_percentage = None,
            demand_status = None,
            safety_stock = None,
            rop = None,
            monthly_mean = None,
            new_party = None,
            cycle_service_level = None,
            total_stock = None,
            need_prodcuts = None,
            over_stock = None,
            calculated_need = None,
            calculated_max_stock = None,
            calculated_min_stock = None,
            )
        rop.save()
# endregion













