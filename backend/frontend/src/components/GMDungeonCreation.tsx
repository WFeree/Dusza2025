import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNavigate, useLocation } from "react-router-dom"
import { HeartIcon, SwordIcon } from "lucide-react"
import api from "@/api"

export default function DungeonCreator() {
  const location = useLocation()
  const navigate = useNavigate()
  const [gameId, setGameId] = useState<number | null>(null)
  const [title, setTitle] = useState(location.state?.title || "Queen of the Dead")
  const [type, setType] = useState(location.state?.type || "")
  const [selectedCards, setSelectedCards] = useState(location.state?.selectedCards || [])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  errorMessage

  useEffect(() => {
    const idFromState = location.state?.gameId
    const idFromStorage = localStorage.getItem("gameId")

    if (idFromState) {
      setGameId(idFromState)
      localStorage.setItem("gameId", idFromState)
    } else if (idFromStorage) {
      setGameId(Number(idFromStorage))
    } else {
      alert("Nincs játék azonosító — visszairányítunk a gyűjteményhez.")
      navigate("/gameenvironment")
    }
  }, [location, navigate])

  const handleSubmit = async (redirectTo?: string) => {
    if (!gameId) {
      setErrorMessage("Hiányzik a game ID!")
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      const typeMap: any = {
        simple: 1,
        small: 2,
        large: 3,
      }

      const dungeonType = typeMap[type] || 1
      const cardIds = selectedCards.map((c: any) => c.id)

      const bossCard = selectedCards.find((c: any) =>
        c.name.toLowerCase().includes("(vezér)")
      )

    const res = await api.post("/game/dungeons/", {
      name: title,
      game: gameId,
      cards: cardIds,
      dungeonType,
      boss: bossCard?.id || null,
      extra: false,
      completed: false,
    })

      if (res.status === 201 || res.status === 200) {
        console.log("Kazamata mentve:", res.data)
        if (redirectTo === "home") {
          navigate("/")
        } else if (redirectTo === "new") {
          setTitle("Új kazamata")
          setType("")
          setSelectedCards([])
        }
      }
    } catch (error: any) {
      console.error("Kazamata mentési hiba:", error)
      setErrorMessage("Nem sikerült menteni a kazamatát.")
      console.error("Szerver válasz:", error?.response?.data)
      alert(JSON.stringify(error?.response?.data))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <Button
          onClick={() => navigate("/gameenvironment")}
          className="absolute top-4 right-4 z-10"
        >
          Vissza
        </Button>

        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold">Kazamata létrehozása</h2>
          <Separator />

          <div className="space-y-2">
            <Label htmlFor="title">Név</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Kazamata Típusa</Label>
            <div className="flex justify-between gap-2">
              <Button
                className="w-1/5"
                variant={"simple"}
                onClick={() => setType("simple")}
              >
                Egyszerű találkozás
              </Button>
              <Button
                className="w-1/5"
                variant={"small"}
                onClick={() => setType("small")}
              >
                Kis kazamata
              </Button>
              <Button
                className="w-1/5"
                variant={"large"}
                onClick={() => setType("large")}
              >
                Nagy kazamata
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() =>
                navigate("/cardselector", {
                  state: { type, title, selectedCards, gameId },
                })
              }
            >
              Kártyák választása
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Kazamata előnézet</h2>
          <Separator className="mb-4" />
          <Label className="pb-2 text-white">Kártyák</Label>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-xl">
                {title || "Névtelen kazamata"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-8">
              <div
                className={`w-full h-[50px] rounded-md flex items-center justify-center text-black font-semibold border transition-all duration-200
                  ${type === "" ? "text-black border border-gray-200 bg-transparent" : ""}
                  ${type === "simple" ? "bg-blue-600 text-white" : ""}
                  ${type === "small" ? "bg-green-500 text-white" : ""}
                  ${type === "large" ? "bg-red-500 text-white" : ""}
                `}
              >
                {type === ""
                  ? "Nincs típus"
                  : type === "simple"
                  ? "Egyszerű találkozás"
                  : type === "small"
                  ? "Kis kazamata"
                  : type === "large"
                  ? "Nagy kazamata"
                  : "Ismeretlen típus"}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  Kiválasztott kártyák
                </h3>
                {selectedCards.length === 0 ? (
                  <p className="text-muted-foreground">
                    Még nem választottál kártyákat.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCards.map((card: any) => (
                      <Card
                        key={card.id}
                        className="border rounded-lg p-4 shadow-sm transition hover:shadow-md bg-card text-card-foreground"
                      >
                        <CardTitle
                          className={`font-bold text-xl mb-2 ${
                            card.name.includes("(Vezér)")
                              ? "text-yellow-500"
                              : ""
                          }`}
                        >
                          {card.name}
                        </CardTitle>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-2">
                            <SwordIcon strokeWidth={1.5} size={16} />
                            <span>Sebzés: {card.damage}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HeartIcon strokeWidth={1.5} size={16} />
                            <span>Élet: {card.health}</span>
                          </div>
                        </div>
                        <div
                          className={`mt-3 w-full h-7 rounded-md flex items-center justify-center text-white font-semibold transition-all duration-200
                          ${Number(card.affinity) === 1 ? "bg-red-500" : ""}
                          ${Number(card.affinity) === 2 ? "bg-green-600" : ""}
                          ${Number(card.affinity) === 3 ? "bg-blue-600" : ""}
                          ${Number(card.affinity) === 4 ? "bg-yellow-400 text-black" : ""}
                      `}
                        >
                          {Number(card.affinity) === 1
                            ? "Tűz típus"
                            : Number(card.affinity) === 2
                            ? "Föld típus"
                            : Number(card.affinity) === 3
                            ? "Víz típus"
                            : Number(card.affinity) === 4
                            ? "Levegő típus"
                            : "Ismeretlen típus"}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          type="submit"
          onClick={() => handleSubmit("home")}
          disabled={loading}
        >
          Mentés
        </Button>
        <Button
          variant={"outline"}
          type="submit"
          onClick={() => handleSubmit("new")}
          disabled={loading}
        >
          Mentés és új kazamata létrehozása
        </Button>
      </div>
    </>
  )
}
