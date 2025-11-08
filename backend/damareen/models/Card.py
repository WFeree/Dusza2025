from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

CARD_TYPES = {
    1: "FIRE",
    2: "EARTH",
    3: "WATER",
    4: "AIR",
}

class Card(models.Model):
    name = models.CharField(max_length=100, blank=True)
    damage = models.IntegerField(blank=True)
    health = models.IntegerField(blank=True)
    affinity = models.IntegerField(choices=CARD_TYPES, blank=True)
    color = models.CharField(blank=True) 

