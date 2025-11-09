from .Card import Card
from .Game import Game
from django.db import models

class PlayerCard(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, blank=False)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, blank=False)

    extraHealth = models.IntegerField(default=0)
    extraDamage = models.IntegerField(default=0)
    isBoss = models.BooleanField(default=False)
    extra = models.BooleanField(default=False)