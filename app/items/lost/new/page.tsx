import ItemForm from "@/components/items/ItemForm";

export default function ReportLostItem() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-[#141416] p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-white/10 transition-colors">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/60">
            LOST ITEM REPORT
          </div>
          <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white tracking-tight">Report Lost Item</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Provide as much detail as possible so campus community members can identify and return your item.</p>
        </div>
        <ItemForm type="LOST" />
      </div>
    </div>
  );
}
