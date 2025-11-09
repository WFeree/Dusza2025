from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from ..serializers.serializers import CardSerializer, GameSerializer, DungeonSerializer, PlayerCardSerializer
from ..models.Card import Card
from ..models.Game import Game
from ..models.Dungeon import Dungeon
from ..models.PlayerCard import PlayerCard
from django.http import JsonResponse
from rest_framework.decorators import api_view

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

@api_view(['POST'])
def ChallangeDungeon(req):
    playerDeckIds = req.data.get('deck')

    playerDeck = []
    for id in playerDeckIds:
        playerDeck.append(PlayerCard.objects.get(id=id))

    dungeon = req.data.get('dungeon')
    dungeonDeck = Dungeon.objects.get(id=dungeon).cards.all()

    winners = []

    for i in range(len(playerDeck)):
        playercard = playerDeck[i].card
        dungeoncard = dungeonDeck[i]

        if playercard.damage + playerDeck[i].extraDamage > dungeoncard.health:
            winners.append("player")
        elif playercard.damage + playerDeck[i].extraDamage == dungeoncard.health:
            if playercard.affinity % 2 == playercard.affinity % 2:
                winners.append("draw")
            else:
                if (playercard.affinity == 1 and dungeoncard.affinity == 4) or playercard.affinity == 4 and dungeoncard.affinity == 1:
                    winners.append("player" if playercard.affinity == 1 else "dungeon")
                else:
                    winners.append("player" if playercard.affinity > dungeoncard.affinity else "dungeon")


        else:
            winners.append("dungeon")
    return JsonResponse({'result': winners}, status=200)


class DeleteCard(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    queryset = Card.objects.all()
    serializer_class = CardSerializer