"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Application {
  id: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  bio: string | null;
  portfolioUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/user/my-applications");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setApplications(data);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Your application is under review";
      case "APPROVED":
        return "Congratulations! Your application has been approved";
      case "REJECTED":
        return "Your application was not approved";
      default:
        return "Unknown status";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Role Applications</h1>
          <p className="mt-2 text-gray-600">
            Track the status of your Artist and Organizer role applications
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't submitted any role applications yet.</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/role-application/artist"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Apply as Artist
              </Link>
              <Link
                href="/role-application/organizer"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Apply as Organizer
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {app.role} Application
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(app.status)}
                    <span className={`font-semibold ${
                      app.status === "APPROVED"
                        ? "text-green-600"
                        : app.status === "REJECTED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700">{getStatusMessage(app.status)}</p>
                </div>

                {app.bio && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">Your Bio:</p>
                    <p className="text-sm text-gray-600 mt-1">{app.bio}</p>
                  </div>
                )}

                {app.notes && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Admin Notes:</p>
                    <p className="text-sm text-blue-800 mt-1">{app.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
