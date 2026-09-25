import axios from "axios";

export interface CreateResumeData {
  title: string;
}

export interface Resume {
  _id: string;
  title?: string;
  jobTitle?: string;
  experienceLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const createResume = async (data: CreateResumeData) => {
  const response = await axios.post(
    "/api/resume/create",
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getResumes = async () => {
  const response = await axios.get(
    "/api/resume",
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getResumeById = async (resumeId: string) => {
  const response = await axios.get(
    `/api/resume/${resumeId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const updateResume = async (
  resumeId: string,
  data: Record<string, any>
) => {
  const response = await axios.patch(
    `/api/resume/${resumeId}`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const deleteResume = async (resumeId: string) => {
  const response = await axios.delete(
    `/api/resume/${resumeId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};