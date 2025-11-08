from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

CARD_TYPES = {
    1: "FIRE",
    2: "EARTH",
    3: "WATER",
    4: "AIR",
}

class Card(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=False)
    damage = models.IntegerField(blank=False, validators=[MinValueValidator(2), MaxValueValidator(100)])
    health = models.IntegerField(blank=False, validators=[MinValueValidator(2), MaxValueValidator(100)])
    affinity = models.IntegerField(choices=CARD_TYPES, blank=False)

