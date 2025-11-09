from django.db import models
from .Game import Game
from .Card import Card
from django.core.validators import MaxValueValidator, MinValueValidator

DUNGEON_TYPES = {
    1: "SIMPLE",
    2: "SMALL",
    3: "BIG",
}

class Dungeon(models.Model):
    name = models.CharField(max_length=100, blank=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, blank=True)
    cards = models.ManyToManyField(Card, related_name='dungeon_cards', blank=True)
    dungeonType = models.IntegerField(choices=DUNGEON_TYPES, blank=True)
    boss = models.ForeignKey(Card, null=True, on_delete=models.CASCADE, related_name='dungeon_boss', blank=True)
    extra = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)