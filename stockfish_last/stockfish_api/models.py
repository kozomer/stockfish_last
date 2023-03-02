from django.db import models
from django_jalali.db import models as jmodels

class Customers(models.Model):
    customer_code = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=200)
    quantity = models.IntegerField()
    area_code = models.CharField(max_length=100)
    code = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    def __str__(self):
        return self.customer_code

class Sales(models.Model):
    no = models.PositiveIntegerField(unique=True, db_index= True)
    bill_number = models.PositiveIntegerField(null=True, blank=True)
    date = jmodels.jDateField()
    psr = models.CharField(max_length=1)
    customer_code = models.PositiveIntegerField(null=True, blank=True)
    name = models.CharField(max_length=50)
    area = models.CharField(max_length=50)
    group = models.CharField(max_length=50)
    good_code = models.PositiveIntegerField(null=True, blank=True)
    goods = models.CharField(max_length=100)
    unit = models.CharField(max_length=30)
    original_value = models.FloatField(null=True, blank=True)
    original_output_value = models.FloatField(null=True, blank=True)
    secondary_output_value = models.FloatField(null=True, blank=True)
    price = models.FloatField(null=True, blank=True)
    original_price = models.FloatField(null=True, blank=True)
    discount_percentage = models.FloatField(null=True, blank=True)
    amount_sale = models.FloatField(null=True, blank=True)
    discount = models.FloatField(null=True, blank=True)
    additional_sales = models.FloatField(null=True, blank=True)
    net_sales = models.FloatField(null=True, blank=True)
    discount_percentage_2 = models.FloatField(null=True, blank=True)
    real_discount_percentage = models.FloatField(null=True, blank=True)
    payment_cash = models.FloatField(null=True, blank=True)
    payment_check = models.FloatField(null=True, blank=True)
    balance = models.FloatField(null=True, blank=True)
    saler = models.CharField(max_length=100)
    currency = models.CharField(max_length=20)
    dollar = models.FloatField(null=True, blank=True)
    manager_rating = models.FloatField(null=True, blank=True)
    senior_saler = models.FloatField(null=True, blank=True)
    tot_monthly_sales = models.FloatField(null=True, blank=True)
    receipment = models.FloatField(null=True, blank=True)
    ct = models.FloatField(null=True, blank=True)
    payment_type = models.CharField(max_length=50)
    customer_size = models.FloatField(null=True, blank=True)
    saler_factor = models.FloatField(null=True, blank=True)
    prim_percentage = models.FloatField(null=True, blank=True)
    bonus_factor = models.FloatField(null=True, blank=True)
    bonus = models.FloatField(null=True, blank=True)
    def __str__(self):
        return self.no

class Warehouse(models.Model):
    product_code = models.IntegerField(unique=True)
    title = models.CharField(max_length=200)
    unit = models.CharField(max_length=50)
    stock = models.FloatField(null=True, blank=True)

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
    currency = models.CharField(max_length=255)
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
    dont_order_again = models.CharField(max_length=100, null=True, blank=True)
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
    demand_status = models.CharField(max_length=100, null=True, blank=True)
    safety_stock = models.FloatField(null=True, blank=True)
    rop = models.FloatField(null=True, blank=True)
    monthly_mean = models.FloatField(null=True, blank=True)
    new_party = models.CharField(max_length=100, null=True, blank=True)
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
    name = models.CharField(max_length=200)
    job_start_date = jmodels.jDateField()
    manager_performance_rating = models.FloatField(null=True)
    experience_rating = models.FloatField(null=True)
    monthly_total_sales_rating = models.FloatField(null=True)
    receipment_rating = models.FloatField(null=True)
    is_active = models.BooleanField(default=True)

class SalerPerformance(models.Model):
    name = models.CharField(max_length=100)
    date = jmodels.jDateField()
    sale = models.FloatField(default=0, null=True)

class SaleSummary(models.Model):
    date = jmodels.jDateField()
    sale = models.FloatField(default=0, null=True)

class SalerMonthlySaleRating(models.Model):
    date = jmodels.jDateField()
    name = models.CharField(max_length=100)
    sale_rating = models.FloatField(default=1, null=True)

class SalerReceipeRating(models.Model):
    date = jmodels.jDateField()
    sale_rating = models.FloatField(default=1, null=True)





