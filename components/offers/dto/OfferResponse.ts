import { OfferType } from "./OfferType";

export interface OfferResponse {
    id: number;
    name: string;
    description?: string;
    type: OfferType;
    startingPrice: number;
    icon: string;
    gradient: string;
    features?: string[];
}
