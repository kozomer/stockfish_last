from django.shortcuts import render
import pandas as pd
from .models import Customers, Products, Sales, Warehouse, ROP, Salers, SalerPerformance, SaleSummary, SalerMonthlySaleRating, MonthlyProductSales,CustomerPerformance, ProductPerformance
from django.views import View
from rest_framework.views import APIView
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
import json
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .definitions import jalali_to_greg, greg_to_jalali, calculate_experience_rating, calculate_sale_rating, current_jalali_date, get_exchange_rate
from datetime import datetime
import datetime
import jdatetime
from django.db.models import Sum
from django.views.decorators.csrf import csrf_exempt


from django.contrib.auth import authenticate


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import  permission_classes, authentication_classes
from django.db.utils import OperationalError
from rest_framework.exceptions import ValidationError
import filetype




# region Login/Logout

class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        username = data.get('username')
        username = username.strip()
        password = data.get('password')
       
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_active:
            response = super().post(request, *args, **kwargs)
            return response
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def post(self, request):
        try:
            refresh_token = request.POST.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()

            return JsonResponse({'success': 'successfully log out'}, status=205)
        except Exception as e:
            return JsonResponse({'error': 'BAD REQUEST'}, status=400)



# endregion

# region Customers

class AddCustomersView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    
    def post(self, request, *args, **kwargs):
        try:
            if 'file' not in request.FILES:
                raise ValidationError("No file uploaded")
            file = request.FILES['file']
            kind = filetype.guess(file.read())
            if kind is None or kind.mime not in ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
                return JsonResponse({'error': "The uploaded file is not a valid Excel file1"}, status=400)

            data = pd.read_excel(file)
            if data.empty:
                return JsonResponse({'error': "The uploaded file is empty"}, status=400)
            count = 0
            for i, row in data.iterrows():
                try:
                    customer_code = row["Customer Code"]
                    if Customers.objects.filter(customer_code=customer_code).exists():
                        continue
                    count+=1
                    customer = Customers(customer_code=customer_code, description=row["Description"], quantity=row["Quantity"],
                                        area_code=row["Area Code"], code=row["Code"], city=row["City"], area=row["Area"])
                    customer.save()
                except KeyError as e:
                    return JsonResponse({'error': f"Column '{e}' not found in the uploaded file"}, status=400)
            return JsonResponse({'message': f"{count} Customers data added successfully"}, status=200)
        except OperationalError as e:
            return JsonResponse({'error': f"Database error: {str(e)}"}, status=500)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

class ViewCustomersView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def get(self,request,*args, **kwargs):
         customers = Customers.objects.values().all()
         customer_list = [[customer['customer_code'], customer['description'], customer['quantity'],
                      customer['area_code'], customer['code'], customer['city'], customer['area']]
                     for customer in customers]
         return JsonResponse(customer_list,safe=False)

class DeleteCustomerView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def post(self, request, *args, **kwargs):
        customer_code = request.POST.get('customer_code')
        Customers.objects.filter(customer_code=customer_code).delete()
        return HttpResponse('OK')


class EditCustomerView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

            # Check if old_customer_code is provided
            old_customer_code = data.get('old_customer_code')
            if not old_customer_code:
                return JsonResponse({'error': "Missing required parameter: old_customer_code"}, status=400)

            # Get the customer object
            customer = Customers.objects.get(customer_code=old_customer_code)

            # Check if new_customer_code value is unique and not empty
            new_customer_code = data.get('new_customer_code')
            if new_customer_code and new_customer_code != old_customer_code:
                if not new_customer_code:
                    return JsonResponse({'error': "Customer Code cannot be empty!"}, status=400)
                if Customers.objects.filter(customer_code=new_customer_code).exists():
                    return JsonResponse({'error': f"The customer code '{new_customer_code}' already exists in the database."}, status=400)
                else:
                    customer.customer_code = new_customer_code

            # Update other customer fields
            for field in ['description', 'quantity', 'area_code', 'code', 'city', 'area']:
                value = data.get(f'new_{field}')
                if value is not None and value != '':
                    setattr(customer, field, value)
                else: 
                    return JsonResponse({'error': "One or more data field is empty!"}, status=400)


            customer.save()
            return JsonResponse({'message': "Your changes have been successfully saved"}, status=200)

        except Customers.DoesNotExist:
            return JsonResponse({'error': "Customernot found!"}, status=400)

        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)






# class EditCustomerView(APIView):
#     permission_classes = (IsAuthenticated,)
#     authentication_classes = (JWTAuthentication,)
#     def post(self, request, *args, **kwargs):
#         data = json.loads(request.body)
#         old_customer_code = data.get('old_customer_code')
#         customer = Customers.objects.get(customer_code=old_customer_code)

#         # Check if new customer_code value is unique
#         new_customer_code = data.get('new_customer_code')
#         if new_customer_code and new_customer_code != old_customer_code:
#             if Customers.objects.filter(customer_code=new_customer_code).exists():
#                 error_message = f"The customer code '{new_customer_code}' already exists in the database."
#                 return HttpResponseBadRequest(error_message)
#             else:
#                 customer.customer_code = new_customer_code

#         # Update other customer fields
#         customer.description = data.get('new_description')
#         customer.quantity = data.get('new_quantity')
#         customer.area_code = data.get('new_area_code')
#         customer.code = data.get('new_code')
#         customer.city = data.get('new_city')
#         customer.area = data.get('new_area')

#         customer.save()
        
#         return HttpResponse('OK')


# endregion

# region Sales

class AddSalesView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request, *args, **kwargs):
        try:
            if 'file' not in request.FILES:
                return JsonResponse({'error': "No file uploaded"}, status=400)
            
            file = request.FILES['file']
            kind = filetype.guess(file.read())
            
            if kind is None or kind.mime not in ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
                return JsonResponse({'error': "The uploaded file is not a valid Excel file"}, status=400)

            data = pd.read_excel(file)
            if data.empty:
                return JsonResponse({'error': "The uploaded file is empty"}, status=400)

            count = 0
            for i, row in data.iterrows():
                no = row["No"]
                if Sales.objects.filter(no=no).exists():
                    continue
                count += 1

                # Check required fields
                for field in ['Good Code', 'Customer Code', 'Original Output Value', 'Net Sales', 'Saler', 'PSR']:
                    if not row[field]:
                        return JsonResponse({'error': f"{field} cannot be empty"}, status=400)

                # Check integer fields
                for field in ['Good Code', 'Customer Code']:
                    try:
                        if not isinstance(int(row[field]), int):
                            return JsonResponse({'error': f"{field} should be integer"}, status=400)
                    except Exception:
                            return JsonResponse({'error': f"{field} should be integer"}, status=400)


                # Check valid date format
                try:
                    date = jdatetime.date(int(row["Year"]), int(row["Month"]), int(row["Day"]))
                except ValueError:
                    return JsonResponse({'error': "Date should be in the format of YYYY-MM-DD"}, status=400)
                except IndexError as e:
                    return JsonResponse({'error': "Date should be in the format of YYYY-MM-DD"}, status=400)
                except Exception as e:
                    return JsonResponse({'error': "Date should be in the format of YYYY-MM-DD"}, status=400)

                # Check valid psr value
                if row['PSR'] not in ['P', 'S', 'R']:
                    return JsonResponse({'error': "Invalid P-S-R value. Allowed values are 'P', 'S', and 'R'."}, status=400)

                # Check for existing good
                if not Warehouse.objects.filter(product_code=row['Good Code']).exists():
                    return JsonResponse({'error': f"No good found with code '{row['Good Code']}'"}, status=400)
                    

                # Check for existing customer
                if not Customers.objects.filter(customer_code=row['Customer Code']).exists():
                    return JsonResponse({'error': f"No customer found with code '{row['Customer Code']}'"}, status=400)

                # Check for existing saler
                if not Salers.objects.filter(name=row['Saler']).exists():
                    return JsonResponse({'error': f"No saler found with name '{row['Saler']}'"}, status=400)


                # Save the Sale object
                sale = Sales(
                    no=no,
                    bill_number=row["Bill Number"],
                    date=date,
                    psr=row["PSR"],
                    customer_code=row["Customer Code"],
                    name=row["Name"],
                    area=row["Area"],
                    group=row["Group"],
                    good_code=row["Good Code"],
                    goods=row["Goods"],
                    unit=row["Unit"],
                    original_value=row["The Original Value"],
                    original_output_value=row["Original Output Value"],
                    secondary_output_value=row["Secondary Output Value"],
                    price=row["Price"],
                    original_price=row["Original Price"],
                    discount_percentage=row["Discount Percantage (%)"],
                    amount_sale=row["Amount Sale"],
                    discount=row["Discount"],
                    additional_sales=row["Additional Sales"],
                    net_sales=row["Net Sales"],
                    discount_percentage_2=row["Discount Percantage 2(%)"],
                    real_discount_percentage=row["Real Discount Percantage (%)"],
                    payment_cash=row["Payment Cash"],
                    payment_check=row["Payment Check"],
                    balance=row["Balance"],
                    saler=row["Saler"],
                    currency=row["Currency"],
                    dollar=row["Dollar"],
                    manager_rating=row["Manager Rating"],
                    senior_saler=row["Senior Saler"],
                    tot_monthly_sales=row["Tot Monthly Sales"],
                    receipment=row["Receipment"],
                    ct=row["CT"],
                    payment_type=row["Payment Type"],
                    customer_size=row["Customer Size"],
                    saler_factor=row["Saler Factor"],
                    prim_percentage=row["Prim Percantage"],
                    bonus_factor=row["Bonus Factor"],
                    bonus=row["Bonus"]
                )
                sale.save()

                # Update stock in warehouse
                try:
                    warehouse_item = Warehouse.objects.get(product_code=sale.good_code)
                    warehouse_item.stock -= sale.original_output_value
                    warehouse_item.save()
                except Warehouse.DoesNotExist:
                    pass #TODO: Further add a error message that is "this item does not exist in warehouse"

                count += 1
            return JsonResponse({'message': f"{count} sales data added successfully"}, status=200)

        except OperationalError as e:
            return JsonResponse({'error': f"Database error: {str(e)}"}, status=500)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)



# class AddSalesView(APIView):
#     permission_classes = (IsAuthenticated,)
#     authentication_classes = (JWTAuthentication,)

#     def post(self, request, *args, **kwargs):
#         try:
#             if 'file' not in request.FILES:
#                 raise ValidationError("No file uploaded")
#             file = request.FILES['file']
#             kind = filetype.guess(file.read())
#             if kind is None or kind.mime not in ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
#                 return JsonResponse({'error': "The uploaded file is not a valid Excel file1"}, status=400)

#             data = pd.read_excel(file)
#             if data.empty:
#                 return JsonResponse({'error': "The uploaded file is empty"}, status=400)
#             count = 0
#             for i, row in data.iterrows():
#                 no = row["No"]
#                 if Sales.objects.filter(no=no).exists():
#                     continue
#                 count+=1
#                 sale = Sales(
#                     no=no,
#                     bill_number=row["Bill Number"],
#                     date=jdatetime.date(int(row["Year"]), int(row["Month"]), int(row["Day"])),
#                     psr=row["PSR"],
#                     customer_code=row["Customer Code"],
#                     name=row["Name"],
#                     area=row["Area"],
#                     group=row["Group"],
#                     good_code=row["Good Code"],
#                     goods=row["Goods"],
#                     unit=row["Unit"],
#                     original_value=row["The Original Value"],
#                     original_output_value=row["Original Output Value"],
#                     secondary_output_value=row["Secondary Output Value"],
#                     price=row["Price"],
#                     original_price=row["Original Price"],
#                     discount_percentage=row["Discount Percantage (%)"],
#                     amount_sale=row["Amount Sale"],
#                     discount=row["Discount"],
#                     additional_sales=row["Additional Sales"],
#                     net_sales=row["Net Sales"],
#                     discount_percentage_2=row["Discount Percantage 2(%)"],
#                     real_discount_percentage=row["Real Discount Percantage (%)"],
#                     payment_cash=row["Payment Cash"],
#                     payment_check=row["Payment Check"],
#                     balance=row["Balance"],
#                     saler=row["Saler"],
#                     currency=row["Currency"],
#                     dollar=row["Dollar"],
#                     manager_rating=row["Manager Rating"],
#                     senior_saler=row["Senior Saler"],
#                     tot_monthly_sales=row["Tot Monthly Sales"],
#                     receipment=row["Receipment"],
#                     ct=row["CT"],
#                     payment_type=row["Payment Type"],
#                     customer_size=row["Customer Size"],
#                     saler_factor=row["Saler Factor"],
#                     prim_percentage=row["Prim Percantage"],
#                     bonus_factor=row["Bonus Factor"],
#                     bonus=row["Bonus"]
#                 )
#                 sale.save()

#                 try:
#                     warehouse_item = Warehouse.objects.get(product_code=sale.good_code)
#                     warehouse_item.stock -= sale.original_output_value
#                     warehouse_item.save()
#                 except Warehouse.DoesNotExist:
#                     pass #TODO: Further add a error message that is "this item does not exist in warehouse"

#             return JsonResponse({'message': f"{count} sales data added successfully"}, status=200)
#         except OperationalError as e:
#             return JsonResponse({'error': f"Database error: {str(e)}"}, status=500)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)


class ViewSalesView(APIView):
    permission_classes = [IsAuthenticated,]
    authentication_classes = [JWTAuthentication,]
    def get(self, request, *args, **kwargs):
        sales = Sales.objects.values().all()
        sale_list = [[sale['no'], sale['bill_number'], sale['date'].strftime('%Y-%m-%d'), sale['psr'], sale['customer_code'],
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

class DeleteSaleView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
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
            warehouse_item = None #! give an error
        return HttpResponse('OK')

class EditSaleView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            print(data)

            # Check for required fields
            for field in ['new_good_code', 'new_customer_code', 'new_original_output_value', 'new_net_sales', 'new_saler', 'new_psr', 'new_date']:
                if not data.get(field):
                    return JsonResponse({'error': f"{field} cannot be empty"}, status=400)

            # Check for integer fields
            for field in ['new_good_code', 'new_customer_code']:
                try:
                    if not isinstance(int(data.get(field)), int):
                        return JsonResponse({'error': f"{field} should be integer"}, status=400)
                except Exception as e:
                    return JsonResponse({'error': f"{field} should be integer"}, status=400)

            # Check for valid date format
            try:
                new_date = data.get('new_date').split("-")
                date = jdatetime.date(int(new_date[0]), int(new_date[1]), int(new_date[2]))
            except ValueError:
                return JsonResponse({'error': "The date you entered is in the wrong format. The correct date format is 'YYYY-MM-DD'"}, status=400)
            except IndexError as e:
                return JsonResponse({'error': "The date you entered is in the wrong format. The correct date format is 'YYYY-MM-DD'"}, status=400)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)
            # Check for valid psr value
            if data.get('new_psr') not in ['P', 'S', 'R']:
                return JsonResponse({'error': "Invalid P-S-R value. Allowed values are 'P', 'S', and 'R'."}, status=400)

            # Check for existing good
            if not Warehouse.objects.filter(product_code=data.get('new_good_code')).exists():
                return JsonResponse({'error': f"No product found with code '{data.get('new_good_code')}' in Warehouse. Please check product code. If there is a new product please add firstly to Warehouse."}, status=400)
            if not Products.objects.filter(product_code_ir=data.get('new_good_code')).exists():
                return JsonResponse({'error': f"No product found with code '{data.get('new_good_code')}'. Please check product code. If there is a new product please add firstly to Products."}, status=400)
            # Check for existing customer
            if not Customers.objects.filter(customer_code=data.get('new_customer_code')).exists():
                return JsonResponse({'error': f"No customer found with code '{data.get('new_customer_code')}'. Please check customer code. If there is a new customer please add firstly to Customers."}, status=400)

            # Check for existing saler
            if not Salers.objects.filter(name=data.get('new_saler')).exists():
                return JsonResponse({'error': f"No saler found with name '{data.get('new_saler')}'. Please check saler name. If there is a new saler please add firstly to Salers."}, status=400)
            
            # Update Sale object
            old_no = data.get('old_no')
            if data.get('new_no') and data.get('new_no') != old_no:
                if Sales.objects.filter(no=data.get('new_no')).exists():
                    error_message = f"The sale no '{data.get('new_no')}' already exists in the database."
                    return JsonResponse({'error': error_message}, status=400)
            sale = Sales.objects.get(no=old_no)
            sale.no = data.get('new_no')
            sale.bill_number = data.get('new_bill_number')
            sale.date = date
            sale.psr = data.get('new_psr')
            sale.customer_code = data.get('new_customer_code')
            sale.name = data.get('new_name')
            sale.area = data.get('new_area')
            sale.group = data.get('new_group')
            sale.good_code = data.get('new_good_code')
            sale.goods = data.get('new_goods')
            sale.unit = data.get('new_unit')
            sale.original_value = data.get('new_original_value')
            sale.original_output_value = data.get('new_original_output_value')
            sale.secondary_output_value = data.get('new_secondary_output_value')
            sale.price = data.get('new_price')
            sale.original_price = data.get('new_original_price')
            sale.discount_percentage = data.get('new_discount_percentage')
            sale.amount_sale = data.get('new_amount_sale')
            sale.discount = data.get('new_discount')
            sale.additional_sales = data.get('new_additional_sales')
            sale.net_sales = data.get('new_net_sales')
            sale.discount_percentage_2 = data.get('new_discount_percentage_2')
            sale.real_discount_percentage = data.get('new_real_discount_percentage')
            sale.payment_cash = data.get('new_payment_cash')
            sale.payment_check = data.get('new_payment_check')
            sale.balance = data.get('new_balance')
            sale.saler = data.get('new_saler')
            sale.currency = data.get('new_currency')
            sale.dollar = data.get('new_dollar')
            sale.manager_rating = data.get('new_manager_rating')
            sale.senior_saler = data.get('new_senior_saler')
            sale.tot_monthly_sales = data.get('new_tot_monthly_sales')
            sale.receipment = data.get('new_receipment')
            sale.ct = data.get('new_ct')
            sale.payment_type = data.get('new_payment_type')
            sale.customer_size = data.get('new_customer_size')
            sale.saler_factor = data.get('new_saler_factor')
            sale.prim_percentage = data.get('new_prim_percentage')
            sale.bonus_factor = data.get('new_bonus_factor')
            sale.bonus = data.get('new_bonus')

            sale.save()

            return JsonResponse({'message': "Your changes have been successfully saved"}, status=200)

        except Sales.DoesNotExist:
            return JsonResponse({'error': "Sale not found!"}, status=400)

        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

           


# class EditSaleView(APIView):
#     permission_classes = (IsAuthenticated,)
#     authentication_classes = (JWTAuthentication,)
#     def post(self, request, *args, **kwargs):
#         data = json.loads(request.body)
#         old_no = data.get('old_no')
#         sale = Sales.objects.get(no=old_no)

#         # Check if new customer_code value is unique
#         new_no = data.get('new_no')
#         new_original_output_value = data.get('new_original_output_value')
#         old_original_output_value = data.get('old_original_output_value')
#         new_date = data.get('new_date').split("-")
#         if new_no and new_no != old_no:
#             if Sales.objects.filter(no=new_no).exists():
#                 error_message = f"The sale no '{new_no}' already exists in the database."
#                 return HttpResponseBadRequest(error_message)
#             else:
#                 sale.no = new_no

#         # Update other sale fields
#         sale.bill_number = data.get('new_bill_number')
#         sale.date = jdatetime.date(int(new_date[0]), int(new_date[1]), int(new_date[2]))
#         sale.psr = data.get('new_psr')
#         sale.customer_code = data.get('new_customer_code')
#         sale.name = data.get('new_name')
#         sale.area = data.get('new_area')
#         sale.group = data.get('new_group')
#         sale.good_code = data.get('new_good_code')
#         sale.goods = data.get('new_goods')
#         sale.unit = data.get('new_unit')
#         sale.original_value = data.get('new_original_value')
#         sale.original_output_value = data.get('new_original_output_value')
#         sale.secondary_output_value = data.get('new_secondary_output_value')
#         sale.price = data.get('new_price')
#         sale.original_price = data.get('new_original_price')
#         sale.discount_percentage = data.get('new_discount_percentage')
#         sale.amount_sale = data.get('new_amount_sale')
#         sale.discount = data.get('new_discount')
#         sale.additional_sales = data.get('new_additional_sales')
#         sale.net_sales = data.get('new_net_sales')
#         sale.discount_percentage_2 = data.get('new_discount_percentage_2')
#         sale.real_discount_percentage = data.get('new_real_discount_percentage')
#         sale.payment_cash = data.get('new_payment_cash')
#         sale.payment_check = data.get('new_payment_check')
#         sale.balance = data.get('new_balance')
#         sale.saler = data.get('new_saler')
#         sale.currency = data.get('new_currency')
#         sale.dollar = data.get('new_dollar')
#         sale.manager_rating = data.get('new_manager_rating')
#         sale.senior_saler = data.get('new_senior_saler')
#         sale.tot_monthly_sales = data.get('new_tot_monthly_sales')
#         sale.receipment = data.get('new_receipment')
#         sale.ct = data.get('new_ct')
#         sale.payment_type = data.get('new_payment_type')
#         sale.customer_size = data.get('new_customer_size')
#         sale.saler_factor = data.get('new_saler_factor')
#         sale.prim_percentage = data.get('new_prim_percentage')
#         sale.bonus_factor = data.get('new_bonus_factor')
#         sale.bonus = data.get('new_bonus')

#         sale.save()
#         try:
#             warehouse_item = Warehouse.objects.get(product_code=sale.good_code)
#             output_change = old_original_output_value-new_original_output_value
#             warehouse_item.stock += float(output_change)
#             warehouse_item.save()
#         except Warehouse.DoesNotExist:
#             warehouse_item = None
        
        

        
#         return HttpResponse('OK')

# endregion

# region Warehouse

class AddWarehouseView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    
    def post(self, request, *args, **kwargs):
        try:
            if 'file' not in request.FILES:
                raise ValidationError("No file uploaded")
            file = request.FILES['file']
            kind = filetype.guess(file.read())
            if kind is None or kind.mime not in ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
                return JsonResponse({'error': "The uploaded file is not a valid Excel file"}, status=400)

            data = pd.read_excel(file)
            if data.empty:
                return JsonResponse({'error': "The uploaded file is empty"}, status=400)
            count = 0
            for i, row in data.iterrows():
                try:
                    product_code = row["Product Code"]
                    if Warehouse.objects.filter(product_code=product_code).exists():
                        continue
                    count+=1
                    warehouse_item = Warehouse(product_code=product_code, title=row["Product Title"], unit=row["Unit"], stock=row["Stock"])
                    warehouse_item.save()
                except KeyError as e:
                    return JsonResponse({'error': f"Column '{e}' not found in the uploaded file"}, status=400)
            return JsonResponse({'message': f"{count} Warehouse items added successfully"}, status=200)
        except OperationalError as e:
            return JsonResponse({'error': f"Database error: {str(e)}"}, status=500)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

class ViewWarehouseView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def get(self, request, *args, **kwargs):
        # if not request.user.is_authenticated:
        #     return HttpResponse(status=401)
        warehouse_items = Warehouse.objects.values().all()
        warehouse_list = [[item['product_code'], item['title'], item['unit'], item['stock']] for item in warehouse_items]
        return JsonResponse(warehouse_list, safe=False)

class DeleteWarehouseView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def post(self, request, *args, **kwargs):
        product_code = request.POST.get('product_code')
        Warehouse.objects.filter(product_code=product_code).delete()
        return HttpResponse('OK')


class EditWarehouseView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

            # Check if old_product_code is provided
            old_product_code = data.get('old_product_code')
            if not old_product_code:
                return JsonResponse({'error': "Missing required parameter: Product Code"}, status=400)

            # Get the warehouse item object
            warehouse_item = Warehouse.objects.get(product_code=old_product_code)

            # Check if new_product_code value is unique and not empty
            new_product_code = data.get('new_product_code')
            if new_product_code and new_product_code != old_product_code:
                if not new_product_code:
                    return JsonResponse({'error': "Product Code cannot be empty!"}, status=400)
                if Warehouse.objects.filter(product_code=new_product_code).exists():
                    return JsonResponse({'error': f"The product code '{new_product_code}' already exists in the warehouse."}, status=400)
                else:
                    warehouse_item.product_code = new_product_code

            # Update other warehouse item fields
            for field in ['new_title', 'new_unit', 'new_stock']:
                value = data.get(field)
                if value is not None and value != '':
                    setattr(warehouse_item, field, value)
                else: 
                    return JsonResponse({'error': f"{field} cannot be empty!"}, status=400)


            warehouse_item.save()
            return JsonResponse({'message': "Your changes have been successfully saved"}, status=200)

        except Warehouse.DoesNotExist:
            return JsonResponse({'error': "Warehouse item not found!"}, status=400)

        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)






# class EditWarehouseView(APIView):
#     permission_classes = (IsAuthenticated,)
#     authentication_classes = (JWTAuthentication,)
#     def post(self, request, *args, **kwargs):
#         data = json.loads(request.body)
#         old_product_code = data.get('old_product_code')
#         warehouse_item = Warehouse.objects.get(product_code=old_product_code)

#         # Check if new product_code value is unique
#         new_product_code = data.get('new_product_code')
#         if new_product_code and new_product_code != old_product_code:
#             if Warehouse.objects.filter(product_code=new_product_code).exists():
#                 error_message = f"The product code '{new_product_code}' already exists in the warehouse."
#                 return HttpResponseBadRequest(error_message)
#             else:
#                 warehouse_item.product_code = new_product_code

#         # Update other warehouse_item fields
#         warehouse_item.title = data.get('title')
#         warehouse_item.unit = data.get('unit')
#         warehouse_item.stock = data.get('stock')

#         warehouse_item.save()
#         return HttpResponse('OK')



# endregion

# region Products

class AddProductsView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request, *args, **kwargs):
        try:
            if 'file' not in request.FILES:
                raise ValidationError("No file uploaded")
            file = request.FILES['file']
            kind = filetype.guess(file.read())
            if kind is None or kind.mime not in ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']:
                return JsonResponse({'error': "The uploaded file is not a valid Excel file"}, status=400)

            data = pd.read_excel(file)
            print(data)
            if data.empty:
                return JsonResponse({'error': "The uploaded file is empty"}, status=400)
            count = 0
            for i, row in data.iterrows():
                try:
                    product_code_ir = row["Product Number IR"]
                    if Products.objects.filter(product_code_ir=product_code_ir).exists():
                        continue
                    count+=1
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
                    print(row["Subgroup"])
                    product.save()
                except KeyError as e:
                    return JsonResponse({'error': f"Column '{e}' not found in the uploaded file"}, status=400)
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=400)
            return JsonResponse({'message': f"{count} Products data added successfully"}, status=200)
        except OperationalError as e:
            return JsonResponse({'error': f"Database error: {str(e)}"}, status=500)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class ViewProductsView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def get(self, request, *args, **kwargs):
        products = Products.objects.values().all()
        product_list = [[p['group'], p['subgroup'], p['feature'], p['product_code_ir'], p['product_code_tr'],
                         p['description_tr'], p['description_ir'], p['unit'], p['unit_secondary'],p['weight'],p['currency'], p['price']] for p in products]
        return JsonResponse(product_list, safe=False)

class DeleteProductView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def post(self, request, *args, **kwargs):
        product_code_ir = request.POST.get('product_code_ir')
        Products.objects.filter(product_code_ir=product_code_ir).delete()
        return HttpResponse('OK')

class EditProductView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

            old_product_code_ir = data.get('old_product_code_ir')
            product = Products.objects.get(product_code_ir=old_product_code_ir)

            # Check if new product_code_ir value is unique
            new_product_code_ir = data.get('new_product_code_ir')
            if new_product_code_ir and new_product_code_ir != old_product_code_ir:
                if Products.objects.filter(product_code_ir=new_product_code_ir).exists():
                    return JsonResponse({'error': f"The Product Code IR '{new_product_code_ir}' already exists in the database."}, status=400)
                if not new_product_code_ir:
                    return JsonResponse({'error': "Product Code IR cannot be empty!"}, status=400)
                else:
                    product.product_code_ir = new_product_code_ir

            # Update other product fields
            for field in [ 'new_product_code_tr', 'new_description_tr', 'new_description_ir', 'new_unit', 'new_weight', 'new_currency', 'new_price']:
                value = data.get(field)
                if value is not None and value != '':
                    setattr(product, field, value)
                else:
                    return JsonResponse({'error': f"The field '{field}' cannot be empty."}, status=400)

            product.save()
            return JsonResponse({'message': "Your changes have been successfully saved."}, status=200)

        except Products.DoesNotExist:
            return JsonResponse({'error': "Product not found."}, status=400)

        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)





# class EditProductView(APIView):
#     permission_classes = (IsAuthenticated,)
#     authentication_classes = (JWTAuthentication,)
#     def post(self, request, *args, **kwargs):
#         data = json.loads(request.body)
#         old_product_code_ir = data.get('old_product_code_ir')
#         product = Products.objects.get(product_code_ir=old_product_code_ir)

#         # Check if new product_code_ir value is unique
#         new_product_code_ir = data.get('new_product_code_ir')
#         if new_product_code_ir and new_product_code_ir != old_product_code_ir:
#             if Products.objects.filter(product_code_ir=new_product_code_ir).exists():
#                 error_message = f"The product code '{new_product_code_ir}' already exists in the database."
#                 return HttpResponseBadRequest(error_message)
#             else:
#                 product.product_code_ir = new_product_code_ir

#         # Update other product fields
#         product.group = data.get('new_group')
#         product.subgroup = data.get('new_subgroup')
#         product.feature = data.get('new_feature')
#         product.product_code_tr = data.get('new_product_code_tr')
#         product.description_tr = data.get('new_description_tr')
#         product.description_ir = data.get('new_description_ir')
#         product.unit = data.get('new_unit')
#         product.unit_secondary = data.get('new_unit_secondary')
#         product.weight = data.get('new_weight')
#         product.currency = data.get('new_currency')
#         product.price = data.get('new_price')
#         product.save()
#         return HttpResponse('OK')


# endregion

# region Charts

class ChartView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
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

class ItemListView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
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
        sales = Sales.objects.filter(good_code=instance.product_code)
        try:
            product = Products.objects.get(product_code_ir = instance.product_code)
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

        except Products.DoesNotExist:
            pass
        
        
# endregion

# region Saler
class AddSalerView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            jalali_date = data.get("job_start_date").split("-")
            try:
                jalali_date = jdatetime.date(int(jalali_date[0]), int(jalali_date[1]), int(jalali_date[2]))
            except ValueError:
                return JsonResponse({'error': "The date you entered is in the wrong format. The correct date format is 'YYYY-MM-DD'"}, status=400)
            except IndexError as e:
                return JsonResponse({'error': "The date you entered is in the wrong format. The correct date format is 'YYYY-MM-DD'"}, status=400)
            except Exception as e:
                return JsonResponse({'error': "The date you entered is in the wrong format. The correct date format is 'YYYY-MM-DD'"}, status=400)

            saler = Salers(
                name = data.get("name"),
                job_start_date = jalali_date,
                manager_performance_rating = 1,
                experience_rating = calculate_experience_rating(jalali_date),
                monthly_total_sales_rating = 1, #will be calculated!!!!!!!!!!!!!!!!!!!!!!
                receipment_rating = 1, #will be calculated!!!!!!!!!!!!!!!!!!!!!!
                is_active =  True,
            )
            saler.save()
            return JsonResponse({'message': "Saler added successfully"}, status=200)
        except IndexError as e:
            return JsonResponse({'error': "The date you entered is in the wrong format. The correct date format is 'YYYY-MM-DD' "}, status=400)
        except ValueError as e:
            return JsonResponse({'error': "The date you entered is in the wrong format. The correct date format is 'YYYY-MM-DD' "}, status=400)
        except Exception as e:
             return JsonResponse({'error': str(e)}, status=500)

class EditSalerView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

            # Check if name is provided
            name = data.get('name')
            if not name:
                return JsonResponse({'error': "Missing required parameter: 'name'"}, status=400)
            
            # Get the saler object
            saler = Salers.objects.get(id=data.get('id'))

            
            
            # Update other saler fields
            for field in ['new_name', 'new_job_start_date', 'new_manager_performance_rating', 'new_is_active']:
                if field == "new_job_start_date":
                    try:
                        new_date = data.get('new_job_start_date').split("-")
                        date = jdatetime.date(int(new_date[0]), int(new_date[1]), int(new_date[2]))
                    except ValueError:
                        return JsonResponse({'error': "The date you entered is in the wrong format. The correct date format is 'YYYY-MM-DD'"}, status=400)
                    except IndexError as e:
                        return JsonResponse({'error': "The date you entered is in the wrong format. The correct date format is 'YYYY-MM-DD'"}, status=400)
                    except Exception as e:
                        return JsonResponse({'error': str(e)}, status=400)
                value = data.get(f'new_{field}')

                if value is not None and value != '':
                    setattr(saler, field, value)
                else: 
                    return JsonResponse({'error': "One or more data field is empty!"}, status=400)


            saler.save()
            return JsonResponse({'message': "Your changes have been successfully saved"}, status=200)

        except Salers.DoesNotExist:
            return JsonResponse({'error': "Saler not found"}, status=400)

        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)



class CollapsedSalerView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def get(self, request, *args, **kwargs):
        salers = Salers.objects.values().all()
        salers_list = [[saler['id'], saler['name'], saler['is_active']] for saler in salers]
        return JsonResponse(salers_list, safe=False)

    
 # Everyday experience rating must be automatically updated !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   
class SalerView(APIView):
    permission_classes = (IsAuthenticated,) 
    authentication_classes = (JWTAuthentication,)
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        id = data.get('id')
        saler = Salers.objects.get(id=id)
        current_date = datetime.date.today()
        jalali_current_date = jdatetime.date(current_date.year, current_date.month, current_date.day)
        try:
            saler_monthly_ratings = SalerMonthlySaleRating.objects.get(name=saler.name, month = jalali_current_date.month, year= jalali_current_date.year )
            monthly_sale_rating = saler_monthly_ratings.sale_rating
        except SalerMonthlySaleRating.DoesNotExist:
            monthly_sale_rating = 1
        response_data = {'id': id , 'name': saler.name, 'job_start_date': saler.job_start_date.strftime('%Y-%m-%d'), 'manager_performance_rating': saler.manager_performance_rating,
                          'experience_rating': saler.experience_rating, 'monthly_total_sales_rating': monthly_sale_rating, 'receipment_rating':saler.receipment_rating,
                          'is_active': saler.is_active}
        # Return the list of output_values as a JSON response
        return JsonResponse(response_data, safe=False)

class DeleteSalerView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        id = data.get('id')
        Salers.objects.get(id=id).delete()
        return HttpResponse('OK')


@receiver(post_save, sender=Sales)
def update_saler_performance_with_add_sale(sender, instance, created, **kwargs):
    if created:
        # Get or create the SalerPerformance object
        saler_performance, created = SalerPerformance.objects.get_or_create(
            name=instance.saler,
            year=instance.date.year,
            month= instance.date.month
        )

        # Update the sale value for the SalerPerformance object
        saler_performance.sale += instance.net_sales/10000000
        saler_performance.save()

@receiver(post_delete, sender=Sales)
def update_saler_performance_with_delete_sale(sender, instance, **kwargs):
    # Get the corresponding SalerPerformance object for the sale
    find_month=instance.date.month
    find_year = instance.date.year
    performance, created = SalerPerformance.objects.get_or_create(
        name=instance.saler, 
        year=instance.date.year,
        month=instance.date.month
        )

    # Subtract the net sale amount from the sale field
    performance.sale -= instance.net_sales/10000000
    performance.save()


@receiver(pre_save, sender=SalerPerformance)
def update_month_sale_rating(sender, instance, **kwargs):
    # Calculate the sale rating based on the updated sale value
    monthly_sale_rating = calculate_sale_rating(float(instance.sale)/10000000)
    saler, created = SalerMonthlySaleRating.objects.get_or_create(
        name=instance.name, 
        year=instance.year,
        month=instance.month
        )
    saler.sale_rating = monthly_sale_rating





# endregion

# region SaleSummary

@receiver(post_save, sender=Sales)
def update_sale_summary_with_add_sale(sender, instance, created, **kwargs):
    if created:
        # Get or create the SalerPerformance object
        find_month = instance.date.month
        find_year = instance.date.year
        find_day = instance.date.day
        sale_summary, created = SaleSummary.objects.get_or_create(
            date=jdatetime.date(int(find_year), int(find_month), int(find_day)), year= find_year, month = find_month, day = find_day
        )

        # Update the sale value for the SalerPerformance object
        sale_summary.sale += instance.net_sales
        sale_summary.save()

@receiver(post_delete, sender=Sales)
def update_sale_summary_with_delete_sale(sender, instance, **kwargs):
    # Get or create the SalerPerformance object
    find_month = instance.date.month
    find_year = instance.date.year
    find_day = instance.date.day

    sale_summary = SaleSummary.objects.get(
        date=jdatetime.date(int(find_year), int(find_month), int(find_day))
    )

    # Update the sale value for the SalerPerformance object
    sale_summary.sale -= instance.net_sales
    sale_summary.save()

class SalesReportView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)

        report_type = data.get('report_type')
        start_date =  data.get('start_date').split("-")
        end_date =  data.get('end_date').split("-")
       

        if report_type == 'daily':
            start_date = jdatetime.date(int(start_date[0]), int(start_date[1]), int(start_date[2]))
            end_date = jdatetime.date(int(end_date[0]), int(end_date[1]), int(end_date[2]))
            data = SaleSummary.objects.filter(date__range = [start_date, end_date]).values('date').annotate(total_sales=Sum('sale')).order_by('date')
            sales_report_list = [[d['date'].strftime('%Y-%m-%d'), d['total_sales']] for d in data]

        elif report_type == 'monthly':
            start_year, start_month = int(start_date[0]), int(start_date[1])
            end_year, end_month = int(end_date[0]), int(end_date[1])
            sales_report_list = []
            
            while start_year < end_year or (start_year == end_year and start_month < end_month):
                # Get the data for the current month
                data = SaleSummary.objects.filter(year=start_year, month=start_month).values('year', 'month').annotate(total_sales=Sum('sale'))

                # Format the data for the current month and add it to the sales report list
                sales_report_list.extend([[f"{jdatetime.date(start_year, start_month, 1).strftime('%Y-%m-%d')}", d['total_sales']] for d in data])

                # Increment the month and year
                start_month += 1
                if start_month > 12:
                    start_month = 1
                    start_year += 1

            # Sort the sales report list by date
            sales_report_list.sort()
        elif report_type == 'yearly':
            start_year  = int(start_date[0])
            end_year  = int(end_date[0])
            sales_report_list = []
            
            while start_year < end_year :
                # Get the data for the current month
                data = SaleSummary.objects.filter(year=start_year).values('year').annotate(total_sales=Sum('sale'))

                # Format the data for the current month and add it to the sales report list
                sales_report_list.extend([[f"{jdatetime.date(start_year, 1, 1).strftime('%Y-%m-%d')}", d['total_sales']] for d in data])

                # Increment the month and year
                start_year += 1

            # Sort the sales report list by date
            sales_report_list.sort()

        else:
            data = []
        return JsonResponse(sales_report_list, safe=False)




# endregion

# region MonthlyProductSales

@receiver(post_save, sender=Sales)
def update_monthly_product_sales_with_add_sale(sender, instance, created, **kwargs):
    if created:

        monthly_sale, created = MonthlyProductSales.objects.get_or_create(
            product_name=instance.goods,
            product_code=instance.good_code,
            year=instance.date.year,
            month= instance.date.month
        )

        monthly_sale.piece+= instance.original_output_value
        monthly_sale.sale += instance.net_sales
        monthly_sale.save()

@receiver(post_delete, sender=Sales)
def update_monthly_product_sales_with_delete_sale(sender, instance, **kwargs):

    monthly_sale = MonthlyProductSales.objects.get(
        prodct_name=instance.goods,
        product_code=instance.good_code,
        year=instance.date.year,
        month= instance.date.month
        )

    monthly_sale.piece -= instance.original_output_value
    monthly_sale.sale -= instance.net_sales
    monthly_sale.save()

# endregion

# region Customer Performance

@receiver(post_save, sender=Sales)
def update_customer_performance_with_add_sale(sender, instance, created, **kwargs):
    if created:
        # Get or create the CustomerPerformance object
        find_month = instance.date.month
        find_year = instance.date.year
        customer_performance, created = CustomerPerformance.objects.get_or_create(
             year= find_year, month = find_month, customer_code = instance.customer_code, customer_name = instance.name
        )

        # Update the sale value for the SalerPerformance object
        customer_performance.sale += instance.net_sales
        customer_performance.save()

@receiver(post_delete, sender=Sales)
def update_customer_performance_with_delete_sale(sender, instance, **kwargs):
    # Get or create the CustomerPerformance object
    find_month = instance.date.month
    find_year = instance.date.year
    customer_performance = CustomerPerformance.objects.get(
            year= find_year, month = find_month, customer_code = instance.customer_code, customer_name = instance.name
    )

    # Update the sale value for the SalerPerformance object
    customer_performance.sale -= instance.net_sales
    customer_performance.save()

class TopCustomersView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)

        report_type = data.get('report_type')
        print(report_type)
        if report_type == 'monthly':
            top_customers_list = []
            
            # Get the current month and year using jdatetime library
            date_month= current_jalali_date().month
            date_year= current_jalali_date().year
            
            # Get the data for the current month
            top_5_customer_data = CustomerPerformance.objects.filter(month=date_month, year=date_year).order_by('-sale')[:5]
            
            # Calculate the total sales for the current month
            total_sales = CustomerPerformance.objects.filter(month=date_month, year=date_year).aggregate(total_sales=Sum('sale'))
            total_sales= total_sales["total_sales"]
            
            # Get the sales data for the top 5 customers and calculate their total sales
            top_customers_list = [[d.customer_name, d.sale] for d in top_5_customer_data]
            top_customers_sale_sum = [d[1] for d in top_customers_list ]
            top_5_customer_total_sale = sum(top_customers_sale_sum)
            
            # Calculate the sales for the remaining customers
            others_sales = total_sales - top_5_customer_total_sale
            
            # Create a list of sales data for the top 5 customers and others for the pie chart
            top_customers_pie_chart = [[d[0], (d[1]/total_sales)*100] for d in top_customers_list]
            top_customers_pie_chart.append(["others", (others_sales/total_sales*100)])
        
        elif report_type == 'yearly':
            top_customers_list = []
            
            # Get the current year using jdatetime library
            date= current_jalali_date().year
            
            # Get the data for the current year
            top_5_customer_data = CustomerPerformance.objects.filter(year=date).order_by('-sale')[:5]
            
            # Calculate the total sales for the current year
            total_sales = CustomerPerformance.objects.filter(year=date).aggregate(total_sales=Sum('sale'))
            total_sales= total_sales["total_sales"]
            
            # Get the sales data for the top 5 customers and calculate their total sales
            top_customers_list = [[d.customer_name, d.sale] for d in top_5_customer_data]
            top_customers_sale_sum = [d[1] for d in top_customers_list ]
            top_5_customer_total_sale = sum(top_customers_sale_sum)
            
            # Calculate the sales for the remaining customers
            others_sales = total_sales - top_5_customer_total_sale
            
            # Create a list of sales data for the top 5 customers and others for the pie chart
            top_customers_pie_chart = [[d[0], (d[1]/total_sales)*100] for d in top_customers_list]
            top_customers_pie_chart.append(["others", (others_sales/total_sales*100)])
        return JsonResponse({"top_customers_list": top_customers_list,"top_customers_pie_chart": top_customers_pie_chart}, safe=False)

# endregion


# region Product Performance

@receiver(post_save, sender=Sales)
def update_product_performance_with_add_sale(sender, instance, created, **kwargs):
    if created:
        # Get or create the ProductPerformance object
        find_month = instance.date.month
        find_year = instance.date.year
        product_performance, created = ProductPerformance.objects.get_or_create(
             year= find_year, month = find_month, product_code = instance.good_code, product_name = instance.goods
        )

        # Update the sale value for the ProductPerformance object
        product_performance.sale += instance.net_sales
        product_performance.save()

@receiver(post_delete, sender=Sales)
def update_product_performance_with_delete_sale(sender, instance, **kwargs):
    # Get or create the ProductPerformance object
    find_month = instance.date.month
    find_year = instance.date.year
    product_performance = ProductPerformance.objects.get(
            year= find_year, month = find_month, product_code = instance.good_code, product_name = instance.goods
    )

    # Update the sale value for the ProductPerformance object
    product_performance.sale -= instance.net_sales
    product_performance.save()

class TopProductsView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)

        report_type = data.get('report_type')
        print(report_type)
        if report_type == 'monthly':
            top_products_list = []
            
            # Get the current month and year using jdatetime library
            date_month= current_jalali_date().month
            date_year= current_jalali_date().year
            
            # Get the data for the current month
            top_5_product_data = ProductPerformance.objects.filter(month=date_month, year=date_year).order_by('-sale')[:5]
            
            # Calculate the total sales for the current month
            total_sales = ProductPerformance.objects.filter(month=date_month, year=date_year).aggregate(total_sales=Sum('sale'))
            total_sales= total_sales["total_sales"]
            
            # Get the sales data for the top 5 products and calculate their total sales
            top_products_list = [[d.product_name, d.sale] for d in top_5_product_data]
            top_products_sale_sum = [d[1] for d in top_products_list ]
            top_5_product_total_sale = sum(top_products_sale_sum)
            
            # Calculate the sales for the remaining products
            others_sales = total_sales - top_5_product_total_sale
            
            # Create a list of sales data for the top 5 products and others for the pie chart
            top_products_pie_chart = [[d[0], (d[1]/total_sales)*100] for d in top_products_list]
            top_products_pie_chart.append(["others", (others_sales/total_sales*100)])
        
        elif report_type == 'yearly':
            top_products_list = []
            
            # Get the current year using jdatetime library
            date= current_jalali_date().year
            
            # Get the data for the current year
            top_5_product_data = ProductPerformance.objects.filter(year=date).order_by('-sale')[:5]
            
            # Calculate the total sales for the current year
            total_sales = ProductPerformance.objects.filter(year=date).aggregate(total_sales=Sum('sale'))
            total_sales= total_sales["total_sales"]
            
            # Get the sales data for the top 5 products and calculate their total sales
            top_products_list = [[d.product_name, d.sale] for d in top_5_product_data]
            top_products_sale_sum = [d[1] for d in top_products_list ]
            top_5_product_total_sale = sum(top_products_sale_sum)
            
            # Calculate the sales for the remaining products
            others_sales = total_sales - top_5_product_total_sale
            
            # Create a list of sales data for the top 5 products and others for the pie chart
            top_products_pie_chart = [[d[0], (d[1]/total_sales)*100] for d in top_products_list]
            top_products_pie_chart.append(["others", (others_sales/total_sales*100)])
        return JsonResponse({"top_products_list": top_products_list,"top_products_pie_chart": top_products_pie_chart}, safe=False)

# endregion

# region Current Exchange Rate

class ExchangeRateAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)
    def get(self, request):
        try:
            exchange_rate = get_exchange_rate()
            response_data = exchange_rate
        except Exception as e:
            response_data = {
                "error": "There is an error at Current IRR Exchange Rate. Please contact developer to solve it",
            }

        return JsonResponse(response_data)

# endregion











