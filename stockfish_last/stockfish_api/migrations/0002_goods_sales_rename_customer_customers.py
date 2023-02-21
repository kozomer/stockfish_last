# Generated by Django 4.1.5 on 2023-02-16 08:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Goods',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_code', models.IntegerField(unique=True)),
                ('group', models.CharField(max_length=200)),
                ('product_title', models.CharField(max_length=100)),
                ('unit_title', models.CharField(max_length=100)),
                ('unit', models.CharField(max_length=100)),
                ('currency', models.CharField(max_length=100)),
                ('f', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Sales',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('no', models.PositiveIntegerField(unique=True)),
                ('bill_number', models.PositiveIntegerField()),
                ('day', models.PositiveIntegerField()),
                ('month', models.PositiveIntegerField()),
                ('year', models.PositiveIntegerField()),
                ('psr', models.CharField(max_length=100)),
                ('customer_code', models.PositiveIntegerField()),
                ('name', models.CharField(max_length=100)),
                ('area', models.CharField(max_length=100)),
                ('group', models.CharField(max_length=100)),
                ('good_code', models.PositiveIntegerField()),
                ('goods', models.CharField(max_length=100)),
                ('unit', models.CharField(max_length=100)),
                ('original_value', models.FloatField()),
                ('original_output_value', models.FloatField()),
                ('secondary_output_value', models.FloatField()),
                ('price', models.FloatField()),
                ('original_price', models.FloatField()),
                ('discount_percentage', models.FloatField()),
                ('amount_sale', models.FloatField()),
                ('discount', models.FloatField()),
                ('additional_sales', models.FloatField()),
                ('net_sales', models.FloatField()),
                ('discount_percentage_2', models.FloatField()),
                ('real_discount_percentage', models.FloatField()),
                ('payment_cash', models.FloatField()),
                ('payment_check', models.FloatField()),
                ('balance', models.FloatField()),
                ('saler', models.CharField(max_length=100)),
                ('currency', models.CharField(max_length=100)),
                ('dollar', models.FloatField()),
                ('manager_rating', models.FloatField()),
                ('senior_saler', models.FloatField()),
                ('tot_monthly_sales', models.FloatField()),
                ('receipment', models.FloatField()),
                ('ct', models.FloatField()),
                ('payment_type', models.CharField(max_length=100)),
                ('customer_size', models.FloatField()),
                ('saler_factor', models.FloatField()),
                ('prim_percentage', models.FloatField()),
                ('bonus_factor', models.FloatField()),
                ('bonus', models.FloatField()),
            ],
        ),
        migrations.RenameModel(
            old_name='Customer',
            new_name='Customers',
        ),
    ]
