import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import api from "@/api"
import { Card, CardTitle, CardDescription } from "./ui/card"
import { Button } from "./ui/button"
import { SwordIcon, HeartIcon } from "lucide-react"
import Navbar from "./Navbar"

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
  const [loading, setLoading] = useState(false)

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

  const toggleCard = (card: GameCard) => {
    const alreadySelected = selectedCards.some((c) => c.id === card.id)

    if (alreadySelected) {
      setSelectedCards((prev) => prev.filter((c) => c.id !== card.id))
    } else {
      if (selectedCards.length >= (dungeon?.cards?.length || 0)) {
        alert(`Csak ${dungeon.cards.length} kártyát választhatsz!`)
        return
      }
      setSelectedCards((prev) => [...prev, card])
    }
  }

  const handleSaveDeck = () => {
    if (selectedCards.length !== (dungeon?.cards?.length || 0)) {
      alert(`Pontosan ${dungeon.cards.length} kártyát kell kiválasztanod a mentéshez!`)
      return
    }

    console.log("Kiválasztott pakli:", selectedCards)
    alert("Pakli sikeresen összeállítva!")
    navigate("/battle",{
        state: { gameId, dungeonId, playerDeck: selectedCards },
    })
  }

  if (loading) {
    return (
      <>
        <Navbar />
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
      className={`CreatedCard p-2 w-full max-h-fit min-w-[245px] cursor-pointer transition-all duration-200 ${
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
    </Card>
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Pakli összeállítása</h1>

        {dungeon && (
          <p className="text-center text-muted-foreground mb-4">
            A kiválasztott kazamata <strong>{dungeon.cards.length}</strong> kártyát tartalmaz.  
            Válassz ugyanennyit a gyűjteményedből!
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Kiválasztott kártyák</h2>
            {selectedCards.length === 0 && (
              <p className="text-muted-foreground mb-2">Még nem választottál kártyát.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCards.map((card) => renderCard(card, true))}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Elérhető kártyák</h2>
            {availableCards.length === 0 ? (
              <p className="text-muted-foreground">Nincsenek elérhető kártyák ehhez a játékhoz.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCards.map((card) =>
                  renderCard(card, selectedCards.some((c) => c.id === card.id))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button onClick={handleSaveDeck}>Harc megkezdése</Button>
        </div>
      </div>
    </>
  )
}

export default PlayerDeckBuilder
