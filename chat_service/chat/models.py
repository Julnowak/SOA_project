from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class Room(models.Model):
    seller = models.CharField(max_length=200)
    buyer = models.CharField(max_length=200)
    product = models.PositiveIntegerField()
    product_name = models.CharField(max_length=1000,blank=True, null=True)
    status = models.CharField(max_length=200, default="W toku")
    base_offer = models.DecimalField(default=0.00, decimal_places=2, max_digits=100)
    new_offer_customer = models.DecimalField(default=0.00, decimal_places=2, max_digits=100)
    new_offer_producent = models.DecimalField(default=0.00, decimal_places=2, max_digits=100)


class Message(models.Model):
    # username = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=200)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, blank=True, null=True)


