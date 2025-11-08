from django.db import models
from django.contrib.auth.models import User
from .Card import Card

class Game(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)