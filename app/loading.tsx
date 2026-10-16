export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-[#18181c] rounded-lg"></div>
          <div className="h-4 w-72 bg-gray-100 dark:bg-[#18181c]/60 rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-20 bg-gray-200 dark:bg-[#18181c] rounded-full"></div>
          <div className="h-10 w-20 bg-gray-200 dark:bg-[#18181c] rounded-full"></div>
          <div className="h-10 w-20 bg-gray-200 dark:bg-[#18181c] rounded-full"></div>
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white dark:bg-[#141416] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm flex flex-col">
            <div className="aspect-square bg-gray-100 dark:bg-[#18181c]/70"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-[#18181c] rounded"></div>
              <div className="h-3 w-1/2 bg-gray-100 dark:bg-[#18181c]/60 rounded"></div>
              <div className="h-3 w-2/3 bg-gray-100 dark:bg-[#18181c]/60 rounded"></div>
              <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                <div className="h-6 w-6 bg-gray-200 dark:bg-[#18181c] rounded-full"></div>
                <div className="h-3 w-20 bg-gray-100 dark:bg-[#18181c]/60 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
