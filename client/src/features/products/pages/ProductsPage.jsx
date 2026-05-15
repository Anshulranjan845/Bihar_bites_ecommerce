import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Container from "../../../components/Container";

import ProductCard from "../components/ProductCard";

import ProductFilters from "../components/ProductFilters";
import { useDebounce } from "use-debounce";

import { getProducts } from "../services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("latest");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({});
  const [debouncedSearch] = useDebounce(search, 500);
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({
          search: debouncedSearch,

          sort,

          page,

          category: selectedCategory,
        });

        setProducts(response.products);

        setPagination(response.pagination);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [debouncedSearch, sort, page, selectedCategory]);

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-8">Products</h1>

        <ProductFilters
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex gap-3 justify-center mt-10">
          {Array.from(
            {
              length: pagination.totalPages || 1,
            },
            (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`px-4 py-2 border rounded ${
                  page === index + 1 ? "bg-black text-white" : ""
                }`}
              >
                {index + 1}
              </button>
            ),
          )}
        </div>
      </div>
    </Container>
  );
}
