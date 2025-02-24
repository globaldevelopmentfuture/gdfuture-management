import { UserRole } from "./UserRole"
import { TeamPosition } from "./TeamPosition"

export default interface UserResponse {
  id: number
  fullName: string
  phone: string
  email: string
  userRole: UserRole
  location?: string
  experience?: string
  avatar?: string
  teamPosition?: TeamPosition
  skills?: string[]
}
