export default function ProductFilters({
  search,
  setSearch,

  sort,
  setSort,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 rounded w-full"
      />

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border p-3 rounded"
      >
        <option value="latest">Latest</option>

        <option value="price-low">Price Low-High</option>

        <option value="price-high">Price High-Low</option>
      </select>
    </div>
  );
}
