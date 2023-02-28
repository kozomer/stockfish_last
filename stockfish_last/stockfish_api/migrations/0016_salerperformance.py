# Generated by Django 3.2.5 on 2023-02-27 09:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0015_alter_sales_no'),
    ]

    operations = [
        migrations.CreateModel(
            name='SalerPerformance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('year', models.IntegerField()),
                ('month', models.IntegerField()),
                ('sale', models.FloatField()),
            ],
        ),
    ]
