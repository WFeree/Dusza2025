import { Button } from "@/components/ui/button"
import { Crown, Joystick } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect } from "react"

export function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.add("no-scroll")
    return () => document.body.classList.remove("no-scroll")
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 gap-8">
      <h1 className="text-3xl font-bold text-center">Üdvözöllek a Damareen játékban!</h1>
      <h3 className="text-lg text-muted-foreground text-center">Válassz szerepkört!</h3>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-full px-8 py-3 text-lg font-semibold text-white rounded-lg overflow-hidden group bg-linear-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 transition-all duration-500 cursor-pointer">
              <span className="absolute inset-0 w-full h-full bg-linear-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></span>
              <span className="relative z-10 flex justify-center items-center gap-2">
                <Crown /> Játékmester
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[215px] bg-background/90 backdrop-blur-sm border border-border">
            <DropdownMenuItem onClick={() => navigate("/dungeon")} className="cursor-pointer">Kazamata létrehozása</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/card")} className="cursor-pointer">Kártya létrehozása</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/cardlist")} className="cursor-pointer">Kártyák megtekintése</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button onClick={() => navigate("/player")} className="relative w-full px-8 py-3 text-lg font-semibold text-white rounded-lg overflow-hidden group bg-linear-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 transition-all duration-500 cursor-pointer">
          <span className="absolute inset-0 w-full h-full bg-linear-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></span>
          <span className="relative z-10 flex justify-center items-center gap-2">
            <Joystick /> Játékos
          </span>
        </button>

        <Button onClick={() => navigate("/logout")} variant="destructive" className="w-full sm:w-40 sm:absolute sm:top-6 sm:right-6 text-lg py-3 bg-red-700 hover:bg-red-600">
          Kilépés
        </Button>
      </div>
    </div>
  )
}
