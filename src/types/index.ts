import { UniqueIdentifier } from "@dnd-kit/core";

export type Status = "espera" | "generacion" | "pagado" | "entregado";

export type Task = {
  id: UniqueIdentifier;
  title: string;
  description: string;
  status: Status;
};

export type BoardSectionsType = {
  [name: string]: Task[];
};
