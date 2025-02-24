import { TeamPosition } from "./TeamPosition"

export default interface UpdateUserRequest {
  fullName: string
  phone: string
  email: string
  password?: string
  location?: string
  experience?: string
  teamPosition?: TeamPosition
  skills?: string[]
}
