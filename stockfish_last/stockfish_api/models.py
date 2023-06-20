from django.db import models
from django_jalali.db import models as jmodels
from dirtyfields import DirtyFieldsMixin
from .definitions import jalali_to_greg, greg_to_jalali, current_jalali_date

class Customers(models.Model):
    customer_code = models.IntegerField(unique= True)
    description = models.CharField(max_length=200)
    quantity = models.IntegerField(null= True)
    area_code = models.CharField(max_length=100)
    code = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    def __str__(self):
        return self.customer_code

class Sales(DirtyFieldsMixin, models.Model):
    no = models.PositiveIntegerField(unique=True, db_index=True)
    bill_number = models.PositiveIntegerField(null=True, blank=True)
    date = jmodels.jDateField()
    psr = models.CharField(max_length=1) 
    customer_code = models.PositiveIntegerField(null=True, blank=True)
    name = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    area = models.CharField(max_length=50)
    color_making_saler = models.CharField(max_length=50) 
    #group = models.CharField(max_length=50) Removed as not used in view
    product_code = models.PositiveIntegerField(null=True, blank=True)
    product_name = models.CharField(max_length=100)
    unit = models.CharField(max_length=30)
    unit2 = models.CharField(max_length=30)
    original_value = models.FloatField(null=True, blank=True)
    kg = models.FloatField(null=True, blank=True) #Added as per view
    secondary_output_value = models.FloatField(null=True, blank=True)
    price_dollar = models.FloatField(null=True, blank=True) #Updated as per view
    original_price_dollar = models.FloatField(null=True, blank=True) #Updated as per view
    discount_percentage = models.FloatField(null=True, blank=True)
    amount_sale = models.FloatField(null=True, blank=True)
    discount = models.FloatField(null=True, blank=True)
    additional_sales = models.FloatField(null=True, blank=True)
    net_sales = models.FloatField(null=True, blank=True)
    payment_cash = models.FloatField(null=True, blank=True)
    payment_check = models.FloatField(null=True, blank=True)
    balance = models.FloatField(null=True, blank=True)
    saler = models.CharField(max_length=100)
    currency_sepidar = models.FloatField(null=True, blank=True)
    dollar_sepidar = models.FloatField(null=True, blank=True)
    currency = models.FloatField(null=True, blank=True)
    dollar = models.FloatField(null=True, blank=True)
    manager_rating = models.FloatField(null=True, blank=True)
    senior_saler = models.FloatField(null=True, blank=True)
    tot_monthly_sales = models.FloatField(null=True, blank=True)
    receipment = models.FloatField(null=True, blank=True)
    ct = models.FloatField(null=True, blank=True) # added as per view
    payment_type = models.CharField(max_length=50, null=True, blank=True) #Updated as per view
    customer_size = models.FloatField(null=True, blank=True) #Updated as per view
    saler_factor = models.FloatField(null=True, blank=True)
    prim_percentage = models.FloatField(null=True, blank=True)
    bonus_factor = models.FloatField(null=True, blank=True)
    bonus = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.no
    
    def save(self, *args, **kwargs):
        # Get related models
        customer = Customers.objects.get(customer_code=self.customer_code)
        product = Products.objects.get(product_code_ir=self.product_code)
        saler = Salers.objects.get(name=self.saler)

        # Calculation of "KG"
        self.kg = float(self.original_value) if self.unit.lower() == "kg" else float(self.original_value) * float(product.unit_secondary)

        # Calculation of Balance
        self.balance = float(self.net_sales) - (float(self.payment_cash) + float(self.payment_check))

        # Calculation of Dollar Sepidar
        self.dollar_sepidar = float(self.net_sales) / float(self.currency_sepidar)
        self.dollar = float(self.net_sales) / float(self.currency)

        # Calculation of Manager Rating
        if current_jalali_date().month == self.date.month and current_jalali_date().year == self.date.year:
            self.manager_rating = float(saler.manager_performance_rating)

        # Calculation of monthly sale rating
        monthly_sale_rating_object = SalerMonthlySaleRating.objects.get(name=saler.name, year=self.date.year, month=self.date.month)
        self.tot_monthly_sales = float(monthly_sale_rating_object.sale_rating)

        # Calculation of receipe rating
        receipe_rating_object = SalerReceipeRating.objects.get(name=saler.name, year=self.date.year, month=self.date.month)
        self.receipment = float(receipe_rating_object.sale_rating)

        # Calculation of Saler Factor
        self.saler_factor = float(self.tot_monthly_sales) * float(self.manager_rating) * float(self.receipment) * float(saler.experience_rating) * float(self.payment_type if self.payment_type else 1)* float(self.ct if self.ct else 1)
        
        # Calculation of bonus
        self.bonus_factor = float(self.saler_factor) * float(self.prim_percentage)
        self.bonus = float(self.bonus_factor) * float(self.net_sales)

        super().save(*args, **kwargs)


class Warehouse(models.Model):
    product_code = models.IntegerField(unique=True)
    product_code_tr = models.IntegerField(null=True)
    title = models.CharField(max_length=200)
    unit = models.CharField(max_length=50)
    stock = models.FloatField(null=True, blank=True)
    kg = models.FloatField(null=True, blank=True) 

class Products(models.Model):
    group = models.CharField(max_length=255)
    subgroup = models.CharField(max_length=255)
    feature = models.CharField(max_length=255)
    product_code_ir = models.IntegerField(unique= True)
    product_code_tr = models.CharField(max_length=255)
    description_tr = models.CharField(max_length=400)
    description_ir = models.CharField(max_length=400)
    unit = models.CharField(max_length=255)
    unit_secondary = models.CharField(max_length=255)
    weight = models.FloatField(null= True)
    #currency = models.CharField(max_length=255) # TODO: Yeni çıkartıldı ilgili viewslardan da çıkartılacak.
    price = models.FloatField(null= True)

class ROP(models.Model):
    group = models.CharField(max_length=100)
    subgroup = models.CharField(max_length=100)
    feature = models.CharField(max_length=100)
    new_or_old_product = models.CharField(max_length=100, null=True, blank=True)
    related = models.CharField(max_length=100, null=True, blank=True)
    origin = models.CharField(max_length=100, null=True, blank=True)
    product_code_ir = models.CharField(max_length=100)
    product_code_tr = models.CharField(max_length=100)
    dont_order_again = models.IntegerField(default=0, null=True, blank= True)
    description_tr = models.CharField(max_length=100, null=True, blank=True)
    description_ir = models.CharField(max_length=100, null=True, blank=True)
    unit = models.CharField(max_length=100)
    weight = models.CharField(max_length=100, null=True, blank=True)
    unit_secondary = models.CharField(max_length=100, null=True, blank=True)
    price = models.FloatField(null=True, blank=True)
    avarage_previous_year = models.FloatField(null=True, blank=True)
    month_1 = models.FloatField(null=True, blank=True)
    month_2 = models.FloatField(null=True, blank=True)
    month_3 = models.FloatField(null=True, blank=True)
    month_4 = models.FloatField(null=True, blank=True)
    month_5 = models.FloatField(null=True, blank=True)
    month_6 = models.FloatField(null=True, blank=True)
    month_7 = models.FloatField(null=True, blank=True)
    month_8 = models.FloatField(null=True, blank=True)
    month_9 = models.FloatField(null=True, blank=True)
    month_10 = models.FloatField(null=True, blank=True)
    month_11 = models.FloatField(null=True, blank=True)
    month_12 = models.FloatField(null=True, blank=True)
    total_sale = models.FloatField(null=True, blank=True)
    warehouse = models.FloatField(null=True, blank=True)
    goods_on_the_road = models.FloatField(null=True, blank=True)
    total_stock_all = models.FloatField(null=True, blank=True)
    total_month_stock = models.FloatField(null=True, blank=True)
    standart_deviation = models.FloatField(null=True, blank=True)
    lead_time = models.FloatField(null=True, blank=True)
    product_coverage_percentage = models.FloatField(null=True, blank=True)
    demand_status = models.FloatField(null=True, blank=True)
    safety_stock = models.FloatField(null=True, blank=True)
    rop = models.FloatField(null=True, blank=True)
    monthly_mean = models.FloatField(null=True, blank=True)
    new_party = models.FloatField(null=True, blank=True)
    cycle_service_level = models.FloatField(null=True, blank=True)
    total_stock = models.FloatField(null=True, blank=True)
    need_prodcuts = models.FloatField(null=True, blank=True)
    over_stock = models.FloatField(null=True, blank=True)
    calculated_need = models.FloatField(null=True, blank=True)
    calculated_max_stock = models.FloatField(null=True, blank=True)
    calculated_min_stock = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.product_code_ir

class Salers(models.Model):
    #saler_code = models.IntegerField(unique= True)
    objects = jmodels.jManager()
    name = models.CharField(max_length=200)
    job_start_date = jmodels.jDateField()
    manager_performance_rating = models.FloatField(null=True)
    experience_rating = models.FloatField(null=True)
    monthly_total_sales_rating = models.FloatField(null=True)
    receipment_rating = models.FloatField(null=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    is_active_saler = models.BooleanField()
    is_passive_saler = models.BooleanField()


class SalerPerformance(models.Model):
    name = models.CharField(max_length=100)
    year = models.IntegerField(null=True)
    month = models.IntegerField(null=True)
    day = models.IntegerField(null=True)
    sale = models.FloatField(default=0, null=True)
    bonus = models.FloatField(default=0, null=True)
    

class SaleSummary(models.Model):
    objects = jmodels.jManager()
    date = jmodels.jDateField()
    year = models.IntegerField(null=True)
    month = models.IntegerField(null=True)
    day = models.IntegerField(null=True)
    sale = models.FloatField(default=0, null=True)
    dollar_sepidar_sale = models.FloatField(default=0, null=True)
    dollar_sale = models.FloatField(default=0, null=True)
    kg_sale = models.FloatField(default=0, null=True)

class SalerMonthlySaleRating(models.Model):
    objects = jmodels.jManager()
    year = models.IntegerField(null=True)
    month = models.IntegerField(null=True)
    name = models.CharField(max_length=100)
    sale_rating = models.FloatField(default=1, null=True)

class SalerReceipeRating(models.Model):
    objects = jmodels.jManager()
    year = models.IntegerField(null=True)
    month = models.IntegerField(null=True)
    name = models.CharField(max_length=100)  
    sale_rating = models.FloatField(default=1, null=True)

class MonthlyProductSales(models.Model):
    objects = jmodels.jManager()
    product_name = models.CharField(max_length=100)
    product_code = models.IntegerField(null=True)
    date = jmodels.jDateField(null=True)
    year = models.IntegerField(null=True)
    month = models.IntegerField(null=True)
    piece = models.FloatField(null=True, default=0)
    sale = models.FloatField(default=0, null=True)

class CustomerPerformance(models.Model):
    objects = jmodels.jManager()
    customer_code = models.IntegerField()
    customer_name = models.CharField(max_length=100)
    customer_area = models.CharField(max_length=100)
    year = models.IntegerField(null=True)
    month = models.IntegerField(null=True)
    sale = models.FloatField(default=0, null=True)
    sale_amount = models.FloatField(default=0, null=True)
    dollar = models.FloatField(default=0, null=True)
    dollar_sepidar = models.FloatField(default=0, null=True)

class ProductPerformance(models.Model):
    objects = jmodels.jManager()
    product_code = models.IntegerField(null=True)
    product_name = models.CharField(max_length=100)
    year = models.IntegerField(null=True)
    month = models.IntegerField(null=True)
    sale = models.FloatField(default=0, null=True)
    sale_amount = models.FloatField(default=0, null=True)

class OrderList(models.Model):
    objects = jmodels.jManager()
    current_date = jmodels.jDateField(null=True)
    order_flag_avrg = models.BooleanField()
    order_flag_exp = models.BooleanField()
    order_flag_holt = models.BooleanField()
    order_avrg = models.FloatField(default=0, null=True)
    order_exp = models.FloatField(default=0, null=True)
    order_holt = models.FloatField(default=0, null=True)
    current_stock = models.FloatField(default=0, null=True)
    decided_order = models.FloatField(default=0, null=True)
    weight = models.FloatField(default=0, null=True)
    average_sale = models.FloatField(default=0, null=True)
    product_code = models.IntegerField(null=True)
    is_active = models.BooleanField()
    is_ordered = models.BooleanField()

class GoodsOnRoad(models.Model):
    product_code = models.IntegerField(null=True)
    product_name_tr = models.CharField(max_length=100)
    product_name_ir = models.CharField(max_length=100)
    decided_order = models.FloatField(default=0, null=True)
    weight = models.FloatField(default=0, null=True)
    truck_name = models.CharField(max_length=100)
    is_ordered = models.BooleanField(default= False)
    is_terminated = models.BooleanField(default= False)
    is_on_truck = models.BooleanField(default= False)
    is_on_road = models.BooleanField(default= False)
    is_arrived = models.BooleanField(default= False)

class Trucks(models.Model):
    objects = jmodels.jManager()
    truck_name = models.CharField(max_length=100)
    estimated_order_date = jmodels.jDateField(null=True)
    estimated_arrival_date = jmodels.jDateField(null=True)
    is_arrived = models.BooleanField(default=False)
    is_ordered = models.BooleanField(default=False)
    is_waiting = models.BooleanField()

class NotificationsOrderList(models.Model):
    objects = jmodels.jManager()
    current_date = jmodels.jDateField(null=True)
    product_code = models.IntegerField(null=True)
    is_active = models.BooleanField()
    order_avrg = models.FloatField(default=0, null=True)
    order_exp = models.FloatField(default=0, null=True)
    order_holt = models.FloatField(default=0, null=True)






