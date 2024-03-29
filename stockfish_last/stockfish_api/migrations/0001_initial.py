# Generated by Django 3.2.5 on 2023-03-03 09:18

from django.db import migrations, models
import django_jalali.db.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_code', models.CharField(max_length=100, unique=True)),
                ('description', models.CharField(max_length=200)),
                ('quantity', models.IntegerField()),
                ('area_code', models.CharField(max_length=100)),
                ('code', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('area', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Products',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group', models.CharField(max_length=255)),
                ('subgroup', models.CharField(max_length=255)),
                ('feature', models.CharField(max_length=255)),
                ('product_code_ir', models.IntegerField(unique=True)),
                ('product_code_tr', models.CharField(max_length=255)),
                ('description_tr', models.CharField(max_length=400)),
                ('description_ir', models.CharField(max_length=400)),
                ('unit', models.CharField(max_length=255)),
                ('unit_secondary', models.CharField(max_length=255)),
                ('weight', models.FloatField(null=True)),
                ('currency', models.CharField(max_length=255)),
                ('price', models.FloatField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ROP',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group', models.CharField(max_length=100)),
                ('subgroup', models.CharField(max_length=100)),
                ('feature', models.CharField(max_length=100)),
                ('new_or_old_product', models.CharField(blank=True, max_length=100, null=True)),
                ('related', models.CharField(blank=True, max_length=100, null=True)),
                ('origin', models.CharField(blank=True, max_length=100, null=True)),
                ('product_code_ir', models.CharField(max_length=100)),
                ('product_code_tr', models.CharField(max_length=100)),
                ('dont_order_again', models.CharField(blank=True, max_length=100, null=True)),
                ('description_tr', models.CharField(blank=True, max_length=100, null=True)),
                ('description_ir', models.CharField(blank=True, max_length=100, null=True)),
                ('unit', models.CharField(max_length=100)),
                ('weight', models.CharField(blank=True, max_length=100, null=True)),
                ('unit_secondary', models.CharField(blank=True, max_length=100, null=True)),
                ('price', models.FloatField(blank=True, null=True)),
                ('avarage_previous_year', models.FloatField(blank=True, null=True)),
                ('month_1', models.FloatField(blank=True, null=True)),
                ('month_2', models.FloatField(blank=True, null=True)),
                ('month_3', models.FloatField(blank=True, null=True)),
                ('month_4', models.FloatField(blank=True, null=True)),
                ('month_5', models.FloatField(blank=True, null=True)),
                ('month_6', models.FloatField(blank=True, null=True)),
                ('month_7', models.FloatField(blank=True, null=True)),
                ('month_8', models.FloatField(blank=True, null=True)),
                ('month_9', models.FloatField(blank=True, null=True)),
                ('month_10', models.FloatField(blank=True, null=True)),
                ('month_11', models.FloatField(blank=True, null=True)),
                ('month_12', models.FloatField(blank=True, null=True)),
                ('total_sale', models.FloatField(blank=True, null=True)),
                ('warehouse', models.FloatField(blank=True, null=True)),
                ('goods_on_the_road', models.FloatField(blank=True, null=True)),
                ('total_stock_all', models.FloatField(blank=True, null=True)),
                ('total_month_stock', models.FloatField(blank=True, null=True)),
                ('standart_deviation', models.FloatField(blank=True, null=True)),
                ('lead_time', models.FloatField(blank=True, null=True)),
                ('product_coverage_percentage', models.FloatField(blank=True, null=True)),
                ('demand_status', models.CharField(blank=True, max_length=100, null=True)),
                ('safety_stock', models.FloatField(blank=True, null=True)),
                ('rop', models.FloatField(blank=True, null=True)),
                ('monthly_mean', models.FloatField(blank=True, null=True)),
                ('new_party', models.CharField(blank=True, max_length=100, null=True)),
                ('cycle_service_level', models.FloatField(blank=True, null=True)),
                ('total_stock', models.FloatField(blank=True, null=True)),
                ('need_prodcuts', models.FloatField(blank=True, null=True)),
                ('over_stock', models.FloatField(blank=True, null=True)),
                ('calculated_need', models.FloatField(blank=True, null=True)),
                ('calculated_max_stock', models.FloatField(blank=True, null=True)),
                ('calculated_min_stock', models.FloatField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SalerMonthlySaleRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', django_jalali.db.models.jDateField()),
                ('name', models.CharField(max_length=100)),
                ('sale_rating', models.FloatField(default=1, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SalerPerformance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('date', django_jalali.db.models.jDateField()),
                ('sale', models.FloatField(default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SalerReceipeRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', django_jalali.db.models.jDateField()),
                ('sale_rating', models.FloatField(default=1, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Salers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('job_start_date', django_jalali.db.models.jDateField()),
                ('manager_performance_rating', models.FloatField(null=True)),
                ('experience_rating', models.FloatField(null=True)),
                ('monthly_total_sales_rating', models.FloatField(null=True)),
                ('receipment_rating', models.FloatField(null=True)),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Sales',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('no', models.PositiveIntegerField(db_index=True, unique=True)),
                ('bill_number', models.PositiveIntegerField(blank=True, null=True)),
                ('date', django_jalali.db.models.jDateField()),
                ('psr', models.CharField(max_length=1)),
                ('customer_code', models.PositiveIntegerField(blank=True, null=True)),
                ('name', models.CharField(max_length=50)),
                ('area', models.CharField(max_length=50)),
                ('group', models.CharField(max_length=50)),
                ('good_code', models.PositiveIntegerField(blank=True, null=True)),
                ('goods', models.CharField(max_length=100)),
                ('unit', models.CharField(max_length=30)),
                ('original_value', models.FloatField(blank=True, null=True)),
                ('original_output_value', models.FloatField(blank=True, null=True)),
                ('secondary_output_value', models.FloatField(blank=True, null=True)),
                ('price', models.FloatField(blank=True, null=True)),
                ('original_price', models.FloatField(blank=True, null=True)),
                ('discount_percentage', models.FloatField(blank=True, null=True)),
                ('amount_sale', models.FloatField(blank=True, null=True)),
                ('discount', models.FloatField(blank=True, null=True)),
                ('additional_sales', models.FloatField(blank=True, null=True)),
                ('net_sales', models.FloatField(blank=True, null=True)),
                ('discount_percentage_2', models.FloatField(blank=True, null=True)),
                ('real_discount_percentage', models.FloatField(blank=True, null=True)),
                ('payment_cash', models.FloatField(blank=True, null=True)),
                ('payment_check', models.FloatField(blank=True, null=True)),
                ('balance', models.FloatField(blank=True, null=True)),
                ('saler', models.CharField(max_length=100)),
                ('currency', models.CharField(max_length=20)),
                ('dollar', models.FloatField(blank=True, null=True)),
                ('manager_rating', models.FloatField(blank=True, null=True)),
                ('senior_saler', models.FloatField(blank=True, null=True)),
                ('tot_monthly_sales', models.FloatField(blank=True, null=True)),
                ('receipment', models.FloatField(blank=True, null=True)),
                ('ct', models.FloatField(blank=True, null=True)),
                ('payment_type', models.CharField(max_length=50)),
                ('customer_size', models.FloatField(blank=True, null=True)),
                ('saler_factor', models.FloatField(blank=True, null=True)),
                ('prim_percentage', models.FloatField(blank=True, null=True)),
                ('bonus_factor', models.FloatField(blank=True, null=True)),
                ('bonus', models.FloatField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SaleSummary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', django_jalali.db.models.jDateField()),
                ('sale', models.FloatField(default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Warehouse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_code', models.IntegerField(unique=True)),
                ('title', models.CharField(max_length=200)),
                ('unit', models.CharField(max_length=50)),
                ('stock', models.FloatField(blank=True, null=True)),
            ],
        ),
    ]
