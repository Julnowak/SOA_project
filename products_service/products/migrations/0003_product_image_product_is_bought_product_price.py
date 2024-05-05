# Generated by Django 5.0.4 on 2024-05-04 15:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_delete_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.ImageField(null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='product',
            name='is_bought',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='product',
            name='price',
            field=models.FloatField(default=0.0),
        ),
    ]