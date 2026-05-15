import ProductForm from "../components/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Create Product</h1>

      <ProductForm />
    </div>
  );
}
