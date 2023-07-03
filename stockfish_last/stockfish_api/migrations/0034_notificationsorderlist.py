# Generated by Django 4.1.5 on 2023-05-02 13:23

from django.db import migrations, models
import django_jalali.db.models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0033_auto_20230427_1305'),
    ]

    operations = [
        migrations.CreateModel(
            name='NotificationsOrderList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_date', django_jalali.db.models.jDateField(null=True)),
                ('product_code', models.IntegerField(null=True)),
                ('is_active', models.BooleanField()),
                ('order_avrg', models.FloatField(default=0, null=True)),
                ('order_exp', models.FloatField(default=0, null=True)),
                ('order_holt', models.FloatField(default=0, null=True)),
            ],
        ),
    ]