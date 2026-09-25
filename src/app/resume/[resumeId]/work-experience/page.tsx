"use client";

import {
  getResumeById,
  updateResume,
} from "@/apis/resume.api";

import {
  generateExperienceDescription,
} from "@/apis/ai.api";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  useFieldArray,
  useForm,
} from "react-hook-form";

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface WorkExperienceForm {
  workExperience: WorkExperience[];
}

const WorkExperiencePage = () => {
  const params = useParams();
  const router = useRouter();

  const resumeId = params.resumeId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // AI generation state
  const [generatingExperience, setGeneratingExperience] =
    useState<number | null>(null);

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
  } = useForm<WorkExperienceForm>({
    defaultValues: {
      workExperience: [],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "workExperience",
  });

  // Get existing resume
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getResumeById(resumeId);

        const resume =
          response?.data ?? response;

        reset({
          workExperience:
            resume?.workExperience || [],
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

  // Generate work experience description using AI
  const handleGenerateExperienceDescription =
    async (experienceIndex: number) => {
      try {
        setGeneratingExperience(
          experienceIndex
        );

        setError("");

        const response =
          await generateExperienceDescription(
            resumeId,
            experienceIndex
          );

        const generatedDescription =
          response?.data?.description ??
          response?.description ??
          "";

        if (!generatedDescription) {
          throw new Error(
            "AI did not return an experience description"
          );
        }

        // Put generated description directly
        // inside the textarea
        setValue(
          `workExperience.${experienceIndex}.description`,
          generatedDescription,
          {
            shouldDirty: true,
          }
        );
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data?.message ||
            "Failed to generate experience description"
        );
      } finally {
        setGeneratingExperience(null);
      }
    };

  // Submit
  const onSubmit = async (
    data: WorkExperienceForm
  ) => {
    try {
      setSaving(true);
      setError("");

      const workExperience =
        data.workExperience.map(
          (experience) => ({
            company:
              experience.company.trim(),

            position:
              experience.position.trim(),

            startDate:
              experience.startDate.trim(),

            endDate:
              experience.endDate.trim(),

            description:
              experience.description.trim(),
          })
        );

      await updateResume(resumeId, {
        workExperience,
      });

      router.push(
        `/resume/${resumeId}/certifications`
      );
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to save work experience"
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

          <div className="mb-8 h-8 w-56 rounded bg-gray-200" />

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-6 h-6 w-48 rounded bg-gray-200" />

            <div className="space-y-5">

              <div className="h-11 rounded bg-gray-200" />

              <div className="h-11 rounded bg-gray-200" />

              <div className="h-11 rounded bg-gray-200" />

              <div className="h-11 rounded bg-gray-200" />

              <div className="h-28 rounded bg-gray-200" />

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
            Work Experience
          </h1>

          <p className="mt-2 text-gray-600">
            Add your previous jobs, internships, or
            other professional experience.
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

            const isActive =
              stepNumber === 5;

            const isCompleted =
              stepNumber < 5;

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

            {/* Experience Entries */}
            {fields.map(
              (field, index) => (

                <div
                  key={field.id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >

                  {/* Card Header */}
                  <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-gray-900">
                      Experience #{index + 1}
                    </h2>

                    <button
                      type="button"
                      onClick={() =>
                        remove(index)
                      }
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>

                  </div>

                  <div className="space-y-5">

                    {/* Company */}
                    <div>

                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Company
                      </label>

                      <input
                        {...register(
                          `workExperience.${index}.company`
                        )}
                        type="text"
                        placeholder="e.g. ABC Technologies"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      />

                    </div>

                    {/* Position */}
                    <div>

                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Position
                      </label>

                      <input
                        {...register(
                          `workExperience.${index}.position`
                        )}
                        type="text"
                        placeholder="e.g. MERN Stack Intern"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      />

                    </div>

                    {/* Dates */}
                    <div className="grid gap-5 md:grid-cols-2">

                      <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Start Date
                        </label>

                        <input
                          {...register(
                            `workExperience.${index}.startDate`
                          )}
                          type="text"
                          placeholder="e.g. Jan 2026"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          End Date
                        </label>

                        <input
                          {...register(
                            `workExperience.${index}.endDate`
                          )}
                          type="text"
                          placeholder="e.g. Apr 2026 or Present"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                        />

                      </div>

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
                          onClick={() =>
                            handleGenerateExperienceDescription(
                              index
                            )
                          }
                          disabled={
                            generatingExperience ===
                            index
                          }
                          className="rounded-lg border border-purple-300 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {generatingExperience ===
                          index
                            ? "Generating..."
                            : "✨ Generate with AI"}
                        </button>

                      </div>

                      <textarea
                        {...register(
                          `workExperience.${index}.description`
                        )}
                        rows={6}
                        placeholder="Describe your responsibilities, achievements, technologies used, and impact..."
                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                      />

                    </div>

                  </div>
                </div>
              )
            )}

            {/* Add Experience */}
            <button
              type="button"
              onClick={() =>
                append({
                  company: "",
                  position: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
              className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-white py-4 font-medium text-gray-700 transition hover:border-black hover:text-black"
            >
              + Add Work Experience
            </button>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/resume/${resumeId}/projects`
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

export default WorkExperiencePage;