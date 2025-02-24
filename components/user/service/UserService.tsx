import ApiServer from "@/components/system/service/ApiServer";
import LoginRequest from "../dto/LoginRequest";
import LoginResponse from "../dto/LoginResponse";
import CreateUserRequest from "../dto/CreateUserRequest";
import UpdateUserRequest from "../dto/UpdateUserRequest";
import HttpResponse from "@/components/system/httpResponse/HttpResponse";
import UserResponse from "../dto/UserResponse";

class UserService extends ApiServer {
  async login(user: LoginRequest): Promise<LoginResponse> {
    const response: HttpResponse<LoginResponse> = await this.api<LoginRequest, LoginResponse>(
      "/user/login",
      "POST",
      user
    );

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(await response.text());
    }
  }

  async createUser(user: CreateUserRequest, avatar?: File, token?: string): Promise<UserResponse> {
    const formData = new FormData();
    formData.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));
    if (avatar) {
      formData.append("avatar", avatar);
    }

    const response: HttpResponse<UserResponse> = await this.api<FormData, UserResponse>(
      "/user/create",
      "POST",
      formData,
      token
    );

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(await response.text());
    }
  }

  async updateUser(id: number, user: UpdateUserRequest, avatar?: File, token?: string): Promise<UserResponse> {
    const formData = new FormData();
    formData.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));
    if (avatar) {
      formData.append("avatar", avatar);
    }

    const response: HttpResponse<UserResponse> = await this.api<FormData, UserResponse>(
      `/user/${id}`,
      "PUT",
      formData,
      token
    );

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(await response.text());
    }
  }

  async deleteUser(id: number, token?: string): Promise<UserResponse> {
    const response: HttpResponse<UserResponse> = await this.api<null, UserResponse>(
      `/user/${id}`,
      "DELETE",
      null,
      token
    );

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(await response.text());
    }
  }

  async getUserById(id: number, token?: string): Promise<UserResponse> {
    const response: HttpResponse<UserResponse> = await this.api<null, UserResponse>(
      `/user/${id}`,
      "GET",
      null,
      token
    );

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(await response.text());
    }
  }

  async getAllUsers(token?: string): Promise<UserResponse[]> {
    const response: HttpResponse<UserResponse[]> = await this.api<null, UserResponse[]>(
      "/user/all",
      "GET",
      null,
      token
    );

    if (response.ok) {
      return response.json();
    } else {
      throw new Error(await response.text());
    }
  }
}

export default UserService;
