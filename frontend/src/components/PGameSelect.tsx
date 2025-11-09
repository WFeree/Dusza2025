import { useEffect, useState } from "react";
import api from "@/api";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import PNavbar from "./PNavbar";
import { SwordIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type GameType = { id: number; creator: number };
type DungeonType = {
  id: number;
  boss: number;
  dungeonType: number | string;
  completed: boolean;
  extra: boolean;
  game: number;
  name: string;
};

const PGameSelect = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const [GData, setGData] = useState<GameType[]>([]);
  const [DData, setDData] = useState<DungeonType[]>([]);

  const [GfilteredData, setGFilteredData] = useState<GameType[]>([]);
  const [DfilteredData, setDFilteredData] = useState<DungeonType[]>([]);
  const [gameId, setGameId] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    api.get("/game/games").then((res) => setGFilteredData(res.data));
    api.get("/game/dungeons/").then((res) => setDFilteredData(res.data));
  }, []);

  useEffect(() => {
    if (location.state?.reopen && location.state?.gameId) {
      setGameId(location.state.gameId)
      setGameStarted(true)
    }
  }, [location.state])

  const relatedDungeons = DfilteredData.filter((d) => d.game === gameId);
  const dungeonTypeNames: Record<number, string> = {
    1: "Egyszerű találkozás",
    2: "Kis kazamata",
    3: "Nagy kazamata",
  };

  return (
    <>
      <PNavbar gameStarted={gameStarted} setGameStarted={setGameStarted} />

      <div className="p-4">
        {!gameStarted ? (
          <>
            <h1 className="text-xl font-bold mb-4 text-center">
              Játék kiválasztása
            </h1>
            <div className="flex gap-4 flex-wrap">
              {GfilteredData.map((game) => (
                <Card key={game.id} className="m-0">
                  <CardContent className="flex flex-col gap-2">
                    <CardTitle>Játék {game.id}</CardTitle>
                    <Button
                      onClick={() => {
                        setGameId(game.id);
                        setGameStarted(true);
                      }}
                    >
                      Kiválasztás
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold w-full mb-2 text-center">
              Játék {gameId}
            </h2>
            <div className="flex">
              {relatedDungeons.length > 0 ? (
                relatedDungeons.map((dungeon) => {
                  const type = Number(dungeon.dungeonType);
                  return (
                    <Card key={dungeon.id} >
                      <CardContent className="flex flex-col gap-2">
                        <CardTitle>{dungeon.name}</CardTitle>
                        <CardTitle>
                          {dungeonTypeNames[type] ?? "Ismeretlen típus"}
                        </CardTitle>
                        <Button onClick={() => navigate("/player/deckbuilder", {state: { gameId, dungeonId: dungeon.id },})}><SwordIcon/>
                          Harc
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-gray-500">Nincs dungeon ehhez a játékhoz.</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PGameSelect;
