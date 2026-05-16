import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CategoryForm from "../components/CategoryForm";
import { getCategories } from "../services/categoryService";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Category Management</h1>

          <span className="text-sm text-gray-500">Admin Panel</span>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: FORM */}
          <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Create Category</h2>

            <CategoryForm onSuccess={fetchCategories} />
          </div>

          {/* RIGHT: LIST */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Categories</h2>

              <span className="text-sm text-gray-500">
                {categories.length} total
              </span>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-gray-100 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No categories found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 border rounded-xl hover:shadow-md transition bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{cat.name}</h3>
                        <p className="text-sm text-gray-500">/{cat.slug}</p>
                      </div>

                      {/* Badge */}
                      <span className="text-xs px-2 py-1 bg-black text-white rounded-full">
                        Category
                      </span>
                    </div>

                    {cat.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
