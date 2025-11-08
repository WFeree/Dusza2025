from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from ..serializers.serializers import CardSerializer, GameSerializer, DungeonSerializer, PlayerCardSerializer
from ..models.Card import Card
from ..models.Game import Game
from ..models.Dungeon import Dungeon
from ..models.PlayerCard import PlayerCard

class CardListCreate(generics.ListCreateAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()

class GameListCreate(generics.ListCreateAPIView):
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Game.objects.filter(creator=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(creator=self.request.user)

class DungeonListCreate(generics.ListCreateAPIView):
    queryset = Dungeon.objects.all()
    serializer_class = DungeonSerializer
    permission_classes = [IsAuthenticated]

class PlayerCardListCreate(generics.ListCreateAPIView):
    queryset = PlayerCard.objects.all()
    serializer_class = PlayerCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        game = self.request.data["game"]
        return PlayerCard.objects.filter(game = game)
