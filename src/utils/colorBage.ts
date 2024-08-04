import { Status } from "@/types";

export default function colorBadge(color: Status) {
  switch (color) {
    case "entregado":
      return "#3b82f6";
    case "espera":
      return "#ef4444";
    case "generacion":
      return "#eab308";
    case "pagado":
      return "#22c55e";
  }
}
