"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResumeBuilderPage() {
  const router = useRouter();
  const params = useParams();

  const resumeId = params.resumeId as string;

  useEffect(() => {
    if (resumeId) {
      router.replace(
        `/resume/${resumeId}/personal-info`
      );
    }
  }, [resumeId, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

        <p className="mt-4 text-sm text-slate-500">
          Opening resume builder...
        </p>
      </div>
    </main>
  );
}