# Generated by Django 4.1.5 on 2023-04-18 11:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0026_trucks'),
    ]

    operations = [
        migrations.RenameField(
            model_name='goodsonroad',
            old_name='truck_id',
            new_name='truck_name',
        ),
        migrations.AddField(
            model_name='goodsonroad',
            name='is_on_road',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='goodsonroad',
            name='is_on_truck',
            field=models.BooleanField(default=False),
        ),
    ]