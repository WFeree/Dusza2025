import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4 overflow-hidden">
      <h1 className="text-8xl font-extrabold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent select-none">
        404
      </h1>

      <h2 className="text-2xl font-semibold mt-4">Az oldal nem található</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        Úgy tűnik, hogy a keresett oldal nem létezik, vagy már eltávolították.  
        Ellenőrizd az URL-t, vagy térj vissza a főoldalra.
      </p>

      <Button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 text-lg font-medium hover:scale-105 transition-transform"
      >
        Vissza a bejelentkezéshez
      </Button>

      <div className="absolute inset-0 -z-10 opacity-40 blur-3xl bg-linear-to-r from-indigo-500/20 to-purple-600/20" />
    </div>
  )
}
