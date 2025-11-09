import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Home, Layers, Sword, Plus, LogOut, Menu } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-background/60 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
      <nav className="flex justify-between items-center px-4 sm:px-6 py-3">
        {/* Bal oldal — logó / cím */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-lg font-semibold hidden sm:flex"
            onClick={() => navigate("/")}
          >
            Damareen
          </Button>
        </div>

        {/* Nagy kijelző – menü gombok */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Home className="mr-1 h-4 w-4" /> Főmenü
          </Button>
          <Button variant="ghost" onClick={() => navigate("/cardlist")}>
            <Sword className="mr-1 h-4 w-4" /> Kártyák
          </Button>
          <Button variant="ghost" onClick={() => navigate("/card")}>
            <Plus className="mr-1 h-4 w-4" /> Új kártya
          </Button>
          <Button variant="ghost" onClick={() => navigate("/gameenvironment")}>
            <Layers className="mr-1 h-4 w-4" /> Játékkörnyezet
          </Button>
        </div>

        {/* Jobb oldal – logout és mobil menü */}
        <div className="flex items-center gap-2">
          {/* Mobil menü gomb */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Kijelentkezés (mindig látszik) */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => navigate("/logout")}
          >
            <LogOut className="mr-1 h-4 w-4" /> Kilépés
          </Button>
        </div>
      </nav>

      {/* Mobil menü (lenyíló) */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border flex flex-col px-4 py-3 space-y-2 animate-in slide-in-from-top">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Home className="mr-1 h-4 w-4" /> Főmenü
          </Button>
          <Button variant="ghost" onClick={() => navigate("/cardlist")}>
            <Sword className="mr-1 h-4 w-4" /> Kártyák
          </Button>
          <Button variant="ghost" onClick={() => navigate("/card")}>
            <Plus className="mr-1 h-4 w-4" /> Új kártya
          </Button>
          <Button variant="ghost" onClick={() => navigate("/gameenvironment")}>
            <Layers className="mr-1 h-4 w-4" /> Játékkörnyezet
          </Button>
        </div>
      )}

      <Separator />
    </header>
  )
}
