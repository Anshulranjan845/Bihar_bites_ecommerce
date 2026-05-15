import { useQuery } from "@tanstack/react-query";

import { getFeaturedProducts } from "../services/productService";

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["featured-products"],

    queryFn: getFeaturedProducts,
  });
};
