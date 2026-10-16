"use client";

import { useState } from "react";
import { updateReportStatus, deleteReportedListing } from "@/lib/actions/report.actions";
import { Check, Trash2, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminReportsList({ initialReports }: { initialReports: any[] }) {
  const [reports, setReports] = useState<any[]>(initialReports);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatus = async (reportId: string, status: "RESOLVED" | "DISMISSED") => {
    setLoadingId(reportId);
    try {
      await updateReportStatus(reportId, status);
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status } : r))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update report");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteListing = async (reportId: string, itemId: string) => {
    if (!confirm("Are you sure you want to permanently remove this listing?")) return;
    setLoadingId(reportId);
    try {
      await deleteReportedListing(reportId, itemId);
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: "RESOLVED", itemId: null } : r))
      );
      alert("Listing deleted successfully");
    } catch (err: any) {
      alert(err.message || "Failed to delete listing");
    } finally {
      setLoadingId(null);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        No reports found. Community listings are clean!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3">Reported Item</th>
            <th className="px-6 py-3">Reported By</th>
            <th className="px-6 py-3">Reason</th>
            <th className="px-6 py-3">Details</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {reports.map((report) => (
            <tr key={report._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="px-6 py-4 text-sm font-semibold">
                {report.itemId ? (
                  <Link href={`/items/${report.itemId._id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {report.itemId.itemName}
                  </Link>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 italic text-xs">Deleted</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                {report.reporterId?.name || "Student"}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                  {report.reason}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                {report.details || "—"}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    report.status === "PENDING"
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                      : report.status === "RESOLVED"
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {report.status}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-slate-400 dark:text-slate-500">
                {report.createdAt ? format(new Date(report.createdAt), "MMM d, yyyy") : ""}
              </td>
              <td className="px-6 py-4 text-sm text-right space-x-2">
                {report.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleStatus(report._id, "RESOLVED")}
                      disabled={loadingId === report._id}
                      className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-medium transition-colors"
                      title="Mark Resolved"
                    >
                      <Check className="w-3.5 h-3.5 inline mr-1" /> Resolve
                    </button>
                    <button
                      onClick={() => handleStatus(report._id, "DISMISSED")}
                      disabled={loadingId === report._id}
                      className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-colors"
                      title="Dismiss Report"
                    >
                      <X className="w-3.5 h-3.5 inline mr-1" /> Dismiss
                    </button>
                    {report.itemId && (
                      <button
                        onClick={() => handleDeleteListing(report._id, report.itemId._id)}
                        disabled={loadingId === report._id}
                        className="text-xs bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 px-2.5 py-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 font-medium transition-colors"
                        title="Delete Inappropriate Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete Item
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
