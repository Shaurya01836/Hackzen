import React from "react";
import { Button } from "../../../../components/CommonUI/button";
import ChatModal from '../../components/ChatModal';
import BaseModal from "../../partipantDashboard/components/HackathonComponent/Hackathon/TeamModals/BaseModal";

export default function CreatedHackathonModals({
  showDeleteDialog,
  setShowDeleteDialog,
  showSponsorModal,
  setShowSponsorModal,
  reviewModal,
  setReviewModal,
  messageModal,
  setMessageModal,
  chatOpen,
  setChatOpen,
  chatProposalId,
  setChatProposalId,
  showParticipantsModal,
  setShowParticipantsModal,
  participantsList,
  participantsModalLoading,
  participantsModalError,
  deletingId,
  confirmDelete,
  cancelDelete,
  sponsorProposals = [],
  loadingProposals = false,
  handleReviewProposal = () => {},
  handleSendMessageToSponsor = () => {},
  user,
}) {
  return (
    <>
      {/* Delete Hackathon Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-bold mb-2">Delete Hackathon?</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this hackathon? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex-1"
              >
                {deletingId !== null ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="flex-1"
                disabled={deletingId !== null}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Sponsor Proposals Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowSponsorModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Sponsored Problem Statement Proposals</h2>
            {loadingProposals ? (
              <div>Loading...</div>
            ) : sponsorProposals.length === 0 ? (
              <div className="text-gray-500">No proposals found.</div>
            ) : (
              <div className="space-y-6">
                {sponsorProposals.map((p) => (
                  <div key={p._id} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-lg">{p.title}</div>
                      <span className={p.status === 'pending' ? 'text-yellow-600' : p.status === 'approved' ? 'text-green-600' : 'text-red-600'}>{p.status}</span>
                    </div>
                    {/* ...other proposal details... */}
                    {p.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleReviewProposal(p._id, 'approved')}>Approve</Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleReviewProposal(p._id, 'rejected')}>Reject</Button>
                      </div>
                    )}
                    <Button size="sm" variant="default" className="mt-2" onClick={() => { setChatProposalId(p._id); setChatOpen(true); }}>Chat with Sponsor</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Review Modal for Approve/Reject with message */}
      {reviewModal && reviewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative border-4 border-indigo-400">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setReviewModal({ open: false, proposalId: null, action: '', loading: false, message: '', price: '' })}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">{reviewModal.action === 'approved' ? 'Accept Proposal & Provide Contact Instructions' : 'Reject Proposal'}</h2>
            {reviewModal.action === 'approved' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Set Price/Prize Amount (required)</label>
                <input
                  type="text"
                  className="w-full border-2 border-indigo-300 rounded p-2 mb-2 focus:outline-indigo-500"
                  placeholder="e.g., ₹5000 / $100"
                  value={reviewModal.price || ''}
                  onChange={e => setReviewModal(prev => ({ ...prev, price: e.target.value }))}
                  disabled={reviewModal.loading}
                  required
                />
              </div>
            )}
            <label className="block text-sm font-semibold mb-2">
              {reviewModal.action === 'approved'
                ? 'Contact Instructions / Next Steps for Sponsor (required)'
                : 'Reason for Rejection (required)'}
            </label>
            <textarea
              className="w-full border-2 border-indigo-300 rounded p-2 mb-4 focus:outline-indigo-500"
              rows={4}
              placeholder={reviewModal.action === 'approved' ? 'E.g., We will contact you at your email. Please join our Slack: ... or Next steps for collaboration...' : 'Please specify the reason for rejection.'}
              value={reviewModal.message}
              onChange={e => setReviewModal(prev => ({ ...prev, message: e.target.value }))}
              disabled={reviewModal.loading}
            />
            {user && !user.telegram && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded">
                <b>Reminder:</b> Please provide your Telegram handle in your profile so sponsors can contact you.
              </div>
            )}
            <Button
              className={reviewModal.action === 'approved' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}
              onClick={reviewModal.onSubmit}
              disabled={reviewModal.loading || !reviewModal.message.trim() || (reviewModal.action === 'approved' && !reviewModal.price)}
            >
              {reviewModal.loading ? 'Submitting...' : reviewModal.action === 'approved' ? 'Accept & Send' : 'Reject & Send'}
            </Button>
          </div>
        </div>
      )}
      {/* Message Modal */}
      {messageModal && messageModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative border-4 border-blue-400">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setMessageModal({ open: false, proposal: null, message: '' })}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Send Message to Sponsor</h2>
            <textarea
              className="w-full border-2 border-blue-300 rounded p-2 mb-4 focus:outline-blue-500"
              rows={4}
              placeholder="Type your message to the sponsor here..."
              value={messageModal.message}
              onChange={e => setMessageModal(prev => ({ ...prev, message: e.target.value }))}
            />
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSendMessageToSponsor} disabled={!messageModal.message.trim()}>
              Send Message
            </Button>
          </div>
        </div>
      )}
      {/* Chat Modal */}
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} proposalId={chatProposalId} currentUser={user} />
      {/* Participants Modal */}
      <BaseModal
        open={showParticipantsModal}
        onOpenChange={setShowParticipantsModal}
        title="Registered Participants"
        content={
          participantsModalLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : participantsModalError ? (
            <div className="p-4 text-red-600">{participantsModalError}</div>
          ) : participantsList.length === 0 ? (
            <div className="p-4 text-gray-500">No participants registered yet.</div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y">
              {participantsList.map((p, idx) => (
                <li key={p.id || p.userId || idx} className="py-2 flex items-center gap-3">
                  {p.avatar && <img src={p.avatar} alt="avatar" className="w-8 h-8 rounded-full" />}
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.email}</div>
                  </div>
                  {p.teamName && <span className="ml-auto text-xs text-indigo-600">{p.teamName}</span>}
                </li>
              ))}
            </ul>
          )
        }
      />
    </>
  );
} 