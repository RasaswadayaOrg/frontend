"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const RoleApplicationsManager = dynamic(
  () => import("../../../components/admin/RoleApplicationsManager"),
  { ssr: false }
);

export default function AdminRoleApplicationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Role Applications</h1>
          <p className="mt-2 text-gray-600">
            Review and manage user requests to become Artists or Organizers
          </p>
        </div>

        <Suspense fallback={<div>Loading applications...</div>}>
          <RoleApplicationsManager />
        </Suspense>
      </div>
    </div>
  );
}
