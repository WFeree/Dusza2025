import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"


export default function CardCreator() {
  const location = useLocation()
  const [title, setTitle] = useState(location.state?.title || "Queen of the Dead")
  const [type, setType] = useState(location.state?.type || "")
  const navigate = useNavigate()
  const selectedCards = location.state?.selectedCards || []

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

  return (
    <>
    <div className="flex flex-col md:flex-row gap-6 p-6">
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
            <Button className="w-1/5" variant={"simple"} onClick={() => setType("simple")}>Egyszerű találkozás</Button>
            <Button className="w-1/5" variant={"small"} onClick={() => setType("small")}>Kis kazamata</Button>
            <Button className="w-1/5" variant={"large"} onClick={() => setType("large")}>Nagy kazamata</Button>
          </div>
        </div> 
        <div className="space-y-2">
            <Button onClick={() => navigate("/cardselector", { state: { type, title, selectedCards }})}>
                Kártyák választása
            </Button>  
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Kazamata előnézet</h2>
        <Separator className="mb-4"/>
        <Label className="pb-2 text-white">Kártya</Label>
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-xl">{title || "Névtelen kártya"}</CardTitle>
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
              {type === "" ? "Nincs típus" : type === "simple" ? "Egyszerű találkozás" : type === "small" ? "Kis kazamata" : type === "large" ? "Nagy kazamata" : "Ismeretlen típus"}
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Kiválasztott kártyák</h3>
                {selectedCards.length === 0 ? (
                    <p className="text-muted-foreground">Még nem választottál kártyákat.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedCards.map((card: any) => (
                            <div key = {card.id} className="p-3 border rounded-md shadow-sm flex items-center gap-3">
                                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: card.color }}></div>
                                <span className="font-medium">{card.name}</span>
                                <CardContent className="text-sm text-foreground">
                                    Sebzés: {card.damage}
                                    Élet: {card.health}
                                    Típus: {getAffinityName(card.affinity)}
                                </CardContent>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    <div className="flex justify-center gap-4">
      <Button type="submit">Mentés</Button>
      <Button variant={"outline"} type="submit">Mentés és új kártya létrehozása</Button>
    </div>
    </>
  )
}
