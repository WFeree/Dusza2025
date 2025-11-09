import { useEffect, useState } from "react";
import api from "@/api";
import { Card, CardTitle, CardDescription } from "./ui/card";
import { SwordIcon, HeartIcon, SearchIcon, PlusIcon, ChevronLeft, TrashIcon, ChevronRight } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label"
import { useNavigate } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import Navbar from "./Navbar";
import CardFilter from "./CardFilter";

type CardType = {
  id: number;
  name: string;
  damage: number;
  health: number;
  affinity: 1 | 2 | 3 | 4;
  color: string;
};

const GMCardList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CardType[]>([]);
  const [filteredData, setFilteredData] = useState<CardType[]>([]);
  const [sortType, setSortType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [affinityFilter, setAffinityFilter] = useState<string>("all");
  const [filteredCards, setFilteredCards] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/game/cards/")
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    let result = [...data];

    if (searchTerm.trim() !== "") {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((card) =>
        card.name.toLowerCase().includes(lowerTerm)
      );
    }

    if (affinityFilter !== "all") {
      const affinityNum = parseInt(affinityFilter);
      result = result.filter((card) => card.affinity === affinityNum);
    }
    result = sortCards(result, sortType);

    setFilteredData(result);
  }, [searchTerm, affinityFilter, sortType, data]);


  const sortCards = (arr: CardType[], type: string) => {
    const sorted = [...arr];
    switch (type) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "damage-asc":
        sorted.sort((a, b) => a.damage - b.damage);
        break;
      case "damage-desc":
        sorted.sort((a, b) => b.damage - a.damage);
        break;
      case "health-asc":
        sorted.sort((a, b) => a.health - b.health);
        break;
      case "health-desc":
        sorted.sort((a, b) => b.health - a.health);
        break;
      case "affinity":
        sorted.sort((a, b) => a.affinity - b.affinity);
        break;
      default:
        return arr;
    }
    return sorted;
  };

  const handleSortClick = (type: string) => {
    setSortType((prev) => (prev === type ? "" : type));
  };

  const deleteCard = (cardId: number) => {
    api
      .delete(`game/cards/delete/${cardId}`)

      navigate(0);
    }

  return (
    <>
      <Navbar />
      <CardFilter data={data} onFilter={setFilteredCards} />
      

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 p-4">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <Card key={card.id} className="CreatedCard p-2 w-full max-h-fit min-w-[245px]">
              {/* <div
                id="color"
                className="w-full h-[30px] rounded-md"
                style={{ backgroundColor: card.color }}
              ></div> */}

              <CardTitle className="font-bold text-xl">{card.name}</CardTitle>
              <CardDescription className="text-md text-black flex gap-2 items-center">
                <SwordIcon strokeWidth={1.5} size={18} /> Sebzés: {card.damage}
              </CardDescription>
              <CardDescription className="text-md text-black flex gap-2 items-center">
                <HeartIcon strokeWidth={1.5} size={18} /> Életerő: {card.health}
              </CardDescription>

              <div
                className={`w-full h-[30px] rounded-md flex items-center justify-center text-black font-semibold border transition-all duration-200
                ${card.affinity === 1 ? "bg-red-500 text-white" : ""}
                ${card.affinity === 2 ? "bg-green-600 text-white" : ""}
                ${card.affinity === 3 ? "bg-blue-600 text-white" : ""}
                ${card.affinity === 4 ? "bg-white" : ""}
              `}
              >
                {card.affinity === 3
                  ? "Víz típus"
                  : card.affinity === 1
                  ? "Tűz típus"
                  : card.affinity === 4
                  ? "Levegő típus"
                  : "Föld típus"}
              </div>
              <div className="flex items-center justify-between">

                <Dialog>
                  <form onSubmit={()=>{}}>
                    <DialogTrigger asChild>
                      <Button variant={"secondary"} className="wrap-break-word">Vezér létrehozása</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Vezér létrehozása</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="name">Név</Label>
                          <Input id="name" defaultValue={card.name} />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="username-1">Melyik képessége fejlődjön?</Label>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hp">Életerő <ChevronRight/> {card.health * 2}</SelectItem>
                              <SelectItem value="damage">Sebzés <ChevronRight/> {card.damage * 2}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Mégse</Button>
                        </DialogClose>
                        <Button type="submit">Vezér létrehozása</Button>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive_outline"}><TrashIcon/>Törlés</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Biztosan törölni akarja?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ez a művelet később nem visszavonható, véglegesen törölni fogja <strong>"{card.name}"</strong> kártyát.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Mégse</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteCard(card.id)}>Törlés</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>     
              </div>
            </Card>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500 mt-4">
            Nincs találat.
          </p>
        )}
      </div>
    </>
  );
};

export default GMCardList;
// TODO: Vezér + Delete functionality