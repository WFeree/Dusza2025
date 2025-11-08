import { useEffect, useState } from "react";
import api from "@/api";
import { Card, CardTitle, CardDescription } from "./ui/card";
import { SwordIcon, HeartIcon, SearchIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

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

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

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

  return (
    <>
      <div className="mt-2 mx-4 flex flex-col">
        <nav className="flex justify-between">
          <Button onClick={() => navigate("/")}>Vissza a menübe</Button>
          <h1 className="text-2xl font-semibold text-center mb-2">Kártyák</h1>
          <Button variant={"outline"} onClick={() => navigate("/card")}>Kártya létrehozása</Button>

        </nav>
        <Separator />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 mt-4 mb-4 px-4">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2 top-2.5 text-gray-400" size={18} />
          <Input
            placeholder="Keresés név alapján..."
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select
          value={affinityFilter}
          onValueChange={(value) => setAffinityFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Típus szűrés" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Összes típus</SelectItem>
            <SelectItem value="1">Tűz típus</SelectItem>
            <SelectItem value="2">Föld típus</SelectItem>
            <SelectItem value="3">Víz típus</SelectItem>
            <SelectItem value="4">Levegő típus</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={sortType === "name" ? "default" : "outline"}
            onClick={() => handleSortClick("name")}
          >
            Név szerint
          </Button>
          <Button
            variant={sortType === "damage-asc" ? "default" : "outline"}
            onClick={() => handleSortClick("damage-asc")}
          >
            Sebzés ↑
          </Button>
          <Button
            variant={sortType === "damage-desc" ? "default" : "outline"}
            onClick={() => handleSortClick("damage-desc")}
          >
            Sebzés ↓
          </Button>
          <Button
            variant={sortType === "health-asc" ? "default" : "outline"}
            onClick={() => handleSortClick("health-asc")}
          >
            Életerő ↑
          </Button>
          <Button
            variant={sortType === "health-desc" ? "default" : "outline"}
            onClick={() => handleSortClick("health-desc")}
          >
            Életerő ↓
          </Button>
          <Button
            variant={sortType === "affinity" ? "default" : "outline"}
            onClick={() => handleSortClick("affinity")}
          >
            Típus szerint
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-4 gap-x-4 gap-y-4 p-4">
        {filteredData.length > 0 ? (
          filteredData.map((card) => (
            <Card key={card.id} className="CreatedCard p-2 w-full max-h-fit">
              <div
                id="color"
                className="w-full h-[30px] rounded-md"
                style={{ backgroundColor: card.color }}
              ></div>

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
