# Generated by Django 3.2.5 on 2023-03-14 08:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0009_alter_monthlyproductsales_piece'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomerPerformance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_code', models.IntegerField(null=True)),
                ('customer_name', models.CharField(max_length=100)),
                ('year', models.IntegerField(null=True)),
                ('month', models.IntegerField(null=True)),
                ('sale', models.FloatField(default=0, null=True)),
            ],
        ),
    ]