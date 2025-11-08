import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

export function DungeonCardSelector() {
  const navigate = useNavigate()

  // Példa adatok – ezeket később jöhetnek pl. API-ból vagy localStorage-ből
  const allCards = [
    { id: 1, title: "Queen of the Dead", type: "large" },
    { id: 2, title: "Skeleton Guard", type: "simple" },
    { id: 3, title: "Shadow Maze", type: "small" },
    { id: 4, title: "Goblin Horde", type: "simple" },
  ]

  const [selectedCards, setSelectedCards] = useState<number[]>([])

  const toggleCard = (id: number) => {
    setSelectedCards((prev) =>
      prev.includes(id)
        ? prev.filter((cardId) => cardId !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kártyák kiválasztása</h1>
        <Button onClick={() => navigate("/dungeon")}>Vissza</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Kiválasztott kártyák</h2>
          <Separator className="mb-4" />
          {selectedCards.length === 0 ? (
            <p className="text-muted-foreground">Nincs kiválasztott kártya.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedCards.map((id) => {
                const card = allCards.find((c) => c.id === id)
                return (
                  <Card
                    key={id}
                    className="cursor-pointer border-primary hover:bg-primary/10 transition"
                    onClick={() => toggleCard(id)}
                  >
                    <CardHeader>
                      <CardTitle>{card?.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Típus: {card?.type}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Jobb oldal – összes kártya */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2">Összes kártya</h2>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allCards.map((card) => (
              <Card
                key={card.id}
                className={`cursor-pointer transition border ${
                  selectedCards.includes(card.id)
                    ? "border-primary bg-primary/10"
                    : "hover:border-primary/50"
                }`}
                onClick={() => toggleCard(card.id)}
              >
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Típus: {card.type}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Lábgombok */}
      <div className="mt-8 flex justify-center gap-4">
        <Button variant="outline" onClick={() => setSelectedCards([])}>
          Kiválasztás törlése
        </Button>
        <Button
          disabled={selectedCards.length === 0}
          onClick={() => alert(`Mentett kártyák: ${selectedCards.join(", ")}`)}
        >
          Kártyák mentése
        </Button>
      </div>
    </div>
  )
}
