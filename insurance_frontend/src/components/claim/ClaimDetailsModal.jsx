import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { FileText, Calendar, DollarSign, CheckCircle2, XCircle, MessageSquare, FileCheck } from 'lucide-react';

const ClaimDetailsModal = ({ isOpen, onClose, claim }) => {
  if (!claim) return null;

  const details = [
    {
      label: 'Claim Number',
      value: claim.claimNumber || claim.claim_number || 'N/A',
      icon: FileText,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Policy Number',
      value: claim.policyNumber || claim.policy_number || 'N/A',
      icon: FileCheck,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Claim Date',
      value: formatDate(claim.claimDate || claim.claim_date),
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Claim Amount',
      value: formatCurrency(claim.claimAmount || claim.claim_amount || 0),
      icon: DollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Status',
      value: <StatusBadge status={claim.status || 'Submitted'} />,
      icon: claim.status === 'Approved' ? CheckCircle2 : claim.status === 'Rejected' ? XCircle : FileText,
      iconBg: claim.status === 'Approved' ? 'bg-green-100' : claim.status === 'Rejected' ? 'bg-red-100' : 'bg-yellow-100',
      iconColor: claim.status === 'Approved' ? 'text-green-600' : claim.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
    },
    {
      label: 'Submitted Date',
      value: formatDateTime(claim.createdAt || claim.created_at),
      icon: Calendar,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Claim Details"
      size="lg"
    >
      <div className="space-y-5">
        {/* Claim Information - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => {
            const Icon = detail.icon;
            return (
              <div 
                key={index} 
                className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`${detail.iconBg} ${detail.iconColor} p-2.5 rounded-lg flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      {detail.label}
                    </p>
                    <div className="text-sm font-bold text-gray-900">
                      {typeof detail.value === 'string' || typeof detail.value === 'number' ? detail.value : detail.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Description - Full Width */}
        <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg flex-shrink-0">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Description
              </p>
              <div className="text-xs text-gray-900 leading-relaxed">
                {claim.description || 'No description provided'}
              </div>
            </div>
          </div>
        </div>

        {/* Remarks - Full Width (if available) */}
        {claim.remarks && (
          <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 p-2.5 rounded-lg flex-shrink-0">
                <FileCheck className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Remarks
                </p>
                <div className="text-xs text-gray-900 leading-relaxed">
                  {claim.remarks}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimDetailsModal;

