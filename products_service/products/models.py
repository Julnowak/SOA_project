from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(default=0.00, decimal_places=2, max_digits=100)
    image = models.ImageField(default='No_photo.png')
    is_bought = models.BooleanField(default=False)
    likes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name + "_" + str(self.id)


class Negotiation(models.Model):
    seller = models.CharField(max_length=200)
    buyer = models.CharField(max_length=200)
    status = models.CharField(max_length=200, default="W toku")


class NegotiationProduct(models.Model):
    negotiation = models.ForeignKey(Negotiation, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

