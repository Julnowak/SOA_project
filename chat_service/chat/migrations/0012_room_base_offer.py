# Generated by Django 5.0.4 on 2024-06-16 22:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0011_alter_room_new_offer_customer_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='base_offer',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=100),
        ),
    ]
