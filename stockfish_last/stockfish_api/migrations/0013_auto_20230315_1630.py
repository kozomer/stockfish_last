# Generated by Django 3.2.5 on 2023-03-15 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0012_salerperformance_day'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sales',
            old_name='good_code',
            new_name='product_code',
        ),
        migrations.RenameField(
            model_name='sales',
            old_name='goods',
            new_name='product_name',
        ),
        migrations.AddField(
            model_name='sales',
            name='city',
            field=models.CharField(default='tehran', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='sales',
            name='color_making_saler',
            field=models.CharField(default='omer', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='sales',
            name='currency_sepidar',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sales',
            name='dollar_sepidar',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sales',
            name='kg',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sales',
            name='unit2',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='salesummary',
            name='dollar_sale',
            field=models.FloatField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='salesummary',
            name='dollar_sepidar_sale',
            field=models.FloatField(default=0, null=True),
        ),
        migrations.AddField(
            model_name='salesummary',
            name='kg_sale',
            field=models.FloatField(default=0, null=True),
        ),
        migrations.AlterField(
            model_name='sales',
            name='currency',
            field=models.FloatField(blank=True, null=True),
        ),
    ]