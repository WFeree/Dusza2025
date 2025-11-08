import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SwordIcon, HeartIcon, Car } from "lucide-react"
import api from "@/api"
import { AxiosError } from "axios"
import { set } from "zod"
import { useNavigate } from "react-router-dom"

interface CardTypesType {
  [key: string]: number;
}

const CardTypes: CardTypesType = {
  "fire": 1,
  "earth": 2,
  "water": 3,
  "air": 4,
}

export default function CardCreator() {
  const [color, setColor] = useState("#0084d1")
  const [title, setTitle] = useState("")
  const [damage, setDamage] = useState(2)
  const [health, setHealth] = useState(2)
  const [type, setType] = useState("water")
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>()
  const navigate = useNavigate();

  const handleSubmit = async () => {
      setLoading(true);
      try {
        const res = await api.post("/game/cards/", {
          "name": title,
          "damage": damage,
          "health": health,
          "affinity": CardTypes[type],
          "color": color,
        })
        

      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data);
          let newMessage = "";
          for (var key in error.response?.data) {
            newMessage += error.response?.data[key];
            console.log(key, error.response?.data[key]);
          }
          console.log(newMessage);
          setErrorMessage(newMessage);
        } else {
          setErrorMessage("Hiba történt a kártya létrehozásakor.");
        }
      } finally {
        setLoading(false);
        navigate("/cardlist");
      }
  
  }

  return (
    <>
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-semibold">Kártya létrehozása</h2>
        <Separator />

        <div className="space-y-2">
          <Label htmlFor="color">Szín</Label>
          <Input
            id="color"
            type="color"
            defaultValue={color}
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-10 p-1 cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Név</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="damage">Sebzés</Label>
          <Input
            id="damage"
            type="number"
            value={damage}
            min={2}
            max={100}
            onChange={(e) => setDamage(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hp">Életerő</Label>
          <Input
            id="hp"
            type="number"
            value={health}
            min={1}
            max={100}
            onChange={(e) => setHealth(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Típus</Label>
          <div className="flex justify-between gap-2">
            <Button className="w-1/5" variant={"outline"} onClick={() => setType("air")}>Levegő</Button>
            <Button className="w-1/5" variant={"water"} onClick={() => setType("water")}>Víz</Button>
            <Button className="w-1/5" variant={"fire"} onClick={() => setType("fire")}>Tűz</Button>
            <Button className="w-1/5" variant={"earth"} onClick={() => setType("earth")}>Föld</Button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Kártya előnézet</h2>
        <Separator className="mb-4"/>
        <Label className="pb-2 text-white">Kártya</Label>
        <Card>
          <CardHeader>
            <div className="w-full h-[100px] rounded-md" style={{ backgroundColor: color }}></div>
            <CardTitle className="font-bold text-xl">{title || "Névtelen kártya"}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around gap-4">
            <CardDescription className="text-md text-black flex gap-2 items-center">{<SwordIcon strokeWidth={1.5} size={18}/>}Sebzés: {damage}</CardDescription>
            <CardDescription className="text-md text-black flex gap-2 items-center">{<HeartIcon strokeWidth={1.5} size={18}/>}Életerő: {health}</CardDescription>
          </CardContent>
          <CardContent className="pb-8">
            <div
              className={`w-full h-[50px] rounded-md flex items-center justify-center text-black font-semibold border transition-all duration-200
                ${type === "water" ? "bg-blue-600 text-white" : ""}
                ${type === "fire" ? "bg-red-500 text-white" : ""}
                ${type === "air" ? "bg-white" : ""}
                ${type === "earth" ? "bg-green-600 text-white" : ""}
              `}
            >
              {type === "water" ? "Víz típus" : type === "fire" ? "Tűz típus" : type === "air" ? "Levegő típus" : "Föld típus"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    <div className="flex justify-center gap-4">
      <Button type="submit" onClick={() => handleSubmit()}>Mentés</Button>
      <div className="text-red-600">{<p>{errorMessage}</p>}</div>
      {loading && <p>Mentés folyamatban...</p>}
    </div>
    </>
  )
}
