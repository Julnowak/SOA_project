from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class Product(models.Model):
    name = models.CharField(max_length=200)
    likes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name + "_" + str(self.id)

