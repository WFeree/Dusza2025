from django.contrib import admin
from .models import Game, PlayerCard, Card, Dungeon

# 🔹 Ezzel regisztrálod őket az admin felületre
admin.site.register(Game)
admin.site.register(PlayerCard)
admin.site.register(Card)
admin.site.register(Dungeon)

