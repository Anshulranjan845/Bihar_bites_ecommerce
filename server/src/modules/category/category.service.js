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

  const category = await prisma.category.create({
    data,
  });

  return category;
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCategoryById = async (id) => {
  return prisma.category.findUnique({
    where: {
      id,
    },
  });
};

export const updateCategory = async (id, data) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      id: {
        not: id,
      },
      OR: [{ name: data.name }, { slug: data.slug }],
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await prisma.category.update({
    where: {
      id,
    },
    data,
  });

  return category;
};

export const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await prisma.category.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
};
