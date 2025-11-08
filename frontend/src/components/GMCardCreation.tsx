import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SwordIcon, HeartIcon, EyeIcon, ChevronLeft } from "lucide-react"
import api from "@/api"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CardTypesType {
  [key: string]: number;
}

const CardTypes: CardTypesType = {
  fire: 1,
  earth: 2,
  water: 3,
  air: 4,
}

export default function CardCreator() {
  const navigate = useNavigate()
  const [color, setColor] = useState("#0084d1")
  const [title, setTitle] = useState("Queen of the Dead")
  const [damage, setDamage] = useState(2)
  const [health, setHealth] = useState(2)
  const [type, setType] = useState("water")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    document.body.classList.add("no-scroll")
    return () => document.body.classList.remove("no-scroll")
  }, [])

  const handleSubmit = async (redirectTo?: string) => {
    setLoading(true)
    setErrorMessage(null)
    setShowError(false)

    try {
      const res = await api.post("/game/cards/", {
        name: title,
        damage: damage,
        health: health,
        affinity: CardTypes[type],
        color: color,
      })

      if (res.status === 201 || res.status === 200) {
        // ✅ Success
        if (redirectTo === "cardlist") {
          navigate("/cardlist")
        } else if (redirectTo === "reload") {
          window.location.reload()
        }
      }
    } catch (error: unknown) {
      // ❌ Error
      const message =
        typeof error === "string"
          ? error
          : error instanceof Error
          ? error.message
          : JSON.stringify(error)
      setErrorMessage(message)
      setShowError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mt-2 mx-4 flex flex-col">
        <nav className="flex justify-between">
          <Button onClick={() => navigate("/")}>
            <ChevronLeft />
            Vissza a menübe
          </Button>
          <h1 className="text-2xl font-semibold text-center mb-2">
            Kártya létrehozása
          </h1>
          <Button variant={"outline"} onClick={() => navigate("/cardlist")}>
            <EyeIcon />
            Kártyák megtekintése
          </Button>
        </nav>
        <Separator />
      </div>

      {/* ⚠️ Error Alert */}
      {showError && errorMessage && (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTitle>Hiba történt</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color">Szín</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e: any) => setColor(e.target.value)}
              className="w-16 h-10 p-1 cursor-pointer"
            />
          </div>

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
              <div
                className="w-full h-[100px] rounded-md"
                style={{ backgroundColor: color }}
              ></div>
              <CardTitle className="font-bold text-xl">
                {title || "Névtelen kártya"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around gap-4">
              <CardDescription className="text-md text-black flex gap-2 items-center">
                <SwordIcon strokeWidth={1.5} size={18} />
                Sebzés: {damage}
              </CardDescription>
              <CardDescription className="text-md text-black flex gap-2 items-center">
                <HeartIcon strokeWidth={1.5} size={18} />
                Életerő: {health}
              </CardDescription>
            </CardContent>
            <CardContent className="pb-8">
              <div
                className={`w-full h-[50px] rounded-md flex items-center justify-center text-black font-semibold border transition-all duration-200
                  ${type === "" ? "text-black border border-gray-200 bg-transparent" : ""}
                  ${type === "water" ? "bg-blue-600 text-white" : ""}
                  ${type === "fire" ? "bg-red-500 text-white" : ""}
                  ${type === "air" ? "bg-white" : ""}
                  ${type === "earth" ? "bg-green-600 text-white" : ""}
                `}
              >
                {type === ""
                  ? "Nincs típus"
                  : type === "water"
                  ? "Víz típus"
                  : type === "fire"
                  ? "Tűz típus"
                  : type === "air"
                  ? "Levegő típus"
                  : "Föld típus"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          disabled={loading}
          onClick={() => handleSubmit("cardlist")}
        >
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
