export default function ProductTable({ products, onDelete }) {
  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">
                <img src={p.image} className="w-12 h-12 rounded object-cover" />
              </td>

              <td>{p.name}</td>

              <td>{p.category?.name}</td>

              <td>₹{p.price}</td>

              <td>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    p.stock < 5 ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  {p.stock}
                </span>
              </td>

              <td className="space-x-2">
                <button className="text-blue-600">Edit</button>

                <button onClick={() => onDelete(p.id)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
