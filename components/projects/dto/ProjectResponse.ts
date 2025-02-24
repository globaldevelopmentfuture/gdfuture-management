import { ProjectType } from "./ProjectType";

export interface ProjectResponse {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    client: string;
    price: number;
    link: string;
    deadline: Date; 
    teamSize: number;
    type: ProjectType;
    technologies: string[];
  }