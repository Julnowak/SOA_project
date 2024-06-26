# Generated by Django 5.0.4 on 2024-06-06 21:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_alter_product_price_alter_userproduct_product_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userlike',
            name='product',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='userlike',
            name='user',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='userproduct',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.product'),
        ),
        migrations.AlterField(
            model_name='userproduct',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
