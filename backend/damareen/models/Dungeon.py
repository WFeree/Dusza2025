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
    game = models.ForeignKey(Game, on_delete=models.CASCADE, blank=False)
    cards = models.ManyToManyField(Card, related_name='dungeon_cards', blank=False)
    dungeonType = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(3)], choices=DUNGEON_TYPES, blank=False)
    boss = models.ForeignKey(Card, null=True, on_delete=models.CASCADE, related_name='dungeon_boss', blank=False)
    extra = models.BooleanField(default=False, blank=False)
    completed = models.BooleanField(default=False)