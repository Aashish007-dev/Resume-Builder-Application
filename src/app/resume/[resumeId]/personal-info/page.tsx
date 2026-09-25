"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  getResumeById,
  updateResume,
} from "@/apis/resume.api";

interface PersonalInfoForm {
  fullname: string;
  email: string;
  mobile: string;
  location: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  jobTitle: string;
  experienceLevel: string;
}

export default function PersonalInfoPage() {
  const params = useParams();
  const router = useRouter();

  const resumeId = params.resumeId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoForm>({
    defaultValues: {
      fullname: "",
      email: "",
      mobile: "",
      location: "",
      linkedIn: "",
      github: "",
      portfolio: "",
      jobTitle: "",
      experienceLevel: "",
    },
  });

  // =====================================
  // GET RESUME DATA
  // =====================================

  const fetchResume = async () => {
    try {
      setLoading(true);
      setApiError("");

      const response = await getResumeById(resumeId);

      console.log("Resume response:", response);

      const resume = response?.data ?? response;

      console.log("Resume data:", resume);

      reset({
        fullname: resume?.personalInfo?.fullname || "",
        email: resume?.personalInfo?.email || "",
        mobile: resume?.personalInfo?.mobile || "",
        location: resume?.personalInfo?.location || "",
        linkedIn: resume?.personalInfo?.linkedIn || "",
        github: resume?.personalInfo?.github || "",
        portfolio: resume?.personalInfo?.portfolio || "",

        // Career information
        jobTitle: resume?.jobTitle || "",
        experienceLevel: resume?.experienceLevel || "",
      });
    } catch (error: any) {
      console.error("Failed to fetch resume:", error);

      setApiError(
        error?.response?.data?.message ||
          "Failed to load resume."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    }
  }, [resumeId]);

  // =====================================
  // SUBMIT FORM
  // =====================================

  const onSubmit = async (data: PersonalInfoForm) => {
    try {
      setSaving(true);
      setApiError("");

      const payload = {
        personalInfo: {
          fullname: data.fullname,
          email: data.email,
          mobile: data.mobile,
          location: data.location,
          linkedIn: data.linkedIn,
          github: data.github,
          portfolio: data.portfolio,
        },

        // AI Skills ke liye important
        jobTitle: data.jobTitle,
        experienceLevel: data.experienceLevel,
      };

      console.log("Update payload:", payload);

      const response = await updateResume(
        resumeId,
        payload
      );

      console.log("Update response:", response);

      // Next step
      router.push(
        `/resume/${resumeId}/education`
      );
    } catch (error: any) {
      console.error(
        "Failed to update resume:",
        error
      );

      setApiError(
        error?.response?.data?.message ||
          "Failed to save personal information."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="animate-pulse">
            <div className="mb-3 h-8 w-64 rounded bg-slate-200" />

            <div className="mb-10 h-4 w-96 rounded bg-slate-200" />

            <div className="rounded-2xl bg-white p-8">
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-12 rounded-lg bg-slate-200"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="text-2xl font-bold text-slate-900">
            Build Your Resume
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Complete each step to create your
            professional resume.
          </p>
        </div>
      </header>

      {/* ================================= */}
      {/* STEP INDICATOR */}
      {/* ================================= */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex items-center gap-2 overflow-x-auto">

            {/* Step 1 */}
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                1
              </div>

              <span className="text-sm font-semibold text-indigo-600">
                Personal
              </span>
            </div>

            <div className="h-px w-8 bg-slate-300" />

            {/* Step 2 */}
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-400">
                2
              </div>

              <span className="text-sm text-slate-400">
                Education
              </span>
            </div>

            <div className="h-px w-8 bg-slate-300" />

            {/* Step 3 */}
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-400">
                3
              </div>

              <span className="text-sm text-slate-400">
                Skills
              </span>
            </div>

            <div className="h-px w-8 bg-slate-300" />

            {/* Step 4 */}
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-400">
                4
              </div>

              <span className="text-sm text-slate-400">
                Projects
              </span>
            </div>

            <div className="h-px w-8 bg-slate-300" />

            {/* Step 5 */}
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-400">
                5
              </div>

              <span className="text-sm text-slate-400">
                Experience
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* FORM */}
      {/* ================================= */}

      <section className="mx-auto max-w-5xl px-6 py-10">

        {/* API ERROR */}

        {apiError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          {/* TITLE */}

          <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-600">
              Step 1 of 7
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add your basic information so recruiters
              know who you are.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >

            {/* ================================= */}
            {/* BASIC INFORMATION */}
            {/* ================================= */}

            <div>
              <h3 className="mb-5 text-base font-semibold text-slate-900">
                Basic Information
              </h3>

              <div className="grid gap-6 md:grid-cols-2">

                {/* Full Name */}

                <div>
                  <label
                    htmlFor="fullname"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Full Name *
                  </label>

                  <input
                    id="fullname"
                    type="text"
                    placeholder="Aashish Chotaliya"
                    {...register("fullname", {
                      required:
                        "Full name is required",
                    })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  {errors.fullname && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email *
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required:
                        "Email is required",

                      pattern: {
                        value:
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                        message:
                          "Enter a valid email",
                      },
                    })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}

                <div>
                  <label
                    htmlFor="mobile"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Phone
                  </label>

                  <input
                    id="mobile"
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register("mobile")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {/* Location */}

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    type="text"
                    placeholder="Ahmedabad, Gujarat"
                    {...register("location")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </div>

            {/* ================================= */}
            {/* PROFESSIONAL LINKS */}
            {/* ================================= */}

            <div className="border-t border-slate-200 pt-8">

              <h3 className="mb-5 text-base font-semibold text-slate-900">
                Professional Links
              </h3>

              <div className="space-y-5">

                {/* LinkedIn */}

                <div>
                  <label
                    htmlFor="linkedIn"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    LinkedIn
                  </label>

                  <input
                    id="linkedIn"
                    type="url"
                    placeholder="https://linkedin.com/in/yourname"
                    {...register("linkedIn")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {/* GitHub */}

                <div>
                  <label
                    htmlFor="github"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    GitHub
                  </label>

                  <input
                    id="github"
                    type="url"
                    placeholder="https://github.com/username"
                    {...register("github")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {/* Portfolio */}

                <div>
                  <label
                    htmlFor="portfolio"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Portfolio
                  </label>

                  <input
                    id="portfolio"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    {...register("portfolio")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </div>

            {/* ================================= */}
            {/* CAREER INFORMATION */}
            {/* ================================= */}

            <div className="border-t border-slate-200 pt-8">

              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Career Information
              </h3>

              <p className="mb-5 text-sm text-slate-500">
                This information will also be used by AI
                to generate relevant skills for your resume.
              </p>

              <div className="grid gap-6 md:grid-cols-2">

                {/* Job Title */}

                <div>
                  <label
                    htmlFor="jobTitle"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Target Job Title *
                  </label>

                  <input
                    id="jobTitle"
                    type="text"
                    placeholder="MERN Stack Developer"
                    {...register("jobTitle", {
                      required:
                        "Job title is required",

                      minLength: {
                        value: 2,
                        message:
                          "Job title must be at least 2 characters",
                      },
                    })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  {errors.jobTitle && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>

                {/* Experience Level */}

                <div>
                  <label
                    htmlFor="experienceLevel"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Experience Level *
                  </label>

                  <select
                    id="experienceLevel"
                    {...register("experienceLevel", {
                      required:
                        "Experience level is required",
                    })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">
                      Select experience level
                    </option>

                    <option value="fresher">
                      Fresher
                    </option>

                    <option value="entry-level">
                      Entry Level
                    </option>

                    <option value="mid-level">
                      Mid Level
                    </option>

                    <option value="senior">
                      Senior Level
                    </option>
                  </select>

                  {errors.experienceLevel && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.experienceLevel.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ================================= */}
            {/* ACTIONS */}
            {/* ================================= */}

            <div className="flex items-center justify-between border-t border-slate-200 pt-8">

              <button
                type="button"
                onClick={() => router.push("/resume")}
                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Save & Continue →"}
              </button>

            </div>
          </form>
        </div>
      </section>
    </main>
  );
}