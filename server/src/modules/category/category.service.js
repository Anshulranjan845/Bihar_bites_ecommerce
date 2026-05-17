import { getCache, setCache, clearCacheByPrefix } from "../../utils/cache.js";
import prisma from "../../lib/prisma.js";

export const createCategory = async (data) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ name: data.name }, { slug: data.slug }],
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await prisma.category.create({ data });
  return category;
};

export const getAllCategories = async () =>
  prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });

export const updateCategory = async (id, data) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      id: { not: id },
      OR: [{ name: data.name }, { slug: data.slug }],
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id, reassignedCategoryId) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: { select: { id: true, name: true } } },
  });

  if (!category || category.isDeleted) throw new Error("Category not found");

  if (category.products.length && !reassignedCategoryId) {
    const alternatives = await prisma.category.findMany({
      where: { id: { not: id }, isDeleted: false },
      select: { id: true, name: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
    const error = new Error("Category has products. Reassign products before deleting.");
    error.code = "CATEGORY_REASSIGN_REQUIRED";
    error.meta = {
      affectedProducts: category.products,
      suggestedCategories: alternatives,
    };
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    if (category.products.length && reassignedCategoryId) {
      const target = await tx.category.findUnique({ where: { id: reassignedCategoryId } });
      if (!target || target.isDeleted) throw new Error("Target category is invalid");
      await tx.product.updateMany({ where: { categoryId: id }, data: { categoryId: reassignedCategoryId } });
    }
    await tx.category.update({ where: { id }, data: { isDeleted: true } });
  });
  clearCacheByPrefix("categories:");
  clearCacheByPrefix("products:");
};
