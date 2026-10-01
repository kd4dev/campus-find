import ItemForm from "@/components/items/ItemForm";

export default function ReportFoundItem() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border">
        <h1 className="text-3xl font-bold mb-2">Report Found Item</h1>
        <p className="text-gray-500 mb-8">Thank you for helping! Keep some identifying details private to verify the real owner.</p>
        <ItemForm type="FOUND" />
      </div>
    </div>
  );
}
