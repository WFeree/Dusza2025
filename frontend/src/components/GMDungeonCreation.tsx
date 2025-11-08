import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

export default function CardCreator() {
  const [title, setTitle] = useState("Queen of the Dead")
  const [type, setType] = useState("")
  const navigate = useNavigate()

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
            <Button onClick={() => navigate("/cardselector")}>
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
