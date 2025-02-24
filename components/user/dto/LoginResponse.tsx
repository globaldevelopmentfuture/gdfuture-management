import { UserRole } from "./UserRole";

export default interface LoginResponse {
  jwtToken: string;
  id: number;
  fullName: string;
  phone: string;
  email: string;
  userRole: UserRole | null;
  location?: string;
  avatar?: string;
  experience?: string;
  skills?: string[];
}
