"use client";

import { useState } from "react";
import { submitRoleApplication } from "../app/actions/roleApplication";

type RoleType = "ARTIST" | "ORGANIZER";

interface RoleApplicationFormProps {
  role: RoleType;
}

export function RoleApplicationForm({ role }: RoleApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("role", role);

    const result = await submitRoleApplication(formData);

    if (result.success) {
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || "Failed to submit application");
    }

    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Application Submitted! 🎉
        </h3>
        <p className="text-green-700">
          Your application for {role} role has been submitted successfully. We'll review it and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio *
        </label>
        <textarea
          id="bio"
          name="bio"
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={`Tell us about your experience as ${role === "ARTIST" ? "an artist" : "an organizer"}...`}
        />
      </div>

      <div>
        <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Portfolio/Website URL
        </label>
        <input
          type="url"
          id="portfolioUrl"
          name="portfolioUrl"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://your-portfolio.com"
        />
      </div>

      <div>
        <label htmlFor="proofDocument" className="block text-sm font-medium text-gray-700 mb-2">
          Proof Document (PDF or Image)
        </label>
        <input
          type="file"
          id="proofDocument"
          name="proofDocument"
          accept=".pdf,.jpg,.jpeg,.png"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Upload certificates, credentials, or relevant documents
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
