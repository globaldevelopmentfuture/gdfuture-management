import { UserRole } from "./UserRole"
import { TeamPosition } from "./TeamPosition"

export default interface CreateUserRequest {
  fullName: string
  phone: string
  email: string
  password?: string
  userRole: UserRole
  location?: string
  experience?: string
  teamPosition?: TeamPosition
  skills?: string[]
}
