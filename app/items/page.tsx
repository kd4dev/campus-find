export const dynamic = 'force-dynamic';
import { getItems } from "@/lib/actions/item.actions";
import BrowseItemsClient from "@/components/items/BrowseItemsClient";

export default async function BrowseItems({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedParams = await searchParams;
  const type = typeof resolvedParams.type === 'string' ? resolvedParams.type : undefined;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;
  
  // Retrieve items from server (respecting any URL query parameters)
  const items = await getItems({
    ...(type ? { type } : {}),
    ...(category ? { category } : {}),
    ...(search ? { search } : {})
  });

  // If filtered server query returned very few items, also fetch all active items so client filtering is instantaneous
  const allActiveItems = (type || category || search) ? await getItems({}) : items;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 transition-colors">
      <div className="mb-8">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-[#f79b4a] border border-orange-500/20">
          Live Campus Directory
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mt-2">
          Campus Lost & Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Browse active items reported by students across campus. Items remain visible until physical OTP handover.
        </p>
      </div>

      <BrowseItemsClient
        initialItems={allActiveItems}
        initialType={type}
        initialCategory={category}
        initialSearch={search}
      />
    </div>
  );
}

