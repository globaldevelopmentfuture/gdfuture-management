import { OfferType } from "./OfferType";

export interface OfferRequest {
    name: string;
    description?: string;
    type : OfferType;
    startingPrice: number;
    icon: string;
    features?: string[];
  }
  