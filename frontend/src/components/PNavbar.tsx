import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Layers, Sword, Plus, LogOut, Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PNavbarProps {
  gameStarted?: boolean;
  setGameStarted?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PNavbar({ gameStarted, setGameStarted }: PNavbarProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  gameStarted
  return (
    <header className="bg-background/60 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
      <nav className="flex justify-between items-center px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-lg font-semibold hidden sm:flex"
            onClick={() => navigate("/")}
          >
            Damareen
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Home className="mr-1 h-4 w-4" /> Főmenü
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              if (setGameStarted) setGameStarted(false);
              else navigate("/player");
            }}
          >
            <Sword className="mr-1 h-4 w-4" /> Játék kiválasztása
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => navigate("/logout")}
          >
            <LogOut className="mr-1 h-4 w-4" /> Kilépés
          </Button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border flex flex-col px-4 py-3 space-y-2 animate-in slide-in-from-top">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Home className="mr-1 h-4 w-4" /> Főmenü
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (setGameStarted) setGameStarted(false);
              else navigate("/player");
            }}
          >
            <Sword className="mr-1 h-4 w-4" /> Játék kiválasztása
          </Button>
          <Button variant="ghost" onClick={() => navigate("/cardlist")}>
            <Plus className="mr-1 h-4 w-4" /> Kártyák
          </Button>
          <Button variant="ghost" onClick={() => navigate("/gameenvironment")}>
            <Layers className="mr-1 h-4 w-4" /> Játékkörnyezet
          </Button>
        </div>
      )}

      <Separator />
    </header>
  );
}
