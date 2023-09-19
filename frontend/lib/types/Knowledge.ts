import { UUID } from "crypto";

export interface Knowledge {
  id: UUID;
  type: string;
  name: string;
  date: string;
}
