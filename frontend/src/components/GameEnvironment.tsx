import api from '@/api'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardTitle } from './ui/card'
import { HeartIcon, SwordIcon } from 'lucide-react'
import { Button } from './ui/button'
import GMNavbar from './GMNavbar'
import CardFilter from './CardFilter'

const GameEnvironment = () => {
  const navigate = useNavigate()
  const [cards, setCards] = useState<any[]>([])
  const [selectedCards, setSelectedCards] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filteredCards, setFilteredCards] = useState<any[]>([])

  loading

  useEffect(() => {
    api.get("/game/cards/")
      .then(res => setCards(res.data))
      .catch(err => console.error("Hiba a kártyák lekérésekor:", err))
  }, [])

  const toggleCard = (card: any) => {
    const alreadySelected = selectedCards.some(c => c.id === card.id)
    if (alreadySelected) {
      setSelectedCards(prev => prev.filter(c => c.id !== card.id))
      setCards(prev => [...prev, card])
    } else {
      setSelectedCards(prev => [...prev, card])
      setCards(prev => prev.filter(c => c.id !== card.id))
    }
  }

  const handleSave = async () => {
    if (selectedCards.length === 0) {
        alert("Legalább egy kártyát ki kell választanod a gyűjtemény mentéséhez!")
        return
    }

    setLoading(true)
    try {
        const gameRes = await api.post("/game/games/", {})
        const gameId = gameRes.data.id
        console.log("Game létrehozva, ID:", gameId)

        for (const card of selectedCards) {
        await api.post("/game/playerCards/", {
            game: gameId,
            card: card.id,
            isBoss: false,
            extra: false,
        })
        }

        alert(`Gyűjtemény sikeresen mentve az adatbázisba! (${selectedCards.length} kártya)`)
        navigate("/dungeon", { state: { gameId } })
    } catch (error) {
        console.error("Hiba a gyűjtemény mentésekor:", error)
        alert("Nem sikerült menteni a gyűjteményt.")
    } finally {
        setLoading(false)
    }
 }

  return (
    <>
    <GMNavbar/>
    <CardFilter data={cards} onFilter={setFilteredCards} />
    <div className="min-h-screen bg-background p-6">
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Játékkörnyezet létrehozása</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
            <div className='flex-1'>
                <h2 className="text-lg font-semibold mb-2">Kiválasztott kártyák</h2>
                <Separator className="mb-4" />
                {selectedCards.length === 0 ? (
                    <p className="text-muted-foreground">Nincs kiválasztott kártya.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedCards.map(card => (
                            <Card key={card.id} onClick={() => toggleCard(card)} className="cursor-pointer border border-blue-500 bg-blue-100 hover:bg-blue-200 transition p-3">
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
            <div className="mt-8 flex justify-center gap-4">
                <Button onClick={handleSave}>Gyűjtemény mentése</Button>
            </div>
            <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Elérhető kártyák</h2>
                {cards.length === 0 ? (
                    <p className="text-muted-foreground">Nincs több elérhető kártya.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredCards.map(card => (
                            <Card
                            key={card.id}
                            onClick={() => toggleCard(card)}
                            className="cursor-pointer border transition hover:border-gray-400 p-3"
                            >
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
                                ${Number(card.affinity) === 4 ? "bg-yellow-400 text-black" : ""}
                                `}
                            >
                                {Number(card.affinity) === 1
                                ? "Tűz típus"
                                : Number(card.affinity) === 2
                                ? "Föld típus"
                                : Number(card.affinity) === 3
                                ? "Víz típus"
                                : "Levegő típus"}
                            </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
        
    </div>
    </>
    
    
    
  )
}

export default GameEnvironment