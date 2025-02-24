import ApiServer from "@/components/system/service/ApiServer";
import { ApiError } from "next/dist/server/api-utils";
import { ProjectRequest } from "../dto/ProjectRequest";
import { ProjectResponse } from "../dto/ProjectResponse";

class ProjectService extends ApiServer {
  createProject = async (
    project: ProjectRequest,
    imageFile?: File
  ): Promise<ProjectResponse> => {
    const formData = new FormData();
    
    formData.append(
      "project",
      new Blob([JSON.stringify(project)], { type: "application/json" })
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await this.api<FormData, ProjectResponse>(
      `/projects/create`,
      "POST",
      formData
    );

    if (response.ok) {
      return await response.json();
    } else {
      const error: ApiError = await response.json();
      return Promise.reject(error);
    }
  };

  updateProject = async (
    projectId: number,
    project: ProjectRequest,
    imageFile?: File
  ): Promise<ProjectResponse> => {
    const formData = new FormData();

    formData.append(
      "project",
      new Blob([JSON.stringify(project)], { type: "application/json" })
    );
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await this.api<FormData, ProjectResponse>(
      `/projects/${projectId}`,
      "PUT",
      formData
    );

    if (response.ok) {
      return await response.json();
    } else {
      const error: ApiError = await response.json();
      return Promise.reject(error);
    }
  };

  deleteProject = async (projectId: number): Promise<void> => {
    const response = await this.api<null, null>(
      `/projects/${projectId}`,
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

  getProject = async (projectId: number): Promise<ProjectResponse> => {
    const response = await this.api<null, ProjectResponse>(
      `/projects/${projectId}`,
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

  getAllProjects = async (): Promise<ProjectResponse[]> => {
    const response = await this.api<null, ProjectResponse[]>(
      `/projects`,
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

export default ProjectService;
