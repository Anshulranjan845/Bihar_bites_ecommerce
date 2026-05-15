import prisma from "../../lib/prisma.js";

export const getProfile = async (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const updateProfile = async (userId, data) => {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      name: data.name,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const addAddress = async (userId, data) => {
  return prisma.address.create({
    data: {
      ...data,

      userId,
    },
  });
};

export const getAddresses = async (userId) => {
  return prisma.address.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteAddress = async (addressId, userId) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return prisma.address.delete({
    where: {
      id: addressId,
    },
  });
};
