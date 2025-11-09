import { Button } from "@/components/ui/button"
import { Crown, Joystick, LogOut } from "lucide-react"
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
    <>
    <div className="p-2">
      <Button onClick={() => navigate("/logout")} variant="destructive" className="float-end"><LogOut className="mr-1"/>Kilépés</Button>
      <div className="w-full flex flex-col items-center justify-center min-h-screen bg-background px-4 gap-8">
        <h1 className="text-3xl font-bold text-center">Üdvözöllek a Damareen játékban!</h1>
        <h3 className="text-lg text-muted-foreground text-center">Válassz szerepkört!</h3>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-1/2">
              <Crown /> Játékmester
          </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[215px] bg-background/90 backdrop-blur-sm border border-border">
              <DropdownMenuItem onClick={() => navigate("/gameenvironment")} className="cursor-pointer">Játékkörnyezet létrehozása</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/card")} className="cursor-pointer">Kártya létrehozása</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/cardlist")} className="cursor-pointer">Kártyák megtekintése</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => navigate("/player")} className="w-1/2"><Joystick /> Játékos</Button>
        </div>
      </div>
    </div>
    </>
  )
}
