# Generated by Django 5.0.4 on 2024-06-02 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0010_room_product_name_alter_room_product'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='new_offer_customer',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=100),
        ),
        migrations.AlterField(
            model_name='room',
            name='new_offer_producent',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=100),
        ),
    ]
