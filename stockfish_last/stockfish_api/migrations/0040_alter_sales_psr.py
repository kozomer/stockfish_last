# Generated by Django 3.2.5 on 2023-08-14 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0039_sales_gregorian_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sales',
            name='psr',
            field=models.CharField(blank=True, max_length=1, null=True),
        ),
    ]
