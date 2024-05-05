from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class Message(models.Model):
    # sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)