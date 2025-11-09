import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SwordIcon, HeartIcon} from "lucide-react"
import api from "@/api"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Navbar from "./Navbar"

interface CardTypesType {
  [key: string]: number
}

const CardTypes: CardTypesType = {
  none: 0,
  fire: 1,
  earth: 2,
  water: 3,
  air: 4,
}

export default function CardCreator() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("Queen of the Dead")
  const [damage, setDamage] = useState(2)
  const [health, setHealth] = useState(2)
  const [type, setType] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    document.body.classList.add("no-scroll")
    return () => document.body.classList.remove("no-scroll")
  }, [])

  const handleSubmit = async (redirectTo?: string) => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await api.post("/game/cards/", {
        name: title,
        damage: damage,
        health: health,
        affinity: CardTypes[type],
      })

      if (res.status === 201 || res.status === 200) {
        // ✅ Success
        if (redirectTo === "cardlist") {
          navigate("/cardlist")
        } else if (redirectTo === "reload") {
          window.location.reload()
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data)

        // 🟥 Custom error for 500 - "no type selected"
        if (error.response?.status === 500) {
          setErrorMessage("Nincs típus kiválasztva.")
        } else {
          // 🔎 Collect readable backend errors
          let newMessage = ""
          for (const key in error.response?.data) {
            newMessage += `${key}: ${error.response?.data[key]} `
          }
          setErrorMessage(newMessage || "Ismeretlen hiba történt.")
        }
      } else {
        setErrorMessage("Hiba történt a kártya létrehozásakor.")
      }

      // ⏰ Automatically clear alert after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      {/* ⚠️ Error Alert */}
      {errorMessage && (
        <div className="p-4 animate-in fade-in-50 slide-in-from-top-2">
          <Alert variant="destructive">
            <AlertTitle>Hiba történt</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Név</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
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
              onChange={(e: any) => setDamage(Number(e.target.value))}
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
              onChange={(e: any) => setHealth(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Típus</Label>
            <div className="flex justify-between gap-2">
              <Button
                className="w-1/5"
                variant={"outline"}
                onClick={() => setType("air")}
              >
                Levegő
              </Button>
              <Button
                className="w-1/5"
                variant={"water"}
                onClick={() => setType("water")}
              >
                Víz
              </Button>
              <Button
                className="w-1/5"
                variant={"fire"}
                onClick={() => setType("fire")}
              >
                Tűz
              </Button>
              <Button
                className="w-1/5"
                variant={"earth"}
                onClick={() => setType("earth")}
              >
                Föld
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <Label className="pb-2 text-white">Kártya</Label>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-xl">
                {title || "Névtelen kártya"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around gap-4">
              <CardDescription className="text-md text-black flex gap-2 items-center">
                <SwordIcon strokeWidth={1.5} size={18} /> Sebzés: {damage}
              </CardDescription>
              <CardDescription className="text-md text-black flex gap-2 items-center">
                <HeartIcon strokeWidth={1.5} size={18} /> Életerő: {health}
              </CardDescription>
            </CardContent>
            <CardContent className="pb-8">
              <div
                className={`w-full h-[50px] rounded-md flex items-center justify-center text-black font-semibold border transition-all duration-200
                ${type === "none" ? "bg-blue-600 text-white" : ""}
                ${type === "water" ? "bg-blue-600 text-white" : ""}
                ${type === "fire" ? "bg-red-500 text-white" : ""}
                ${type === "air" ? "bg-white" : ""}
                ${type === "earth" ? "bg-green-600 text-white" : ""}
              `}
              >
                {type === "none"
                  ? "Nincs típus"
                  : type === "water"
                  ? "Víz típus"
                  : type === "fire"
                  ? "Tűz típus"
                  : type === "air"
                  ? "Levegő típus"
                  : type === "earth"
                  ? "Föld típus"
                  : ""}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button disabled={loading} onClick={() => handleSubmit("cardlist")}>
          Mentés
        </Button>

        <Button
          disabled={loading}
          variant={"outline"}
          onClick={() => handleSubmit("reload")}
        >
          Mentés és új kártya létrehozása
        </Button>
      </div>
    </>
  )
}
