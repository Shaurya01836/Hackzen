import React, { useEffect, useState } from 'react';
import SponsoredPSList from './components/SponsoredPSList';
import RealSponseredDetail from './components/RealSponseredDetail';
import { DiscAlbum } from 'lucide-react';

export default function SponsoredPS() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  async function fetchProposalsAndTelegrams() {
    setLoading(true);
    const res = await fetch(`/api/sponsor-proposals/user/${user?.email}`);
    const data = await res.json();
    const approvedProposals = Array.isArray(data) ? data.filter(p => p.status === 'approved') : [];
    setProposals(approvedProposals);
    setLoading(false);
  }

  useEffect(() => {
    if (user?.email) fetchProposalsAndTelegrams();
    function handleVisibility() {
      if (document.visibilityState === 'visible' && user?.email) {
        fetchProposalsAndTelegrams();
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [user?.email]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!selectedProposal) {
    return (
      <div className="max-w-4xl min-w-full">
        <SponsoredPSList proposals={proposals} onSelectProposal={setSelectedProposal} />
      </div>
    );
  }
  return (
    <div className="max-w-4xl min-w-full">
      <RealSponseredDetail proposal={selectedProposal} onBack={() => setSelectedProposal(null)} onProposalUpdated={fetchProposalsAndTelegrams} />
    </div>
  );
} 