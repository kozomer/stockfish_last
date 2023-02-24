# Generated by Django 4.1.5 on 2023-02-17 13:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0004_alter_sales_additional_sales_alter_sales_amount_sale_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Warehouse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_code', models.IntegerField(unique=True)),
                ('title', models.CharField(max_length=200)),
                ('unit', models.CharField(max_length=50)),
                ('stock', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
            ],
        ),
    ]
