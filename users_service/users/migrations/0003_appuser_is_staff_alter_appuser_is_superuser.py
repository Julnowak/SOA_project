# Generated by Django 5.0.4 on 2024-04-30 23:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_appuser_user_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='appuser',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='appuser',
            name='is_superuser',
            field=models.BooleanField(default=False),
        ),
    ]
