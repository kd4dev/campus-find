import ItemForm from "@/components/items/ItemForm";

export default function ReportFoundItem() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-[#141416] p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 transition-colors">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/60">
            FOUND ITEM REPORT
          </div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white tracking-tight">Report Found Item</h1>
          <p className="text-slate-500 dark:text-neutral-400 text-sm">Thank you for being a good Samaritan! Keep some identifying details private so the real owner can verify their claim.</p>
        </div>
        <ItemForm type="FOUND" />
      </div>
    </div>
  );
}
