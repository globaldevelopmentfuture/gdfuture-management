import ApiServer from "@/components/system/service/ApiServer";
import LoginRequest from "../dto/LoginRequest";
import LoginResponse from "../dto/LoginResponse";


class UserService extends ApiServer {
  login = async (user: LoginRequest): Promise<LoginResponse|string> => {
    const data = await this.api<LoginRequest, LoginResponse>(
      `/user/login`,
      "POST",
      user
    );
    if (data.status === 200) {
      const user = await data.json();
      return user;
    } else if (data.status === 404) {
      const message = await data.text();
      return message;
    }
     else {
      return Promise.reject([]);
    }
  };



}

export default UserService;