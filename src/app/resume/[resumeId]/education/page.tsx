"use client";

import { getResumeById, updateResume } from "@/apis/resume.api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface Education {
  institute: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface EducationForm {
  education: Education[];
}

const EducationPage = () => {
  const params = useParams();
  const router = useRouter();

  const resumeId = params.resumeId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    control,
    reset,
    handleSubmit,
  } = useForm<EducationForm>({
    defaultValues: {
      education: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  // Get existing resume data
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getResumeById(resumeId);

        const resume = response?.data ?? response;

        reset({
          education: resume?.education || [],
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

  // Submit education
  const onSubmit = async (data: EducationForm) => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        education: data.education,
      };

      await updateResume(resumeId, payload);

      router.push(`/resume/${resumeId}/skills`);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to save education"
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="mb-8 h-8 w-48 rounded bg-gray-200" />

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 h-6 w-40 rounded bg-gray-200" />

            <div className="space-y-5">
              <div className="h-11 rounded bg-gray-200" />
              <div className="h-11 rounded bg-gray-200" />
              <div className="h-11 rounded bg-gray-200" />
              <div className="h-11 rounded bg-gray-200" />
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
            Education
          </h1>

          <p className="mt-2 text-gray-600">
            Add your educational background.
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
            const isActive = stepNumber === 2;
            const isCompleted = stepNumber < 2;

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

            {/* Education Entries */}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Education #{index + 1}
                  </h2>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* Institute */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Institute / University
                    </label>

                    <input
                      {...register(
                        `education.${index}.institute`
                      )}
                      type="text"
                      placeholder="e.g. SAL Engineering and Technical Institute"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  {/* Degree */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Degree
                    </label>

                    <input
                      {...register(
                        `education.${index}.degree`
                      )}
                      type="text"
                      placeholder="e.g. BE Computer Engineering"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Start Date
                    </label>

                    <input
                      {...register(
                        `education.${index}.startDate`
                      )}
                      type="text"
                      placeholder="e.g. 2021"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      End Date
                    </label>

                    <input
                      {...register(
                        `education.${index}.endDate`
                      )}
                      type="text"
                      placeholder="e.g. 2026 or Present"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Education */}
            <button
              type="button"
              onClick={() =>
                append({
                  institute: "",
                  degree: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-white py-4 font-medium text-gray-700 transition hover:border-black hover:text-black"
            >
              + Add Education
            </button>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/resume/${resumeId}/personal-info`
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

export default EducationPage;