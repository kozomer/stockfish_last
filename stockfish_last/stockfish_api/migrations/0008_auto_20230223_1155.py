# Generated by Django 3.2.5 on 2023-02-23 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0007_remove_sales_day_remove_sales_month_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='PriceList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group', models.CharField(max_length=255)),
                ('subgroup', models.CharField(max_length=255)),
                ('feature', models.CharField(max_length=255)),
                ('product_number_ir', models.IntegerField()),
                ('product_number_tr', models.FloatField()),
                ('description_tr', models.CharField(max_length=400)),
                ('description_ir', models.CharField(max_length=400)),
                ('unit', models.CharField(max_length=255)),
                ('unit_secondary', models.CharField(max_length=255)),
                ('dollar', models.FloatField()),
            ],
        ),
        migrations.AlterField(
            model_name='sales',
            name='date',
            field=models.DateField(null=True),
        ),
    ]