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
        if value is None or value.strip() == "":
            raise serializers.ValidationError("A név mező nem lehet üres.")
        if Card.objects.filter(name=value).exists():
            raise serializers.ValidationError("Már létezik ilyen nevű kártya.")
        return value

    def validate_affinity(self, value):
        print(value)
        if not value:
            raise serializers.ValidationError("Az affinitás mező nem lehet üres.")
        return value

    def validate_health(self, value):
        if value is None:
            raise serializers.ValidationError("A életerő mező nem lehet üres.")
            
        if value < 2 or value > 100:
            raise serializers.ValidationError("A életerő mező értéke 2 és 100 között kell legyen.")
        return value    

    def validate_damage(self, value):
        if value is None:
            raise serializers.ValidationError("A sebzés mező nem lehet üres.")
            
        if value < 2 or value > 100:
            raise serializers.ValidationError("A sebzés mező értéke 2 és 100 között kell legyen.")
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
                if len(value['cards']) != 1:
                    raise serializers.ValidationError("A SIMPLE típusú kazamatákat pontosan 1 kártyát kell tartalmaznia.")
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
        fields = ['id', 'creator'] 
        extra_kwargs = {'id': {'read_only': True}}

class PlayerCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerCard
        fields = ['id', 'card', 'game', 'extraHealth', 'extraDamage', 'isBoss', 'extra']
        extra_kwargs = {'id': {'read_only': True}}

    def validate(self, value):
        if value['game'].creator != self.context['request'].user:
            raise serializers.ValidationError("Csak a játék létrehozója hozhat létre játékos kártyákat ehhez a játékhoz.")

        return value
