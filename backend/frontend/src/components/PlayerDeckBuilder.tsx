import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import api from "@/api"
import { Card, CardTitle, CardDescription } from "./ui/card"
import { Button } from "./ui/button"
import { SwordIcon, HeartIcon } from "lucide-react"
import PNavbar from "./PNavbar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

type GameCard = {
  id: number
  name: string
  damage: number
  health: number
  affinity: number
}

const PlayerDeckBuilder = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { gameId, dungeonId } = location.state || {}

  const [availableCards, setAvailableCards] = useState<GameCard[]>([])
  const [dungeon, setDungeon] = useState<any>(null)
  const [selectedCards, setSelectedCards] = useState<GameCard[]>([])
  const [bossCard, setBossCard] = useState<GameCard | null>(null)
  const [loading, setLoading] = useState(false)

  const [showDialog, setShowDialog] = useState(false)
  const [baseCard, setBaseCard] = useState<GameCard | null>(null)
  const [bossName, setBossName] = useState("")
  const [boostType, setBoostType] = useState<"damage" | "health" | "">("")

  useEffect(() => {
    if (!gameId || !dungeonId) {
      alert("Hiányzó adatok! Kérlek válassz játékot és kazamatát újra.")
      navigate("/player/gameselect")
      return
    }

    setLoading(true)
    Promise.all([
      api.get(`/game/dungeons/${dungeonId}/`),
      api.get(`/game/playerCards/?game=${gameId}`),
      api.get("/game/cards/"),
    ])
      .then(([dungeonRes, playerCardsRes, cardsRes]) => {
        setDungeon(dungeonRes.data)

        const playerCardIds = playerCardsRes.data
          .filter((pc: any) => pc.game === gameId)
          .map((pc: any) => pc.card)

        const cardsForGame = cardsRes.data.filter((card: any) =>
          playerCardIds.includes(card.id)
        )

        setAvailableCards(cardsForGame)
      })
      .catch((err) => console.error("Hiba az adatok lekérésekor:", err))
      .finally(() => setLoading(false))
  }, [gameId, dungeonId])

  const limits = {
    1: { normal: 1, boss: 0 },
    2: { normal: 3, boss: 1 },
    3: { normal: 5, boss: 1 },
  }

  const dungeonLimit =
  limits[dungeon?.dungeonType as keyof typeof limits] || { normal: 0, boss: 0 }

  const toggleCard = (card: GameCard) => {
    const alreadySelected = selectedCards.some((c) => c.id === card.id)
    const normalCount = selectedCards.filter((c) => !c.name.includes("(Vezér)")).length

    if (alreadySelected) {
      setSelectedCards((prev) => prev.filter((c) => c.id !== card.id))
    } else {
      if (normalCount >= dungeonLimit.normal) {
        alert(`Ebben a kazamatában legfeljebb ${dungeonLimit.normal} sima kártyát választhatsz!`)
        return
      }
      setSelectedCards((prev) => [...prev, card])
    }
  }

  const handleCreateBoss = async () => {
    if (!baseCard || !bossName || !boostType) return
    if (bossCard) {
      alert("Már van vezérkártyád ebben a pakliban!")
      return
    }

    const newCardData = {
      name: `${bossName} (Vezér)`,
      damage: boostType === "damage" ? baseCard.damage * 2 : baseCard.damage,
      health: boostType === "health" ? baseCard.health * 2 : baseCard.health,
      affinity: baseCard.affinity,
    }

    try {
      const res = await api.post("/game/cards/", newCardData)
      const createdBoss = res.data

      setBossCard(createdBoss)
      setSelectedCards((prev) => [...prev, createdBoss])
      setShowDialog(false)
      setBaseCard(null)
      setBossName("")
      setBoostType("")
    } catch (error) {
      console.error("Hiba a vezérkártya létrehozásakor:", error)
    }
  }

  const handleSaveDeck = () => {
    const normalCount = selectedCards.filter((c) => !c.name.includes("(Vezér)")).length
    const bossCount = selectedCards.filter((c) => c.name.includes("(Vezér)")).length

    if (normalCount !== dungeonLimit.normal || bossCount !== dungeonLimit.boss) {
      alert(
        `Ehhez a kazamatához ${dungeonLimit.normal} sima és ${dungeonLimit.boss} vezérkártya szükséges!`
      )
      return
    }

    navigate("/battle", {
      state: { gameId, dungeonId, playerDeck: selectedCards },
    })
  }

  if (loading) {
    return (
      <>
        <PNavbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-muted-foreground">Betöltés...</p>
        </div>
      </>
    )
  }

  const renderCard = (card: GameCard, isSelected: boolean) => (
    <Card
      key={card.id}
      onClick={() => toggleCard(card)}
      className={`CreatedCard p-2 w-full max-h-fit min-w-[220px] cursor-pointer transition-all duration-200 ${
        isSelected ? "border-blue-500 bg-blue-100" : "hover:border-gray-400"
      }`}
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
        ${card.affinity === 1 ? "bg-red-500 text-white" : ""}
        ${card.affinity === 2 ? "bg-green-600 text-white" : ""}
        ${card.affinity === 3 ? "bg-blue-600 text-white" : ""}
        ${card.affinity === 4 ? "bg-yellow-300" : ""}
      `}
      >
        {card.affinity === 3
          ? "Víz típus"
          : card.affinity === 1
          ? "Tűz típus"
          : card.affinity === 4
          ? "Levegő típus"
          : "Föld típus"}
      </div>

      {dungeonLimit.boss > 0 && (
        <Button
          size="sm"
          variant="outline"
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation()
            setBaseCard(card)
            setShowDialog(true)
          }}
        >
          Vezérré alakítás
        </Button>
      )}
    </Card>
  )

  if (loading) {
    return (
      <>
        <PNavbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-muted-foreground">Betöltés...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PNavbar />
      <div className="min-h-screen bg-background p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Pakli összeállítása</h1>

        {dungeon && (
          <p className="text-center text-muted-foreground mb-4">
            Ehhez a kazamatához <strong>{dungeonLimit.normal}</strong> sima és{" "}
            <strong>{dungeonLimit.boss}</strong> vezérkártya szükséges.
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Kiválasztott kártyák</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCards.map((card) => renderCard(card, true))}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Elérhető kártyák</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {availableCards.map((card) =>
                renderCard(card, selectedCards.some((c) => c.id === card.id))
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={handleSaveDeck}>Harc megkezdése</Button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Vezérkártya létrehozása</DialogTitle>
          </DialogHeader>

          {baseCard && (
            <div className="space-y-3">
              <Label>Név</Label>
              <Input
                value={bossName}
                onChange={(e) => setBossName(e.target.value)}
                placeholder="Pl. A Lángok Ura"
              />

              <Label>Származtatás típusa</Label>
              <div className="flex gap-2">
                <Button
                  variant={boostType === "damage" ? "default" : "outline"}
                  onClick={() => setBoostType("damage")}
                >
                  Sebzés duplázás
                </Button>
                <Button
                  variant={boostType === "health" ? "default" : "outline"}
                  onClick={() => setBoostType("health")}
                >
                  Életerő duplázás
                </Button>
              </div>

              <Button onClick={handleCreateBoss} disabled={!bossName || !boostType}>
                Létrehozás
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PlayerDeckBuilder
