"use client";

import {
  getResumeById,
  updateResume,
} from "@/apis/resume.api";

import {
  getATSScore,
  improveContent,
} from "@/apis/ai.api";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PersonalInfo {
  fullname?: string;
  email?: string;
  mobile?: string;
  location?: string;
  github?: string;
  linkedIn?: string;
  portfolio?: string;
}

interface Education {
  institute?: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
}

interface WorkExperience {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Project {
  title?: string;
  description?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
}

interface Resume {
  _id: string;
  title?: string;
  summary?: string;
  personalInfo?: PersonalInfo;
  workExperience?: WorkExperience[];
  projects?: Project[];
  skills?: string[];
  certifications?: string[];
  education?: Education[];
}

const PreviewPage = () => {
  const params = useParams();
  const router = useRouter();

  const resumeId = params.resumeId as string;

  const [resume, setResume] = useState<Resume | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [atsScore, setAtsScore] = useState<number | null>(
    null
  );

  const [atsLoading, setAtsLoading] = useState(false);

  const [improvingSummary, setImprovingSummary] =
    useState(false);

  const [savingSummary, setSavingSummary] =
    useState(false);

  const [showImprovedSummary, setShowImprovedSummary] =
    useState(false);

  const [improvedSummary, setImprovedSummary] =
    useState("");

  // --------------------------------------------------
  // Fetch Resume
  // --------------------------------------------------

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getResumeById(resumeId);

        const resumeData = response?.data ?? response;

        setResume(resumeData);
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
  }, [resumeId]);

  // --------------------------------------------------
  // Generate ATS Score
  // --------------------------------------------------

  const handleATSScore = async () => {
    try {
      setAtsLoading(true);
      setError("");

      const response = await getATSScore(resumeId);

      /*
        Backend response can be:

        {
          data: {
            score: 82
          }
        }

        or

        {
          score: 82
        }
      */

      const score =
        response?.data?.score ??
        response?.score ??
        null;

      if (score === null || score === undefined) {
        throw new Error(
          "ATS score was not returned by the server"
        );
      }

      setAtsScore(Number(score));
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to generate ATS score"
      );
    } finally {
      setAtsLoading(false);
    }
  };

  // --------------------------------------------------
  // Improve Summary
  // --------------------------------------------------

  const handleImproveSummary = async () => {
    if (!resume?.summary?.trim()) {
      setError(
        "Please add a summary before improving it with AI."
      );
      return;
    }

    try {
      setImprovingSummary(true);
      setError("");

      const response = await improveContent(
        resumeId,
        resume.summary
      );

      /*
        Backend response can be:

        {
          data: {
            improvedContent: "..."
          }
        }

        or

        {
          improvedContent: "..."
        }

        or

        {
          data: {
            content: "..."
          }
        }
      */

      const generatedContent =
        response?.data?.improvedContent ??
        response?.improvedContent ??
        response?.data?.content ??
        response?.content ??
        "";

      if (!generatedContent) {
        throw new Error(
          "AI did not return improved content"
        );
      }

      setImprovedSummary(generatedContent);
      setShowImprovedSummary(true);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to improve summary"
      );
    } finally {
      setImprovingSummary(false);
    }
  };

  // --------------------------------------------------
  // Save Improved Summary
  // --------------------------------------------------

  const handleSaveImprovedSummary = async () => {
    if (!improvedSummary.trim()) {
      return;
    }

    try {
      setSavingSummary(true);
      setError("");

      await updateResume(resumeId, {
        summary: improvedSummary.trim(),
      });

      setResume((previousResume) => {
        if (!previousResume) {
          return previousResume;
        }

        return {
          ...previousResume,
          summary: improvedSummary.trim(),
        };
      });

      setShowImprovedSummary(false);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to save improved summary"
      );
    } finally {
      setSavingSummary(false);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-5xl animate-pulse">

          <div className="mb-8 h-8 w-48 rounded bg-gray-200" />

          <div className="mx-auto min-h-[1000px] max-w-4xl rounded bg-white p-10 shadow-sm">

            <div className="mb-6 h-10 w-72 rounded bg-gray-200" />

            <div className="mb-10 h-4 w-96 rounded bg-gray-200" />

            <div className="mb-8 h-6 w-40 rounded bg-gray-200" />

            <div className="space-y-3">
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
            </div>

          </div>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error && !resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">

        <div className="rounded-xl bg-white p-8 text-center shadow-sm">

          <h1 className="text-xl font-semibold text-red-600">
            Something went wrong
          </h1>

          <p className="mt-2 text-gray-600">
            {error}
          </p>

          <button
            onClick={() =>
              router.push(
                `/resume/${resumeId}/summary`
              )
            }
            className="mt-6 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Back to Editor
          </button>

        </div>

      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Resume not found.
      </div>
    );
  }

  const personalInfo = resume.personalInfo;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6">

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Resume Preview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review your resume before downloading.
          </p>
        </div>

        <button
          onClick={() =>
            router.push(
              `/resume/${resumeId}/summary`
            )
          }
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Edit Resume
        </button>

      </div>

      {/* ==================================================
          AI TOOLS
      ================================================== */}

      <div className="mx-auto mb-6 max-w-4xl">

        <div className="grid gap-4 md:grid-cols-2">

          {/* ATS SCORE CARD */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <h2 className="font-semibold text-gray-900">
                  ATS Score
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Check how well your resume is optimized
                  for Applicant Tracking Systems.
                </p>
              </div>

              {atsScore !== null && (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-gray-900">
                  <span className="text-lg font-bold text-gray-900">
                    {atsScore}
                  </span>
                </div>
              )}

            </div>

            <button
              onClick={handleATSScore}
              disabled={atsLoading}
              className="mt-4 w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {atsLoading
                ? "Analyzing Resume..."
                : atsScore !== null
                ? "Recheck ATS Score"
                : "✨ Check ATS Score"}
            </button>

          </div>

          {/* IMPROVE SUMMARY CARD */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div>
              <h2 className="font-semibold text-gray-900">
                Improve Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Use AI to make your professional summary
                clearer and more impactful.
              </p>
            </div>

            <button
              onClick={handleImproveSummary}
              disabled={
                improvingSummary ||
                !resume.summary?.trim()
              }
              className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {improvingSummary
                ? "Improving..."
                : "✨ Improve Summary"}
            </button>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

      </div>

      {/* ==================================================
          IMPROVED SUMMARY MODAL
      ================================================== */}

      {showImprovedSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  AI Improved Summary
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review the generated summary before
                  applying it to your resume.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowImprovedSummary(false)
                }
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>

            <textarea
              value={improvedSummary}
              onChange={(event) =>
                setImprovedSummary(
                  event.target.value
                )
              }
              rows={8}
              className="mt-5 w-full resize-none rounded-lg border border-gray-300 p-4 text-sm leading-6 outline-none focus:border-black"
            />

            <div className="mt-5 flex justify-end gap-3">

              <button
                onClick={() =>
                  setShowImprovedSummary(false)
                }
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleSaveImprovedSummary
                }
                disabled={savingSummary}
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingSummary
                  ? "Saving..."
                  : "Use This Summary"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          RESUME PAPER
      ================================================== */}

      <div className="mx-auto max-w-4xl bg-white px-8 py-10 shadow-lg sm:px-12 sm:py-12">

        {/* ================= HEADER ================= */}

        <header className="border-b-2 border-gray-900 pb-5 text-center">

          <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900">
            {personalInfo?.fullname || "Your Name"}
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-600">

            {personalInfo?.email && (
              <span>{personalInfo.email}</span>
            )}

            {personalInfo?.mobile && (
              <>
                <span>•</span>
                <span>{personalInfo.mobile}</span>
              </>
            )}

            {personalInfo?.location && (
              <>
                <span>•</span>
                <span>{personalInfo.location}</span>
              </>
            )}

          </div>

          {/* Links */}

          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">

            {personalInfo?.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 underline"
              >
                GitHub
              </a>
            )}

            {personalInfo?.linkedIn && (
              <a
                href={personalInfo.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 underline"
              >
                LinkedIn
              </a>
            )}

            {personalInfo?.portfolio && (
              <a
                href={personalInfo.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 underline"
              >
                Portfolio
              </a>
            )}

          </div>

        </header>

        {/* ================= SUMMARY ================= */}

        {resume.summary && (
          <section className="mt-7">

            <SectionTitle title="Professional Summary" />

            <p className="text-sm leading-6 text-gray-700">
              {resume.summary}
            </p>

          </section>
        )}

        {/* ================= SKILLS ================= */}

        {resume.skills &&
          resume.skills.length > 0 && (
            <section className="mt-7">

              <SectionTitle title="Skills" />

              <div className="flex flex-wrap gap-2">

                {resume.skills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="text-sm text-gray-700"
                    >
                      {skill}

                      {index !==
                        resume.skills!.length - 1 &&
                        " •"}
                    </span>
                  )
                )}

              </div>

            </section>
          )}

        {/* ================= EXPERIENCE ================= */}

        {resume.workExperience &&
          resume.workExperience.length > 0 && (
            <section className="mt-7">

              <SectionTitle title="Work Experience" />

              <div className="space-y-6">

                {resume.workExperience.map(
                  (experience, index) => (
                    <div key={index}>

                      <div className="flex flex-col justify-between sm:flex-row">

                        <div>

                          <h3 className="font-semibold text-gray-900">
                            {experience.position}
                          </h3>

                          <p className="text-sm font-medium text-gray-700">
                            {experience.company}
                          </p>

                        </div>

                        <p className="mt-1 text-sm text-gray-500 sm:mt-0">

                          {experience.startDate}

                          {experience.startDate &&
                            experience.endDate &&
                            " — "}

                          {experience.endDate}

                        </p>

                      </div>

                      {experience.description && (
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                          {experience.description}
                        </p>
                      )}

                    </div>
                  )
                )}

              </div>

            </section>
          )}

        {/* ================= PROJECTS ================= */}

        {resume.projects &&
          resume.projects.length > 0 && (
            <section className="mt-7">

              <SectionTitle title="Projects" />

              <div className="space-y-6">

                {resume.projects.map(
                  (project, index) => (
                    <div key={index}>

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-gray-900">
                          {project.title}
                        </h3>

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-600 underline"
                          >
                            GitHub
                          </a>
                        )}

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-600 underline"
                          >
                            Live
                          </a>
                        )}

                      </div>

                      {project.description && (
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                          {project.description}
                        </p>
                      )}

                      {project.techStack &&
                        project.techStack.length > 0 && (
                          <p className="mt-2 text-xs text-gray-600">

                            <span className="font-semibold">
                              Tech:
                            </span>{" "}

                            {project.techStack.join(
                              " • "
                            )}

                          </p>
                        )}

                    </div>
                  )
                )}

              </div>

            </section>
          )}

        {/* ================= EDUCATION ================= */}

        {resume.education &&
          resume.education.length > 0 && (
            <section className="mt-7">

              <SectionTitle title="Education" />

              <div className="space-y-5">

                {resume.education.map(
                  (education, index) => (
                    <div
                      key={index}
                      className="flex flex-col justify-between sm:flex-row"
                    >

                      <div>

                        <h3 className="font-semibold text-gray-900">
                          {education.degree}
                        </h3>

                        <p className="text-sm text-gray-700">
                          {education.institute}
                        </p>

                      </div>

                      <p className="mt-1 text-sm text-gray-500 sm:mt-0">

                        {education.startDate}

                        {education.startDate &&
                          education.endDate &&
                          " — "}

                        {education.endDate}

                      </p>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

        {/* ================= CERTIFICATIONS ================= */}

        {resume.certifications &&
          resume.certifications.length > 0 && (
            <section className="mt-7">

              <SectionTitle title="Certifications" />

              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">

                {resume.certifications.map(
                  (certification, index) => (
                    <li
                      key={`${certification}-${index}`}
                    >
                      {certification}
                    </li>
                  )
                )}

              </ul>

            </section>
          )}

      </div>

      {/* ==================================================
          BOTTOM ACTIONS
      ================================================== */}

      <div className="mx-auto mt-6 flex max-w-4xl justify-between">

        <button
          onClick={() =>
            router.push(
              `/resume/${resumeId}/summary`
            )
          }
          className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Continue Editing
        </button>

        <button
          onClick={() =>
            router.push(
              `/resume/${resumeId}/download`
            )
          }
          className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Continue to Download →
        </button>

      </div>

    </div>
  );
};

/* ==================================================
   SECTION TITLE
================================================== */

interface SectionTitleProps {
  title: string;
}

const SectionTitle = ({
  title,
}: SectionTitleProps) => {
  return (
    <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wider text-gray-900">
      {title}
    </h2>
  );
};

export default PreviewPage;