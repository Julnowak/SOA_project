# Generated by Django 5.0.4 on 2024-05-11 23:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_room_message_room'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='user_2',
            new_name='buyer',
        ),
        migrations.RenameField(
            model_name='room',
            old_name='user_1',
            new_name='seller',
        ),
    ]