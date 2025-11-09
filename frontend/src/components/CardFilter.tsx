import { SearchIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CardType = {
  id: number
  name: string
  damage: number
  health: number
  affinity: 1 | 2 | 3 | 4
  color?: string
}

type CardFilterProps = {
  data: CardType[]
  onFilter: (filtered: CardType[]) => void
}

const CardFilter = ({ data, onFilter }: CardFilterProps) => {
  const [filteredData, setFilteredData] = useState<CardType[]>([])
  const [sortType, setSortType] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [affinityFilter, setAffinityFilter] = useState<string>("all")

  useEffect(() => {
    let result = [...data]

    if (searchTerm.trim() !== "") {
      const lowerTerm = searchTerm.toLowerCase()
      result = result.filter((card) =>
        card.name.toLowerCase().includes(lowerTerm)
      )
    }

    if (affinityFilter !== "all") {
      const affinityNum = parseInt(affinityFilter)
      result = result.filter((card) => card.affinity === affinityNum)
    }

    result = sortCards(result, sortType)
    setFilteredData(result)
    onFilter(result)
  }, [searchTerm, affinityFilter, sortType, data])

  const sortCards = (arr: CardType[], type: string) => {
    const sorted = [...arr]
    switch (type) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "damage-asc":
        sorted.sort((a, b) => a.damage - b.damage)
        break
      case "damage-desc":
        sorted.sort((a, b) => b.damage - a.damage)
        break
      case "health-asc":
        sorted.sort((a, b) => a.health - b.health)
        break
      case "health-desc":
        sorted.sort((a, b) => b.health - a.health)
        break
      case "affinity":
        sorted.sort((a, b) => a.affinity - b.affinity)
        break
      default:
        return arr
    }
    return sorted
  }

  const handleSortClick = (type: string) => {
    setSortType((prev) => (prev === type ? "" : type))
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mt-4 mb-4 px-4">
      <div className="relative w-full max-w-sm">
        <SearchIcon
          className="absolute left-2 top-2.5 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Kártyák keresése név alapján"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select
        value={affinityFilter}
        onValueChange={(value: string) => setAffinityFilter(value)}
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
  )
}

export default CardFilter
