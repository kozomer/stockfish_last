# Generated by Django 3.2.5 on 2023-02-27 09:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0016_salerperformance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='salerperformance',
            name='sale',
            field=models.FloatField(default=0, null=True),
        ),
    ]
