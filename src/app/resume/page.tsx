"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getResumes,
  createResume,
} from "@/apis/resume.api";

interface Resume {
  _id: string;
  title?: string;
  jobTitle?: string;
  experienceLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ResumePage() {
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Fetch Resumes
  // =========================
  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getResumes();

      console.log("Resume API Response:", response);

      const data = response?.data ?? response;

      if (Array.isArray(data)) {
        setResumes(data);
      } else {
        setResumes([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch resumes:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load resumes."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Create Resume
  // =========================
  const handleCreateResume = async () => {
    try {
      setCreating(true);
      setError("");

      const response = await createResume({
        title: "My Resume",
      });

      console.log("Create Resume Response:", response);

      const resume = response?.data;

      if (!resume?._id) {
        throw new Error("Resume ID not found");
      }

      // Newly created resume ke personal info page par jao
      router.push(
        `/resume/${resume._id}/personal-info`
      );
    } catch (error: any) {
      console.error("Failed to create resume:", error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create resume."
      );
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-3xl font-bold text-slate-900">
            My Resumes
          </h1>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Resumes
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your resumes from here.
            </p>
          </div>

          <button
            onClick={handleCreateResume}
            disabled={creating}
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Creating..." : "+ Create Resume"}
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No resumes found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You have not created any resume yet.
            </p>

            <button
              onClick={handleCreateResume}
              disabled={creating}
              className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating
                ? "Creating..."
                : "Create Your First Resume"}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {resume.title || "Untitled Resume"}
                </h2>

                {resume.jobTitle && (
                  <p className="mt-2 text-sm text-slate-500">
                    {resume.jobTitle}
                  </p>
                )}

                {resume.experienceLevel && (
                  <p className="mt-1 text-sm text-slate-500">
                    {resume.experienceLevel}
                  </p>
                )}

                {resume.updatedAt && (
                  <p className="mt-4 text-xs text-slate-400">
                    Updated:{" "}
                    {new Date(
                      resume.updatedAt
                    ).toLocaleDateString()}
                  </p>
                )}

                <button
                  onClick={() =>
                    router.push(
                      `/resume/${resume._id}/personal-info`
                    )
                  }
                  className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Continue Editing
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}