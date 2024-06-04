# Generated by Django 5.0.4 on 2024-06-03 22:48

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0007_remove_negotiationproduct_negotiation_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('seller', models.IntegerField()),
                ('buyer', models.IntegerField()),
                ('product', models.IntegerField()),
                ('chat', models.IntegerField(blank=True, null=True)),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=100)),
                ('date', models.DateTimeField(default=datetime.datetime(2024, 6, 4, 0, 48, 39, 253517))),
            ],
        ),
    ]
