# Generated by Django 3.2.5 on 2023-03-07 13:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stockfish_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='salesummary',
            name='day',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='salesummary',
            name='month',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='salesummary',
            name='year',
            field=models.IntegerField(null=True),
        ),
    ]