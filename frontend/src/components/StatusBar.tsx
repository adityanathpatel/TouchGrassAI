import { useEffect, useState } from "react";
import { isOnline, watchOnline } from "../lib/geo";

export function StatusBar() {
  const [online, setOnline] = useState(isOnline());
  useEffect(() => watchOnline(setOnline), []);
  return <span className={`pill ${online ? "online" : "offline"}`}>{online ? "Online" : "Offline"}</span>;
}
