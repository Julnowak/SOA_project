# Generated by Django 5.0.4 on 2024-05-12 22:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0007_room_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='new_offer',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
