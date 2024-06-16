import datetime

from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(default=0.00, decimal_places=2, max_digits=100)
    image = models.ImageField(default='No_photo.png')
    is_bought = models.BooleanField(default=False)
    likes = models.PositiveIntegerField(default=0)
    description = models.TextField(default="Brak opisu.", max_length=1500)

    def __str__(self):
        return self.name + "_" + str(self.id)


class Transaction(models.Model):
    seller = models.CharField(max_length=200)
    buyer = models.CharField(max_length=200)
    product = models.IntegerField()
    name = models.CharField(max_length=200)
    chat = models.IntegerField(blank=True, null=True)
    likes = models.PositiveIntegerField(default=0)
    price = models.DecimalField(default=0.00, decimal_places=2, max_digits=100)
    finalPrice = models.DecimalField(default=0.00, decimal_places=2, max_digits=100)
    date = models.DateTimeField(default=datetime.datetime.now())

    def __str__(self):
        return str(self.product) + "_" + str(self.seller) + "_" + str(self.buyer)