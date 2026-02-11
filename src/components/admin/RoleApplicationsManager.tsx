"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, FileText, ExternalLink } from "lucide-react";

interface RoleApplication {
  id: string;
  userId: string;
  role: "ARTIST" | "ORGANIZER";
  status: "PENDING" | "APPROVED" | "REJECTED";
  bio: string | null;
  portfolioUrl: string | null;
  proofDocumentUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export default function RoleApplicationsManager() {
  const [applications, setApplications] = useState<RoleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/role-applications?status=${filter}`);
      const data = await res.json();
      
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    applicationId: string,
    status: "APPROVED" | "REJECTED",
    notes?: string
  ) => {
    setProcessing(applicationId);
    
    try {
      const res = await fetch(`/api/admin/role-applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchApplications();
        alert(`Application ${status.toLowerCase()} successfully!`);
      } else {
        alert(data.error || "Failed to update application");
      }
    } catch (error) {
      console.error("Failed to update application:", error);
      alert("Failed to update application");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    const icons = {
      PENDING: <Clock className="w-4 h-4" />,
      APPROVED: <CheckCircle className="w-4 h-4" />,
      REJECTED: <XCircle className="w-4 h-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              filter === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No {filter.toLowerCase()} applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {app.user.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">{app.user.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Current Role: <span className="font-medium">{app.user.role}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(app.status)}
                  <span className="text-sm text-gray-500">
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Applying for: <span className="text-blue-600 font-semibold">{app.role}</span>
                </p>
                {app.bio && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Bio:</p>
                    <p className="text-sm text-gray-600 mt-1">{app.bio}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mb-4">
                {app.portfolioUrl && (
                  <a
                    href={app.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
                {app.proofDocumentUrl && (
                  <a
                    href={app.proofDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="w-4 h-4" />
                    Proof Document
                  </a>
                )}
              </div>

              {app.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-700">Admin Notes:</p>
                  <p className="text-sm text-gray-600 mt-1">{app.notes}</p>
                </div>
              )}

              {app.status === "PENDING" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const notes = prompt("Add notes (optional):");
                      handleStatusUpdate(app.id, "APPROVED", notes || undefined);
                    }}
                    disabled={processing === app.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const notes = prompt("Reason for rejection (optional):");
                      handleStatusUpdate(app.id, "REJECTED", notes || undefined);
                    }}
                    disabled={processing === app.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4 inline mr-2" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
