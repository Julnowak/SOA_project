# Generated by Django 5.0.4 on 2024-06-06 21:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_alter_userlike_product_alter_userlike_user_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userlike',
            old_name='product',
            new_name='product_id',
        ),
        migrations.RenameField(
            model_name='userlike',
            old_name='user',
            new_name='user_id',
        ),
    ]
