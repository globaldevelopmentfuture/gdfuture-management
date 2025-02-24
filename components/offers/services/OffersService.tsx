import ApiServer from "@/components/system/service/ApiServer";
import { ApiError } from "next/dist/server/api-utils";
import { OfferRequest } from "../dto/OfferRequest";
import { OfferResponse } from "../dto/OfferResponse";

class OffersService extends ApiServer {
  createOffer = async (offer: OfferRequest): Promise<OfferResponse> => {
    const response = await this.api<OfferRequest, OfferResponse>(
      `/offers/create`,
      "POST",
      offer
    );
    if (response.ok) {
      return await response.json();
    } else {
      const error: ApiError = await response.json();
      return Promise.reject(error);
    }
  };

  updateOffer = async (offerId: number, offer: OfferRequest): Promise<OfferResponse> => {
    const response = await this.api<OfferRequest, OfferResponse>(
      `/offers/${offerId}`,
      "PUT",
      offer
    );
    if (response.ok) {
      return await response.json();
    } else {
      const error: ApiError = await response.json();
      return Promise.reject(error);
    }
  };

  deleteOffer = async (offerId: number): Promise<void> => {
    const response = await this.api<null, null>(
      `/offers/${offerId}`,
      "DELETE",
      null
    );
    if (response.ok) {
      return;
    } else {
      const error: ApiError = await response.json();
      return Promise.reject(error);
    }
  };

  getOffer = async (offerId: number): Promise<OfferResponse> => {
    const response = await this.api<null, OfferResponse>(
      `/offers/${offerId}`,
      "GET",
      null
    );
    if (response.ok) {
      return await response.json();
    } else {
      const error: ApiError = await response.json();
      return Promise.reject(error);
    }
  };

  getAllOffers = async (): Promise<OfferResponse[]> => {
    const response = await this.api<null, OfferResponse[]>(
      `/offers`,
      "GET",
      null
    );
    if (response.ok) {
      return await response.json();
    } else {
      const error: ApiError = await response.json();
      return Promise.reject(error);
    }
  };
}

export default OffersService;
