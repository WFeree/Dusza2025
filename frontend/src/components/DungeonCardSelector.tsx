import api from '@/api'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from '@/components/ui/separator'
import { useLocation } from "react-router-dom"
import { SwordIcon, HeartIcon } from "lucide-react"

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
    const alreadySelected = selectedCards.some(c => c.id === card.id)
    if (alreadySelected){
      setSelectedCards(prev => prev.filter(c => c.id !== card.id))
      setCards(prev => [...prev, card])
    } else{
      if (selectedCards.length < cardLimit){
        setSelectedCards(prev => [...prev, card])
        setCards(prev => prev.filter(c => c.id !== card.id))
      } else {
        alert(`Csak ${cardLimit} kártyát választhatsz ebbe a kazamatába!`)
      }
      
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

  const getAffinityName = (affinity: number | string) => {
    switch  (Number(affinity)){
      case 1: 
        return "Tűz"
      case 2: 
        return "Föld"
      case 3:
        return "Víz"
      case 4:
        return "Levegő"
      default:
        return "Ismeretlen"
    }
  }

  const handleSave = () => {
    if (selectedCards.length !== cardLimit) {
      alert(`Pontosan ${cardLimit} kártyát kell választanod!`)
      return
    }

    navigate("/dungeon", { 
      state: { 
        selectedCards,
        type: type, 
        title
      } 
    })
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
    </div>
  )
}

export default DungeonCardSelector

