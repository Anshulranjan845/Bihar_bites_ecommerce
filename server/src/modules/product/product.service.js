import prisma from "../../lib/prisma.js";

export const createProduct = async (data) => {
  const existingProduct = await prisma.product.findFirst({
    where: {
      OR: [{ name: data.name }, { slug: data.slug }],
    },
  });

  if (existingProduct) {
    throw new Error("Product already exists");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const product = await prisma.product.create({
    data,

    include: {
      category: true,
    },
  });

  return product;
};

export const getAllProducts = async (query) => {
  const { page = 1, limit = 10, search = "", category, featured, sort } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    AND: [
      search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},

      category
        ? {
            categoryId: category,
          }
        : {},

      featured === "true"
        ? {
            isFeatured: true,
          }
        : {},

      {
        isAvailable: true,
      },
    ],
  };

  let orderBy = {
    createdAt: "desc",
  };

  if (sort === "price_asc") {
    orderBy = {
      price: "asc",
    };
  }

  if (sort === "price_desc") {
    orderBy = {
      price: "desc",
    };
  }

  const products = await prisma.product.findMany({
    where,

    include: {
      category: true,
    },

    skip,

    take: Number(limit),

    orderBy,
  });

  const total = await prisma.product.count({
    where,
  });

  return {
    products,

    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getSingleProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },

    include: {
      category: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};


export const getSingleProductBySlug = async (slug) => {
  const product = await prisma.product.findUnique({
    where: { slug },

    include: {
      category: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
export const updateProduct = async (id, data) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  return prisma.product.update({
    where: { id },

    data,

    include: {
      category: true,
    },
  });
};

export const deleteProduct = async (id) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  return prisma.product.delete({
    where: { id },
  });
};
