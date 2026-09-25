"use client";

import {
  getResumeById,
  updateResume,
} from "@/apis/resume.api";

import { generateSummary } from "@/apis/ai.api";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface SummaryForm {
  summary: string;
}

const SummaryPage = () => {
  const params = useParams();
  const router = useRouter();

  const resumeId = params.resumeId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    reset,
    setValue,
    handleSubmit,
    watch,
  } = useForm<SummaryForm>({
    defaultValues: {
      summary: "",
    },
  });

  const summary = watch("summary");

  // Get existing resume
  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getResumeById(resumeId);

        const resume = response?.data ?? response;

        reset({
          summary: resume?.summary || "",
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

  // Generate summary with AI
  const handleGenerateSummary = async () => {
    try {
      setGenerating(true);
      setError("");

      const response = await generateSummary(resumeId);

      const generatedSummary =
        response?.data?.summary ??
        response?.summary ??
        "";

      if (!generatedSummary) {
        throw new Error(
          "AI did not return a summary"
        );
      }

      setValue("summary", generatedSummary, {
        shouldDirty: true,
      });
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to generate summary"
      );
    } finally {
      setGenerating(false);
    }
  };

  // Save summary
  const onSubmit = async (data: SummaryForm) => {
    try {
      setSaving(true);
      setError("");

      await updateResume(resumeId, {
        summary: data.summary.trim(),
      });

      router.push(`/resume/${resumeId}/preview`);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to save summary"
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

            <div className="h-40 rounded bg-gray-200" />
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
            Professional Summary
          </h1>

          <p className="mt-2 text-gray-600">
            Write a short professional summary or
            generate one using AI.
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

            const isActive = stepNumber === 7;
            const isCompleted = stepNumber < 7;

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

          <div className="rounded-xl bg-white p-6 shadow-sm">

            {/* Section Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  About You
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Highlight your experience, skills, and
                  career goals.
                </p>
              </div>

              {/* AI Button */}
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={generating}
                className="rounded-lg border border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating
                  ? "Generating..."
                  : "✨ Generate with AI"}
              </button>

            </div>

            {/* Summary */}
            <textarea
              {...register("summary")}
              rows={10}
              placeholder="Example: Full-stack MERN developer with experience building scalable web applications..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 leading-6 outline-none transition focus:border-black"
            />

            {/* Character Count */}
            <div className="mt-2 flex justify-end">
              <span className="text-xs text-gray-500">
                {summary?.length || 0} characters
              </span>
            </div>

            {/* AI Info */}
            <div className="mt-5 rounded-lg border border-purple-100 bg-purple-50 p-4">
              <p className="text-sm text-purple-800">
                💡 <strong>Tip:</strong> Add your skills,
                projects, education, and experience first.
                AI can then use your resume information to
                generate a more relevant summary.
              </p>
            </div>

          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/resume/${resumeId}/certifications`
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
                : "Save & Preview →"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default SummaryPage;