from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class Room(models.Model):
    seller = models.CharField(max_length=200)
    buyer = models.CharField(max_length=200)
    product = models.CharField(max_length=1000)
    status = models.CharField(max_length=200, default="W toku")
    new_offer = models.FloatField(blank=True, null=True)


class Message(models.Model):
    # username = models.ForeignKey(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=200)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, blank=True, null=True)


