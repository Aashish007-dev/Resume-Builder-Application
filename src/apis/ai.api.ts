import axios from "axios";

export const generateSummary = async (
  resumeId: string
) => {
  const response = await axios.post(
    "/api/ai/generate-summary",
    { resumeId },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const generateSkills = async (
  resumeId: string
) => {
  const response = await axios.post(
    "/api/ai/generate-skills",
    { resumeId },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const generateExperienceDescription = async (
  resumeId: string,
  experienceIndex: number
) => {
  const response = await axios.post(
    "/api/ai/generate-experience-description",
    {
      resumeId,
      experienceIndex,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const generateProjectDescription = async (
  resumeId: string,
  projectIndex: number
) => {
  const response = await axios.post(
    "/api/ai/generate-project-description",
    {
      resumeId,
      projectIndex,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const improveContent = async (
  resumeId: string,
  content: string
) => {
  const response = await axios.post(
    "/api/ai/improve-content",
    {
      resumeId,
      content,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getATSScore = async (
  resumeId: string
) => {
  const response = await axios.post(
    "/api/ai/ats-score",
    { resumeId },
    {
      withCredentials: true,
    }
  );

  return response.data;
};