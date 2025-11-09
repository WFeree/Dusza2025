import { useEffect, useState } from "react";
import api from "@/api";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useLocation, useNavigate } from "react-router-dom";

type GameType = {
  id: number;
  creator: number;
};

type DungeonType = {
  id: number;
  creator: number;
  game: number;
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
    // ✅ Fetch games
    api
      .get("/game/games")
      .then((res) => {
        setGData(res.data);
        setGFilteredData(res.data);
        console.log("Games:", res.data);
      })
      .catch((error) => console.error(error));

    api
      .get("/game/dungeons/")
      .then((res) => {
        setDData(res.data);
        setDFilteredData(res.data);
        console.log("Dungeons:", res.data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (location.state?.reopen && location.state?.gameId) {
      setGameId(location.state.gameId)
      setGameStarted(true)
    }
  }, [location.state])

  const relatedDungeons = DfilteredData.filter((d) => d.game === gameId);

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Játék kiválasztása</h1>
      <div className="flex gap-4 flex-wrap">
        {!gameStarted && (
          <>
            {GfilteredData.map((game, index) => (
              <Card key={`game-${game.id}-${index}`}>
                <CardContent>
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
          </>
        )}

        {gameStarted && (
          <>
            <nav className="flex gap-2 mb-4 w-full">
              <Button onClick={() => navigate("/")}>Vissza a menübe</Button>
              <Button onClick={() => setGameStarted(false)} variant="outline">
                Játék választása
              </Button>
            </nav>

            <h2 className="text-lg font-semibold w-full">
              Játék folyamatban: {gameId}
            </h2>

            {relatedDungeons.length > 0 ? (
              relatedDungeons.map((dungeon, index) => (
                <Card key={`dungeon-${dungeon.id}-${index}`}>
                  <CardContent>
                    <CardTitle>Dungeon {dungeon.id}</CardTitle>
                    <Button onClick={() => navigate("/player/deckbuilder", {state: { gameId, dungeonId: dungeon.id },})}>
                      Harc
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">Nincs dungeon ehhez a játékhoz.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PGameSelect;
