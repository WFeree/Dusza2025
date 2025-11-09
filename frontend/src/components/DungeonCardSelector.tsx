import api from '@/api'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from '@/components/ui/separator'
import { useLocation } from "react-router-dom"
import { SwordIcon, HeartIcon } from "lucide-react"
import { Label } from '@radix-ui/react-label'
import { Input } from './ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type GameCard = {
  id: number
  name: string
  damage: number
  health: number
  affinity: string
  color: string
}

const DungeonCardSelector = () => {
  const navigate = useNavigate()
  const [cards, setCards] = useState<GameCard[]>([])
  const location = useLocation()
  const { type, title, selectedCards: initialSelectedCards } = location.state || { type: "", title: "", selectedCards: [] }
  const [selectedCards, setSelectedCards] = useState<GameCard[]>(initialSelectedCards)
  const [originalCards] = useState<GameCard[]>(initialSelectedCards)
  const [showDialog, setShowDialog] = useState(false)
  const [baseCard, setBaseCard] = useState<any | null>(null)
  const [bossName, setBossName] = useState("")
  const [boostType, setBoostType] = useState<"damage" | "health" | "">("")


  useEffect(() => {
    api.get("/game/cards/")
    .then(res => {
      const allCards = res.data
      const alreadySelectedIds = initialSelectedCards.map((c: any) => c.id)
      const filteredCards = allCards.filter(
        (card: any) => !alreadySelectedIds.includes(card.id)
      )
      setCards(filteredCards)
      setSelectedCards(initialSelectedCards)
    })
    .catch(error => console.error("Hiba a kártyák lekérésekor:", error))
  }, [])

  const toggleCard = (card: GameCard) => {
    const alreadySelected = selectedCards.some((c) => c.id === card.id)

    const normalCount = selectedCards.filter((c) => !c.name.toLowerCase().includes("(vezér)")).length
    const bossCount = selectedCards.filter((c) => c.name.toLowerCase().includes("(vezér)")).length

    const normalLimit = type === "simple" ? 1 : type === "small" ? 3 : type === "large" ? 5 : 0
    const bossLimit = type === "simple" ? 0 : 1

    if (alreadySelected) {
      setSelectedCards((prev) => prev.filter((c) => c.id !== card.id))
      setCards((prev) => [...prev, card])
    } else {
      if (!card.name.toLowerCase().includes("(vezér)") && normalCount >= normalLimit) {
        alert(`Ebben a kazamatában legfeljebb ${normalLimit} sima kártyát választhatsz.`)
        return
      }
      if (card.name.toLowerCase().includes("(vezér)") && bossCount >= bossLimit) {
        alert(`Ebben a kazamatában csak ${bossLimit} vezérkártya engedélyezett.`)
        return
      }
      setSelectedCards((prev) => [...prev, card])
      setCards((prev) => prev.filter((c) => c.id !== card.id))
    }
}

  const getCardLimit = (type: string) => {
    switch (type) {
      case "simple":
        return 1
      case "small":
        return 3
      case "large":
        return 5
      default:
        return 0
    }
  }
  const cardLimit = getCardLimit(type)

  const handleSave = () => {
  const normalCount = selectedCards.filter((c) => !c.name.toLowerCase().includes("(vezér)")).length
  const bossCount = selectedCards.filter((c) => c.name.toLowerCase().includes("(vezér)")).length

  if (type === "simple" && (normalCount !== 1 || bossCount !== 0)) {
    alert("Az egyszerű kazamatának pontosan 1 sima kártyát kell tartalmaznia.")
    return
  }
  if (type === "small" && (normalCount !== 3 || bossCount !== 1)) {
    alert("A kis kazamatának 3 sima és 1 vezérkártyát kell tartalmaznia.")
    return
  }
  if (type === "large" && (normalCount !== 5 || bossCount !== 1)) {
    alert("A nagy kazamatának 5 sima és 1 vezérkártyát kell tartalmaznia.")
    return
  }

  navigate("/dungeon", {
    state: {
      selectedCards,
      type,
      title,
    },
  })
}

  const handleCreateBoss = async () => {
    if (!baseCard || !bossName || !boostType) return

    const bossCount = selectedCards.filter((c) => c.name.toLowerCase().includes("(vezér)")).length
    const bossLimit = type === "simple" ? 0 : 1
    if (bossCount >= bossLimit) {
      alert(`Ehhez a kazamatatípushoz legfeljebb ${bossLimit} vezérkártya hozható létre.`)
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
      const createdBossCard = {
        ...res.data,
        originalCardId: baseCard.id,
        extraType: boostType,
      }

      setSelectedCards((prev) => [...prev, createdBossCard])
      setShowDialog(false)
      setBossName("")
      setBoostType("")
      setBaseCard(null)
    } catch (error) {
      console.error("Hiba a vezérkártya létrehozásakor:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kártyák kiválasztása</h1>
        <Button onClick={() => navigate("/dungeon", {state: {title, type, selectedCards: originalCards}})}>Vissza</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className='flex-1'>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold mb-2">Kiválasztott kártyák</h2>
            <Button onClick={handleSave}>
              Mentés
            </Button>
          </div>
          <Separator className="mb-4" />
          {selectedCards.length === 0 ? (
            <p className="text-muted-foreground">Nincs kiválasztott kártya.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedCards.map(card => (
                <Card key={card.id} onClick={() => toggleCard(card)} className="cursor-pointer border border-blue-500 bg-blue-100 transition hover:bg-blue-200 transition p-3">
                  <CardTitle className="font-bold text-xl">{card.name}</CardTitle>
                  <div className="text-md text-black flex gap-2 items-center">
                    <SwordIcon strokeWidth={1.5} size={18} /> Sebzés: {card.damage}
                  </div>   
                  <div className="text-md text-black flex gap-2 items-center">
                    <HeartIcon strokeWidth={1.5} size={18} /> Életerő: {card.health}
                  </div>         
                  <div
                    className={`w-full h-[30px] rounded-md flex items-center justify-center text-black font-semibold border transition-all duration-200
                    ${Number(card.affinity) === 1 ? "bg-red-500 text-white" : ""}
                    ${Number(card.affinity) === 2 ? "bg-green-600 text-white" : ""}
                    ${Number(card.affinity) === 3 ? "bg-blue-600 text-white" : ""}
                    ${Number(card.affinity) === 4 ? "bg-white" : ""}
                  `}>
                    {Number(card.affinity) === 3
                      ? "Víz típus"
                      : Number(card.affinity) === 1
                      ? "Tűz típus"
                      : Number(card.affinity) === 4
                      ? "Levegő típus"
                      : "Föld típus"}
                  </div>
                  
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className='flex-1'>
          <h2 className="text-lg font-semibold mb-2">Választható kártyák</h2>
          <Separator className="mb-4" />
          {cards.length === 0 ? (
             <p className="text-muted-foreground">Nincsenek kártyák az adatbázisban.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cards.map(card => (
                <Card key={card.id} onClick={() => toggleCard(card)} className="cursor-pointer border transition hover:border-gray-400 transition p-3">
                  <CardTitle className="font-bold text-xl">{card.name}</CardTitle>  
                  <div className="text-md text-black flex gap-2 items-center">
                    <SwordIcon strokeWidth={1.5} size={18} /> Sebzés: {card.damage}
                  </div>  
                  <div className="text-md text-black flex gap-2 items-center">
                    <HeartIcon strokeWidth={1.5} size={18} /> Életerő: {card.health}
                  </div>  
                  <div
                    className={`w-full h-[30px] rounded-md flex items-center justify-center text-black font-semibold border transition-all duration-200
                      ${Number(card.affinity) === 1 ? "bg-red-500 text-white" : ""}
                      ${Number(card.affinity) === 2 ? "bg-green-600 text-white" : ""}
                      ${Number(card.affinity) === 3 ? "bg-blue-600 text-white" : ""}
                      ${Number(card.affinity) === 4 ? "bg-white" : ""}
                  `}
                  >
                    {Number(card.affinity) === 3
                      ? "Víz típus"
                      : Number(card.affinity) === 1
                      ? "Tűz típus"
                      : Number(card.affinity) === 4
                      ? "Levegő típus"
                      : "Föld típus"}
                  </div> 
                  <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setBaseCard(card)
                        setShowDialog(true)
                      }}
                    >
                      Vezérré alakítás
                    </Button>         
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-center">
          <Button onClick={handleSave}>
            Mentés
          </Button>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Vezérkártya létrehozása</DialogTitle>
          </DialogHeader>

          {baseCard && (
            <div className="space-y-3">
              <Label>Név</Label>
              <Input
                value={bossName}
                onChange={(e) => setBossName(e.target.value)}
                placeholder="Pl. A Föld Ura"
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

              <div className="mt-3 text-sm text-muted-foreground">
                <p>
                  Alap kártya: <strong>{baseCard.name}</strong>
                </p>
                <p>
                  Új értékek: Sebzés{" "}
                  <strong>
                    {boostType === "damage" ? baseCard.damage * 2 : baseCard.damage}
                  </strong>
                  , Életerő{" "}
                  <strong>
                    {boostType === "health" ? baseCard.health * 2 : baseCard.health}
                  </strong>
                </p>
              </div>

              <Button onClick={handleCreateBoss} disabled={!bossName || !boostType}>
                Létrehozás
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DungeonCardSelector

