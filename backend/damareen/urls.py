from django.urls import path
from .views.views import CardListCreate, GameListCreate, DungeonListCreate, PlayerCardListCreate

urlpatterns = [
    path('cards/', CardListCreate.as_view(), name='cards'),
    path('games/', GameListCreate.as_view(), name='games'),
    path('dungeons/', DungeonListCreate.as_view(), name='dungeons'),
    path('playerCards/', PlayerCardListCreate.as_view(), name='playerCards'),
]
