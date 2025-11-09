from django.urls import path
from .views.views import CardListCreate, GameListCreate, DungeonListCreate, PlayerCardListCreate, ChallangeDungeon, DeleteCard, DungeonRetrieveView

urlpatterns = [
    path('cards/', CardListCreate.as_view(), name='cards'),
    path('cards/delete/<pk>', DeleteCard.as_view(), name='cardsDelete'),
    path('games/', GameListCreate.as_view(), name='games'),
    path('dungeons/', DungeonListCreate.as_view(), name='dungeons'),
    path("dungeons/<int:pk>/", DungeonRetrieveView.as_view(), name="dungeon-detail"),
    path('dungeons/challange/', ChallangeDungeon, name='dungeons'),
    path('playerCards/', PlayerCardListCreate.as_view(), name='playerCards'),
]
