# Generated by Django 5.0.4 on 2024-06-02 14:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0009_rename_new_offer_room_new_offer_customer_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='product_name',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='room',
            name='product',
            field=models.PositiveIntegerField(),
        ),
    ]