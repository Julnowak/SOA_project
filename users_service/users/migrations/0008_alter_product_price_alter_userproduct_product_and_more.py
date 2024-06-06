# Generated by Django 5.0.4 on 2024-06-06 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_product_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=100),
        ),
        migrations.AlterField(
            model_name='userproduct',
            name='product',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='userproduct',
            name='user',
            field=models.IntegerField(),
        ),
    ]
