"use client";

import React, { useState, useEffect } from "react";
import { getAllRepairRequests, updateRepairRequestStatus } from "@/app/actions";
import { Wrench, Clock, Check, X, Loader2, CreditCard, ChevronRight, Edit2, AlertCircle } from "lucide-react";

export default function AdminRepairsPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // Diagnostics / Estimate Update Modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [estimateCost, setEstimateCost] = useState("");
  const [adminFeedback, setAdminFeedback] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchRepairs = () => {
    setLoading(true);
    getAllRepairRequests().then((res) => {
      setRepairs(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleOpenUpdateModal = (job: any) => {
    setSelectedJob(job);
    setEstimateCost(job.estimateCost ? String(job.estimateCost) : "");
    setAdminFeedback(job.adminFeedback || "");
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAction(true);
    
    // Automatically approve if moving from Pending to Approved on setting cost
    const newStatus = selectedJob.status === "Pending" ? "Approved" : selectedJob.status;
    const costNum = estimateCost.trim() ? parseInt(estimateCost) : undefined;
    
    const success = await updateRepairRequestStatus(
      selectedJob.id,
      newStatus,
      adminFeedback.trim(),
      costNum
    );

    setSubmittingAction(false);
    if (success) {
      setIsUpdateModalOpen(false);
      alert("Repair job details updated successfully!");
      fetchRepairs();
    } else {
      alert("Failed to update repair job details.");
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string, nextStatus: string) => {
    if (nextStatus === "Approved" && !estimateCost && !selectedJob?.estimateCost) {
      alert("Please set an estimated cost diagnostic invoice before approving.");
      return;
    }
    
    if (!confirm(`Are you sure you want to transition repair status to "${nextStatus}"?`)) return;
    
    setSubmittingAction(true);
    const success = await updateRepairRequestStatus(id, nextStatus);
    setSubmittingAction(false);
    
    if (success) {
      alert(`Status transitioned to: ${nextStatus}`);
      fetchRepairs();
    } else {
      alert("Failed to update status.");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection feedback reason:");
    if (reason === null) return; // cancel
    if (!reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }

    setSubmittingAction(true);
    const success = await updateRepairRequestStatus(id, "Rejected", reason.trim());
    setSubmittingAction(false);

    if (success) {
      alert("Repair request rejected.");
      fetchRepairs();
    } else {
      alert("Failed to reject repair request.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-200">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Repair Desk Manager</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Control repair queues, diagnostic billing, & status steps</p>
        </div>
      </div>

      {/* Grid count stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="p-5 bg-[#14141b] border border-slate-850 rounded-2xl">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Tickets</div>
          <div className="text-xl font-black text-white mt-1">{repairs.length}</div>
        </div>
        <div className="p-5 bg-[#14141b] border border-blue-950 rounded-2xl">
          <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Active Repairing</div>
          <div className="text-xl font-black text-blue-400 mt-1">
            {repairs.filter(r => ["Received", "Repairing"].includes(r.status)).length}
          </div>
        </div>
        <div className="p-5 bg-[#14141b] border border-emerald-950 rounded-2xl">
          <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Completed returned</div>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {repairs.filter(r => r.status === "Returned").length}
          </div>
        </div>
        <div className="p-5 bg-[#14141b] border border-amber-950 rounded-2xl">
          <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Awaiting Diagnostics</div>
          <div className="text-xl font-black text-amber-400 mt-1">
            {repairs.filter(r => r.status === "Pending").length}
          </div>
        </div>
      </div>

      {/* Main Repair jobs list */}
      <div className="bg-[#14141b] border border-slate-800 rounded-3xl p-6 shadow-md">
        {repairs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-500">
                  <th className="py-3 px-2">Ticket ID</th>
                  <th className="py-3 px-2">Customer Profile</th>
                  <th className="py-3 px-2">Mobile Device</th>
                  <th className="py-3 px-2">Problem Category</th>
                  <th className="py-3 px-2">Billing / Cost</th>
                  <th className="py-3 px-2">Milestone Status</th>
                  <th className="py-3 px-2 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-semibold">
                {repairs.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="py-3 px-2 font-mono uppercase text-slate-400">{r.id.slice(0, 8)}</td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-white">{r.customerName}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{r.customerPhone}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-extrabold text-white">{r.brand}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{r.modelName}</span>
                    </td>
                    <td className="py-3 px-2 text-slate-300 max-w-[150px]">
                      <div className="truncate" title={r.problemType}>{r.problemType}</div>
                      {r.status === "Cancelled" && r.cancelReason && (
                        <div className="text-[9px] text-red-400 font-bold block mt-1" title={r.cancelReason}>
                          Cancel Reason: {r.cancelReason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {r.estimateCost ? (
                        <div>
                          <div className="font-black text-white">Rs. {r.estimateCost.toLocaleString()}</div>
                          <span className={`text-[8px] font-bold px-1 rounded ${
                            r.paymentStatus === "Paid" ? "bg-emerald-950 text-emerald-400 border border-emerald-900/30" : "bg-red-950 text-red-400 border border-red-900/30"
                          }`}>
                            {r.paymentStatus === "Paid" ? "Paid" : "Unpaid"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No diagnostic estimate</span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        r.status === "Pending" ? "bg-amber-950/40 text-amber-400 border border-amber-900/30" :
                        r.status === "Rejected" ? "bg-red-950/40 text-red-400 border border-red-900/30" :
                        r.status === "Cancelled" ? "bg-red-950/40 text-red-400 border border-red-900/30 font-extrabold" :
                        r.status === "Returned" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" :
                        "bg-blue-950/40 text-blue-400 border border-blue-900/30"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right space-x-2 shrink-0">
                      {/* Diagnostic Update button */}
                      <button
                        onClick={() => handleOpenUpdateModal(r)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="Edit Diagnostics & Estimate"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Stepper advancement trigger workflow buttons */}
                      {r.status === "Pending" && (
                        <button
                          onClick={() => handleOpenUpdateModal(r)}
                          className="px-2 py-1 bg-emerald-900/20 hover:bg-emerald-900/50 text-emerald-400 text-[10px] font-extrabold uppercase rounded-lg border border-emerald-900/30 transition-colors cursor-pointer"
                        >
                          Diagnose
                        </button>
                      )}

                      {r.status === "Approved" && (
                        <button
                          onClick={() => handleStatusChange(r.id, r.status, "Received")}
                          className="px-2 py-1 bg-blue-900/20 hover:bg-blue-900/50 text-blue-400 text-[10px] font-extrabold uppercase rounded-lg border border-blue-900/30 transition-colors cursor-pointer"
                        >
                          Mark Received
                        </button>
                      )}

                      {r.status === "Received" && (
                        <button
                          onClick={() => handleStatusChange(r.id, r.status, "Repairing")}
                          className="px-2 py-1 bg-blue-900/20 hover:bg-blue-900/50 text-blue-400 text-[10px] font-extrabold uppercase rounded-lg border border-blue-900/30 transition-colors cursor-pointer"
                        >
                          Start Repairing
                        </button>
                      )}

                      {r.status === "Repairing" && (
                        <button
                          onClick={() => handleStatusChange(r.id, r.status, "Fixed")}
                          className="px-2 py-1 bg-emerald-900/20 hover:bg-emerald-900/50 text-emerald-400 text-[10px] font-extrabold uppercase rounded-lg border border-emerald-900/30 transition-colors cursor-pointer"
                        >
                          Mark Fixed
                        </button>
                      )}

                      {r.status === "Fixed" && (
                        <button
                          onClick={() => handleStatusChange(r.id, r.status, "Returned")}
                          className="px-2 py-1 bg-emerald-900/20 hover:bg-emerald-900/50 text-emerald-400 text-[10px] font-extrabold uppercase rounded-lg border border-emerald-900/30 transition-colors cursor-pointer"
                        >
                          Mark Returned
                        </button>
                      )}

                      {/* Reject button */}
                      {["Pending", "Approved"].includes(r.status) && (
                        <button
                          onClick={() => handleReject(r.id)}
                          className="p-1.5 bg-red-900/10 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors border border-red-900/20 cursor-pointer"
                          title="Reject request"
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Wrench className="w-12 h-12 text-slate-750 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">No active repair tickets in queues.</p>
          </div>
        )}
      </div>

      {/* Diagnostics Cost & Notes Modal */}
      {isUpdateModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 text-xs">
          <div className="w-full max-w-md bg-[#14141b] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative text-slate-200">
            <button 
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-primary" /> Technicians Diagnostic Panel
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Device: {selectedJob.brand} {selectedJob.modelName} &middot; Ticket ID: {selectedJob.id.slice(0, 8)}</p>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 font-semibold text-slate-400">
              <div className="space-y-1.5">
                <label>Estimated Repair Cost (Rs.) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5500"
                  value={estimateCost}
                  onChange={(e) => setEstimateCost(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label>Diagnosis / Feedback Comments</label>
                <textarea
                  rows={4}
                  placeholder="Add diagnosis details (e.g., Motherboard IC short detected, replacement parts order required, estimated delivery 3 days...)"
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white font-bold cursor-pointer text-center flex items-center justify-center disabled:opacity-50"
                >
                  {submittingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
