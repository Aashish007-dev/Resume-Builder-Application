"use client";

import {
  getResumeById,
  updateResume,
} from "@/apis/resume.api";

import { generateProjectDescription } from "@/apis/ai.api";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface ProjectForm {
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  techStack: {
    name: string;
  }[];
}

interface ProjectsForm {
  projects: ProjectForm[];
}

const ProjectsPage = () => {
  const params = useParams();
  const router = useRouter();

  const resumeId = params.resumeId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // AI generation state
  const [generatingProject, setGeneratingProject] =
    useState<number | null>(null);

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
  } = useForm<ProjectsForm>({
    defaultValues: {
      projects: [],
    },
  });

  // Projects array
  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: "projects",
  });

  // Get existing resume
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getResumeById(resumeId);

        const resume = response?.data ?? response;

        reset({
          projects:
            resume?.projects?.map((project: any) => ({
              title: project.title || "",
              description: project.description || "",
              githubUrl: project.githubUrl || "",
              liveUrl: project.liveUrl || "",

              techStack:
                project.techStack?.map((tech: string) => ({
                  name: tech,
                })) || [],
            })) || [],
        });
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data?.message ||
            "Failed to load resume"
        );
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchResume();
    }
  }, [resumeId, reset]);

  // Generate project description using AI
  const handleGenerateProjectDescription = async (
    projectIndex: number
  ) => {
    try {
      setGeneratingProject(projectIndex);
      setError("");

      const response =
        await generateProjectDescription(
          resumeId,
          projectIndex
        );

      const generatedDescription =
        response?.data?.description ??
        response?.description ??
        "";

      if (!generatedDescription) {
        throw new Error(
          "AI did not return a project description"
        );
      }

      // Put generated description directly
      // inside the textarea
      setValue(
        `projects.${projectIndex}.description`,
        generatedDescription,
        {
          shouldDirty: true,
        }
      );
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to generate project description"
      );
    } finally {
      setGeneratingProject(null);
    }
  };

  // Submit projects
  const onSubmit = async (data: ProjectsForm) => {
    try {
      setSaving(true);
      setError("");

      const projects = data.projects.map((project) => ({
        title: project.title.trim(),

        description: project.description.trim(),

        githubUrl: project.githubUrl.trim(),

        liveUrl: project.liveUrl.trim(),

        techStack: project.techStack
          .map((tech) => tech.name.trim())
          .filter((tech) => tech.length > 0),
      }));

      await updateResume(resumeId, {
        projects,
      });

      router.push(
        `/resume/${resumeId}/work-experience`
      );
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to save projects"
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="mb-8 h-8 w-48 rounded bg-gray-200" />

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 h-6 w-40 rounded bg-gray-200" />

            <div className="space-y-4">
              <div className="h-11 rounded bg-gray-200" />
              <div className="h-11 rounded bg-gray-200" />
              <div className="h-24 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Projects
          </h1>

          <p className="mt-2 text-gray-600">
            Add the projects that demonstrate your
            skills and experience.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-between">
          {[
            "Personal",
            "Education",
            "Skills",
            "Projects",
            "Experience",
            "Certifications",
            "Summary",
          ].map((step, index) => {
            const stepNumber = index + 1;

            const isActive = stepNumber === 4;

            const isCompleted = stepNumber < 4;

            return (
              <div
                key={step}
                className="flex flex-1 items-center"
              >
                <div className="flex flex-col items-center">

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                      isActive
                        ? "bg-black text-white"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepNumber}
                  </div>

                  <span
                    className={`mt-2 hidden text-xs sm:block ${
                      isActive
                        ? "font-semibold text-black"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>

                </div>

                {stepNumber < 7 && (
                  <div className="mx-2 h-px flex-1 bg-gray-300" />
                )}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">

            {/* Project Cards */}
            {projectFields.map(
              (project, projectIndex) => (
                <ProjectCard
                  key={project.id}
                  projectIndex={projectIndex}
                  register={register}
                  control={control}
                  onRemove={() =>
                    removeProject(projectIndex)
                  }
                  onGenerateDescription={() =>
                    handleGenerateProjectDescription(
                      projectIndex
                    )
                  }
                  isGenerating={
                    generatingProject === projectIndex
                  }
                />
              )
            )}

            {/* Add Project */}
            <button
              type="button"
              onClick={() =>
                appendProject({
                  title: "",
                  description: "",
                  githubUrl: "",
                  liveUrl: "",
                  techStack: [],
                })
              }
              className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-white py-4 font-medium text-gray-700 transition hover:border-black hover:text-black"
            >
              + Add Project
            </button>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/resume/${resumeId}/skills`
                  )
                }
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save & Continue →"}
              </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectsPage;


/* --------------------------------------------------
   Project Card
-------------------------------------------------- */

interface ProjectCardProps {
  projectIndex: number;

  register: any;

  control: any;

  onRemove: () => void;

  onGenerateDescription: () => void;

  isGenerating: boolean;
}

const ProjectCard = ({
  projectIndex,
  register,
  control,
  onRemove,
  onGenerateDescription,
  isGenerating,
}: ProjectCardProps) => {

  const {
    fields: techFields,
    append: appendTech,
    remove: removeTech,
  } = useFieldArray({
    control,
    name: `projects.${projectIndex}.techStack`,
  });

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">

      {/* Project Header */}
      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-semibold text-gray-900">
          Project #{projectIndex + 1}
        </h2>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Remove Project
        </button>

      </div>

      <div className="space-y-5">

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Project Title
          </label>

          <input
            {...register(
              `projects.${projectIndex}.title`
            )}
            type="text"
            placeholder="e.g. E-commerce Website"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Description */}
        <div>

          <div className="mb-2 flex items-center justify-between">

            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            {/* AI Generate Button */}
            <button
              type="button"
              onClick={onGenerateDescription}
              disabled={isGenerating}
              className="rounded-lg border border-purple-300 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating
                ? "Generating..."
                : "✨ Generate with AI"}
            </button>

          </div>

          <textarea
            {...register(
              `projects.${projectIndex}.description`
            )}
            rows={5}
            placeholder="Describe what you built, what problem it solves and your contribution..."
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />

        </div>

        {/* URLs */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              GitHub URL
            </label>

            <input
              {...register(
                `projects.${projectIndex}.githubUrl`
              )}
              type="url"
              placeholder="https://github.com/..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Live URL
            </label>

            <input
              {...register(
                `projects.${projectIndex}.liveUrl`
              )}
              type="url"
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

        </div>

        {/* Tech Stack */}
        <div>

          <div className="mb-3 flex items-center justify-between">

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tech Stack
              </label>

              <p className="mt-1 text-xs text-gray-500">
                Add technologies used in this project.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                appendTech({
                  name: "",
                })
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              + Add Technology
            </button>

          </div>

          <div className="space-y-3">

            {techFields.map(
              (tech, techIndex) => (
                <div
                  key={tech.id}
                  className="flex items-center gap-3"
                >

                  <input
                    {...register(
                      `projects.${projectIndex}.techStack.${techIndex}.name`
                    )}
                    type="text"
                    placeholder="e.g. React.js"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeTech(techIndex)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>

                </div>
              )
            )}

          </div>
        </div>

      </div>
    </div>
  );
};