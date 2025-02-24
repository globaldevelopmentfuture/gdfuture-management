import { ProjectType } from "./ProjectType";

export interface ProjectRequest {
    name: string;
    description: string;
    client: string;
    price: number;
    link: string;
    deadline: string;
    teamSize: number;
    type: ProjectType;
    technologies: string[];
  }