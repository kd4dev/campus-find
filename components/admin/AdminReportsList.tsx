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
      <div className="p-8 text-center text-gray-500 text-sm">
        No reports found. Community listings are clean!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b bg-gray-50 text-xs text-gray-500 uppercase">
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
        <tbody className="divide-y divide-gray-100">
          {reports.map((report) => (
            <tr key={report._id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 text-sm font-medium">
                {report.itemId ? (
                  <Link href={`/items/${report.itemId._id}`} className="text-blue-600 hover:underline">
                    {report.itemId.itemName}
                  </Link>
                ) : (
                  <span className="text-gray-400 italic">Deleted</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {report.reporterId?.name || "Student"}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700">
                  {report.reason}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                {report.details || "—"}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    report.status === "PENDING"
                      ? "bg-amber-100 text-amber-800"
                      : report.status === "RESOLVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {report.status}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-gray-400">
                {report.createdAt ? format(new Date(report.createdAt), "MMM d, yyyy") : ""}
              </td>
              <td className="px-6 py-4 text-sm text-right space-x-2">
                {report.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleStatus(report._id, "RESOLVED")}
                      disabled={loadingId === report._id}
                      className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 font-medium"
                      title="Mark Resolved"
                    >
                      <Check className="w-3.5 h-3.5 inline mr-1" /> Resolve
                    </button>
                    <button
                      onClick={() => handleStatus(report._id, "DISMISSED")}
                      disabled={loadingId === report._id}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 font-medium"
                      title="Dismiss Report"
                    >
                      <X className="w-3.5 h-3.5 inline mr-1" /> Dismiss
                    </button>
                    {report.itemId && (
                      <button
                        onClick={() => handleDeleteListing(report._id, report.itemId._id)}
                        disabled={loadingId === report._id}
                        className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100 font-medium"
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
