"use client";

import { getResumeById, updateResume } from "@/apis/resume.api";
import { generateSkills } from "@/apis/ai.api";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface SkillsForm {
  skills: {
    name: string;
  }[];
}

const SkillsPage = () => {
  const params = useParams();
  const router = useRouter();

  const resumeId = params.resumeId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    control,
    reset,
    handleSubmit,
  } = useForm<SkillsForm>({
    defaultValues: {
      skills: [],
    },
  });

  const {
    fields,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: "skills",
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
          skills:
            resume?.skills?.map((skill: string) => ({
              name: skill,
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

  // Generate skills with AI
  const handleGenerateSkills = async () => {
    try {
      setGenerating(true);
      setError("");

      const response = await generateSkills(resumeId);

      const generatedSkills =
        response?.data?.skills ??
        response?.skills ??
        [];

      if (
        !Array.isArray(generatedSkills) ||
        generatedSkills.length === 0
      ) {
        throw new Error(
          "AI did not return any skills"
        );
      }

      const formattedSkills = generatedSkills
        .map((skill: string) => ({
          name: skill.trim(),
        }))
        .filter(
          (skill: { name: string }) =>
            skill.name.length > 0
        );

      if (formattedSkills.length === 0) {
        throw new Error(
          "AI returned empty skills"
        );
      }

      replace(formattedSkills);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to generate skills"
      );
    } finally {
      setGenerating(false);
    }
  };

  // Submit skills
  const onSubmit = async (data: SkillsForm) => {
    try {
      setSaving(true);
      setError("");

      // Convert:
      // [{ name: "React" }, { name: "Node.js" }]
      //
      // into:
      // ["React", "Node.js"]

      const skills = data.skills
        .map((skill) => skill.name.trim())
        .filter((skill) => skill.length > 0);

      const payload = {
        skills,
      };

      await updateResume(resumeId, payload);

      router.push(`/resume/${resumeId}/projects`);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to save skills"
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
            Skills
          </h1>

          <p className="mt-2 text-gray-600">
            Add the technical and professional skills
            you want to highlight in your resume.
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

            const isActive = stepNumber === 3;
            const isCompleted = stepNumber < 3;

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
                  Technical Skills
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add skills that are relevant to the job you
                  are applying for.
                </p>
              </div>

              {/* AI Button */}
              <button
                type="button"
                onClick={handleGenerateSkills}
                disabled={generating}
                className="rounded-lg border border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating
                  ? "Generating..."
                  : "✨ Generate Skills"}
              </button>

            </div>

            {/* Skills */}
            <div className="space-y-4">

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3"
                >

                  <div className="flex-1">
                    <input
                      {...register(
                        `skills.${index}.name`
                      )}
                      type="text"
                      placeholder="e.g. React.js"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>

                </div>
              ))}

            </div>

            {/* Add Skill */}
            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                })
              }
              className="mt-6 w-full rounded-lg border-2 border-dashed border-gray-300 py-3 font-medium text-gray-700 transition hover:border-black hover:text-black"
            >
              + Add Skill
            </button>

            {/* AI Info */}
            <div className="mt-5 rounded-lg border border-purple-100 bg-purple-50 p-4">
              <p className="text-sm text-purple-800">
                💡 <strong>Tip:</strong> Add your education,
                projects, and experience first. AI can use
                your resume information to suggest relevant
                skills.
              </p>
            </div>

          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/resume/${resumeId}/education`
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
        </form>
      </div>
    </div>
  );
};

export default SkillsPage;