import ApiServer from "@/components/system/service/ApiServer";
import LoginRequest from "../dto/LoginRequest";
import LoginResponse from "../dto/LoginResponse";
import { ApiError } from "next/dist/server/api-utils";

class UserService extends ApiServer {
  login = async (user: LoginRequest): Promise<LoginResponse> => {
    const response = await this.api<LoginRequest, LoginResponse>(
      `/user/login`,
      "POST",
      user
    );

    if (response.ok) {
      return await response.json();
    } else {
      const error: ApiError = await response.json();
      return Promise.reject(error);
    }
  };
}

export default UserService;
