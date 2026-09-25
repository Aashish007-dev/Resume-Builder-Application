"use client";

import {
  getResumeById,
  updateResume,
} from "@/apis/resume.api";

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

interface CertificationsForm {
  certifications: {
    name: string;
  }[];
}

const CertificationsPage = () => {
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
  } = useForm<CertificationsForm>({
    defaultValues: {
      certifications: [],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "certifications",
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
          certifications:
            resume?.certifications?.map(
              (certification: string) => ({
                name: certification,
              })
            ) || [],
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

  // Submit certifications
  const onSubmit = async (
    data: CertificationsForm
  ) => {
    try {
      setSaving(true);
      setError("");

      // Convert form objects into string array
      const certifications =
        data.certifications
          .map((certification) =>
            certification.name.trim()
          )
          .filter(
            (certification) =>
              certification.length > 0
          );

      await updateResume(resumeId, {
        certifications,
      });

      router.push(
        `/resume/${resumeId}/summary`
      );
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to save certifications"
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

          {/* Page title */}
          <div className="mb-8 h-8 w-56 rounded bg-gray-200" />

          <div className="rounded-xl bg-white p-6 shadow-sm">

            {/* Section title */}
            <div className="mb-6 h-6 w-48 rounded bg-gray-200" />

            <div className="space-y-4">
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
            Certifications
          </h1>

          <p className="mt-2 text-gray-600">
            Add certifications and professional
            credentials that strengthen your resume.
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
              stepNumber === 6;

            const isCompleted =
              stepNumber < 6;

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
            <div className="mb-6">

              <h2 className="text-xl font-semibold text-gray-900">
                Professional Certifications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add certifications that are relevant
                to your career.
              </p>

            </div>

            {/* Certifications */}
            <div className="space-y-4">

              {fields.map(
                (field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3"
                  >

                    <input
                      {...register(
                        `certifications.${index}.name`
                      )}
                      type="text"
                      placeholder="e.g. MongoDB Developer Certification"
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        remove(index)
                      }
                      className="rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>

                  </div>
                )
              )}

            </div>

            {/* Add Certification */}
            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                })
              }
              className="mt-6 w-full rounded-lg border-2 border-dashed border-gray-300 py-3 font-medium text-gray-700 transition hover:border-black hover:text-black"
            >
              + Add Certification
            </button>

          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">

            {/* Back */}
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/resume/${resumeId}/work-experience`
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              ← Back
            </button>

            {/* Continue */}
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

        </form>

      </div>
    </div>
  );
};

export default CertificationsPage;