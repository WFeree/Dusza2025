import api from "@/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { HeartIcon, SwordIcon } from "lucide-react";
import PNavbar from "./PNavbar";
import { Button } from "./ui/button";

type GameCard = {
  id: number;
  name: string;
  damage: number;
  health: number;
  affinity: number;
};

const BattlePage = () => {
  const location = useLocation();
  const { gameId, dungeonId, playerDeck } = location.state || {};
  const navigate = useNavigate();

  const [dungeonCards, setDungeonCards] = useState<GameCard[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInABattle, setIsInABattle] = useState(false);

  // 🔹 Load dungeon cards
  useEffect(() => {
    if (!dungeonId) {
      alert("Nincs dungeon ID!");
      navigate("/player");
      return;
    }

    setLoading(true);

    api
      .get(`/game/dungeons/${dungeonId}/`)
      .then((res) => {
        const cardIds = res.data.cards || [];
        return api.get("/game/cards/").then((cardsRes) => {
          const dungeonDeck = cardsRes.data.filter((card: any) =>
            cardIds.includes(card.id)
          );
          setDungeonCards(dungeonDeck);
        });
      })
      .catch((err) =>
        console.error("Hiba a dungeon kártyák lekérésekor:", err)
      )
      .finally(() => setLoading(false));
  }, [dungeonId, navigate]);

  // 🔹 Type advantage system
  const typeWins = (a: number, b: number): number => {
    if (a === b) return 0;
    if (
      (a === 1 && b === 2) ||
      (a === 2 && b === 3) ||
      (a === 3 && b === 4) ||
      (a === 4 && b === 1)
    )
      return 1;
    if (
      (b === 1 && a === 2) ||
      (b === 2 && a === 3) ||
      (b === 3 && a === 4) ||
      (b === 4 && a === 1)
    )
      return -1;
    return 0;
  };

  // 🔹 Battle logic
  const startBattle = () => {
    if (!playerDeck || !dungeonCards.length) return;

    setIsInABattle(true);

    const logs: string[] = [];
    let playerWins = 0;
    let dungeonWins = 0;

    for (let i = 0; i < dungeonCards.length && i < playerDeck.length; i++) {
      const player = playerDeck[i];
      const enemy = dungeonCards[i];
      let winner = "Döntetlen";

      if (player.damage >= enemy.health) {
        winner = `${player.name} legyőzte ${enemy.name}-t (sebzés alapján)`;
        playerWins++;
      } else if (enemy.damage >= player.health) {
        winner = `${enemy.name} legyőzte ${player.name}-t (sebzés alapján)`;
        dungeonWins++;
      } else {
        const typeResult = typeWins(player.affinity, enemy.affinity);
        if (typeResult === 1) {
          winner = `${player.name} legyőzte ${enemy.name}-t (típus alapján)`;
          playerWins++;
        } else if (typeResult === -1) {
          winner = `${enemy.name} legyőzte ${player.name}-t (típus alapján)`;
          dungeonWins++;
        } else {
          winner = `${enemy.name} legyőzte ${player.name}-t (döntetlen eset)`;
          dungeonWins++;
        }
      }

      logs.push(`⚔️ ${winner}`);
    }

    setBattleLog(logs);

    if (playerWins > dungeonWins) setResult("🎉 A játékos nyert!");
    else if (playerWins < dungeonWins) setResult("💀 A kazamata győzött!");
    else setResult("🤝 Döntetlen!");

    // ✅ End battle after short delay for animation clarity
    setTimeout(() => setIsInABattle(false), 800);
  };

  // 🔹 Affinity name + color helpers
  const getAffinityName = (aff: number) => {
    switch (aff) {
      case 1:
        return "Tűz";
      case 2:
        return "Föld";
      case 3:
        return "Víz";
      case 4:
        return "Levegő";
      default:
        return "Ismeretlen";
    }
  };

  const renderCard = (card: GameCard, side: "player" | "enemy") => {
    const color =
      side === "player"
        ? "bg-blue-100 border-blue-400"
        : "bg-red-100 border-red-400";

    return (
      <Card
        key={card.id}
        className={`CreatedCard p-2 w-full max-h-fit min-w-[245px] ${color}`}
      >
        <CardTitle className="font-bold text-xl">{card.name}</CardTitle>
        <CardDescription className="text-md text-black flex gap-2 items-center">
          <SwordIcon strokeWidth={1.5} size={18} /> Sebzés: {card.damage}
        </CardDescription>
        <CardDescription className="text-md text-black flex gap-2 items-center">
          <HeartIcon strokeWidth={1.5} size={18} /> Életerő: {card.health}
        </CardDescription>
        <div
          className={`w-full h-[30px] rounded-md flex items-center justify-center text-black font-semibold border transition-all duration-200
          ${
            card.affinity === 1
              ? "bg-red-500 text-white"
              : card.affinity === 2
              ? "bg-green-600 text-white"
              : card.affinity === 3
              ? "bg-blue-600 text-white"
              : card.affinity === 4
              ? "bg-yellow-300"
              : "bg-gray-200"
          }`}
        >
          {getAffinityName(card.affinity)}
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <>
        <PNavbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-muted-foreground">Betöltés...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PNavbar />
      <div className="min-h-screen bg-background p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">⚔️ Harc megkezdése</h1>

        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-center">
              Játékos paklija
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {playerDeck?.map((card: GameCard) => renderCard(card, "player"))}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2 text-center">
              Kazamata kártyái
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {dungeonCards.map((card: GameCard) => renderCard(card, "enemy"))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10 gap-4">
          <Button onClick={startBattle} disabled={isInABattle}>
            Harc megkezdése
          </Button>
          <Button
            variant="outline"
            disabled={isInABattle}
            onClick={() =>
              navigate("/player/", { state: { gameId, reopen: true } })
            }
          >
            Kilépés
          </Button>
        </div>

        {battleLog.length > 0 && (
          <div className="mt-10 bg-gray-100 rounded-md p-4">
            <h3 className="font-semibold mb-2">📜 Harci napló:</h3>
            <ul className="space-y-1 text-sm">
              {battleLog.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
            <h3 className="font-bold mt-4 text-center text-lg">{result}</h3>

            <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={() => navigate("/player/", { state: { gameId, reopen: true } })}>
                    Vissza a kazamatákhoz
                </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BattlePage;
