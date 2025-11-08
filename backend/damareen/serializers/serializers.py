from rest_framework import serializers
from ..models.Card import Card
from ..models.Dungeon import Dungeon
from ..models.Game import Game
from ..models.PlayerCard import PlayerCard

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'name', 'damage', 'health', 'affinity']
        extra_kwargs = {'id': {'read_only': True}}

    def validate_name(self, value):
        if Card.objects.filter(name=value).exists():
            raise serializers.ValidationError("Már létezik ilyen nevű kártya.")
        return value

class DungeonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dungeon
        fields = ['id', 'game', 'cards', 'dungeonType', 'boss', 'extra', 'completed']
        extra_kwargs = {'id': {'read_only': True}}
    
    def validate(self, value):
        if value['game'].creator != self.context['request'].user:
            raise serializers.ValidationError("Csak a játék létrehozója hozhat létre kazamatákat ehhez a játékhoz.")

        if 'boss' not in value.keys():
            raise serializers.ValidationError("A vezér mező nem hiányozhat.")

        match value['dungeonType']:
            case 1:
                if len(value['cards']) != 2:
                    raise serializers.ValidationError("A SIMPLE típusú kazamatákat pontosan 2 kártyát kell tartalmaznia.")
            case 2:
                if len(value['cards']) != 3 or not value['boss']:
                    raise serializers.ValidationError("A SMALL típusú kazamatákat pontosan 3 kártyát kell tartalmaznia, amelyek közül egy vezér.")
            case 3:
                if len(value['cards']) != 5 or not value['boss']:
                    raise serializers.ValidationError("A BIG típusú kazamatákat pontosan 5 kártyát kell tartalmaznia, amelyek közül egy vezér.")
        return value

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'creator', 'cards'] 
        extra_kwargs = {'id': {'read_only': True}}
    
    def validate_cards(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Egy játéknak legalább 2 kártyát kell tartalmaznia.")
        return value

class PlayerCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerCard
        fields = ['id', 'card', 'game', 'extraHealth', 'extraDamage', 'isBoss', 'extra']
        extra_kwargs = {'id': {'read_only': True}}

    def validate(self, value):
        if value['game'].creator != self.context['request'].user:
            raise serializers.ValidationError("Csak a játék létrehozója hozhat létre játékos kártyákat ehhez a játékhoz.")

        return value
