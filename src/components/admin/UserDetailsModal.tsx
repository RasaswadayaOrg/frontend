'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Shield, FileText, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

interface RoleApplication {
  id: string;
  role: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  bio?: string;
  portfolioUrl?: string;
  proofDocumentUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserDetails {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  roleApplications?: RoleApplication[];
}

interface UserDetailsModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({ userId, isOpen, onClose }: UserDetailsModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingApplicationId, setProcessingApplicationId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionDescription, setRejectionDescription] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:3001/api/v1/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setUserDetails(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string, description?: string) => {
    setProcessingApplicationId(applicationId);
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:3001/api/v1/role-requests/${applicationId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve application');
      }

      // Refresh user details to show updated status
      await fetchUserDetails();
      alert('Application approved successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setProcessingApplicationId(null);
    }
  };

  const handleRejectClick = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setShowRejectModal(true);
    setRejectionReason('');
    setRejectionDescription('');
  };

  const handleRejectSubmit = async () => {
    if (!selectedApplicationId || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setProcessingApplicationId(selectedApplicationId);
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:3001/api/v1/role-requests/${selectedApplicationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          rejectionReason: rejectionReason.trim(),
          description: rejectionDescription.trim() || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject application');
      }

      // Refresh user details to show updated status
      await fetchUserDetails();
      setShowRejectModal(false);
      setSelectedApplicationId(null);
      alert('Application rejected successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setProcessingApplicationId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };

    const icons = {
      PENDING: <Clock className="w-3 h-3" />,
      APPROVED: <CheckCircle className="w-3 h-3" />,
      REJECTED: <XCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      USER: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      ARTIST: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      ORGANIZER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      STORE_OWNER: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      TEACHER: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${colors[role as keyof typeof colors] || colors.USER}`}>
        <Shield className="w-3 h-3" />
        {role}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              User Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={fetchUserDetails}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Retry
                </button>
              </div>
            ) : userDetails ? (
              <div className="space-y-6">
                {/* User Profile Section */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {userDetails.avatarUrl ? (
                        <img
                          src={userDetails.avatarUrl}
                          alt={userDetails.fullName}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                          <User className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {userDetails.fullName}
                        </h3>
                        {getRoleBadge(userDetails.role)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{userDetails.email}</span>
                        </div>

                        {userDetails.phone && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">{userDetails.phone}</span>
                          </div>
                        )}

                        {userDetails.city && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{userDetails.city}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Joined {formatDate(userDetails.createdAt)}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          User ID: {userDetails.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Applications Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Role Applications History
                  </h3>

                  {!userDetails.roleApplications || userDetails.roleApplications.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No role applications found
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userDetails.roleApplications.map((application) => (
                        <div
                          key={application.id}
                          className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                        >
                          {/* Application Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {application.role} Application
                                </h4>
                                {getStatusBadge(application.status)}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Applied on {formatDate(application.createdAt)}
                              </p>
                            </div>

                            {/* Action Buttons for Pending Applications */}
                            {application.status === 'PENDING' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprove(application.id)}
                                  disabled={processingApplicationId === application.id}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                  {processingApplicationId === application.id ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4" />
                                      Approve
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleRejectClick(application.id)}
                                  disabled={processingApplicationId === application.id}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Application Details */}
                          <div className="space-y-4">
                            {/* Bio */}
                            {application.bio && (
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  Bio / Description
                                </label>
                                <p className="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                                  {application.bio}
                                </p>
                              </div>
                            )}

                            {/* Portfolio URL */}
                            {application.portfolioUrl && (
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  Portfolio
                                </label>
                                <a
                                  href={application.portfolioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline text-sm"
                                >
                                  {application.portfolioUrl}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}

                            {/* Proof Document */}
                            {application.proofDocumentUrl && (
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                  Proof Document
                                </label>
                                <a
                                  href={application.proofDocumentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm"
                                >
                                  <FileText className="w-4 h-4" />
                                  View Document
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}

                            {/* Admin Notes / Rejection Reason */}
                            {application.notes && (
                              <div className={`rounded-lg p-4 ${
                                application.status === 'REJECTED' 
                                  ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800' 
                                  : 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                              }`}>
                                <label className={`block text-sm font-semibold mb-2 ${
                                  application.status === 'REJECTED'
                                    ? 'text-red-800 dark:text-red-400'
                                    : 'text-blue-800 dark:text-blue-400'
                                }`}>
                                  {application.status === 'REJECTED' ? '❌ Rejection Reason' : '📝 Admin Notes'}
                                </label>
                                <p className={`text-sm ${
                                  application.status === 'REJECTED'
                                    ? 'text-red-700 dark:text-red-300'
                                    : 'text-blue-700 dark:text-blue-300'
                                }`}>
                                  {application.notes}
                                </p>
                              </div>
                            )}

                            {/* Status-specific Messages */}
                            {application.status === 'APPROVED' && (
                              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
                                  <CheckCircle className="w-5 h-5" />
                                  <p className="text-sm font-semibold">
                                    Application Approved - User role updated to {application.role}
                                  </p>
                                </div>
                                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                                  Reviewed on {formatDate(application.updatedAt)}
                                </p>
                              </div>
                            )}

                            {application.status === 'PENDING' && (
                              <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-orange-800 dark:text-orange-400">
                                  <Clock className="w-5 h-5" />
                                  <p className="text-sm font-semibold">
                                    Application is pending review
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowRejectModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Reject Application
                  </h3>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a clear reason for rejection..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Additional Description (Optional)
                    </label>
                    <textarea
                      value={rejectionDescription}
                      onChange={(e) => setRejectionDescription(e.target.value)}
                      placeholder="Add any additional notes or feedback..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowRejectModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejectSubmit}
                      disabled={!rejectionReason.trim() || processingApplicationId === selectedApplicationId}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium"
                    >
                      {processingApplicationId === selectedApplicationId ? 'Processing...' : 'Confirm Rejection'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
