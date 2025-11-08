import { useEffect, useState } from "react";
import api from "@/api";

const GMCardList = () => {
  const [data, setData] = useState([]);

  useEffect(()=>{
    api.get("/game/cards/")
    .then((res) => res.data)
    .then((data) => {
      setData(data);
      console.log(data);
  })
    .catch((error) => console.log(error))
  }, [])
  return (
    <div>GMCardList</div>
  )
}

export default GMCardList