# Generated by Django 4.1.5 on 2023-02-23 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0009_alter_pricelist_product_number_ir'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pricelist',
            name='product_number_tr',
            field=models.CharField(max_length=255),
        ),
    ]