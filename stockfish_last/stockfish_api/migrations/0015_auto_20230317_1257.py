# Generated by Django 3.2.5 on 2023-03-17 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0014_auto_20230316_1722'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rop',
            name='demand_status',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='rop',
            name='new_party',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
