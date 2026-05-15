import prisma from "../../lib/prisma.js";

export const getDashboardStats = async () => {
  const totalUsers = await prisma.user.count();

  const totalProducts = await prisma.product.count();

  const totalOrders = await prisma.order.count();

  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },

    where: {
      paymentStatus: "PAID",
    },
  });

  const pendingOrders = await prisma.order.count({
    where: {
      orderStatus: "PENDING",
    },
  });

  return {
    totalUsers,

    totalProducts,

    totalOrders,

    pendingOrders,

    totalRevenue: totalRevenue._sum.totalAmount || 0,
  };
};

export const getRecentOrders = async () => {
  return prisma.order.findMany({
    take: 10,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: true,

      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const getLowStockProducts = async () => {
  return prisma.product.findMany({
    where: {
      stock: {
        lte: 5,
      },
    },

    orderBy: {
      stock: "asc",
    },
  });
};

export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: true,

      address: true,

      orderItems: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateOrderStatus = async (orderId, status) => {
  return prisma.order.update({
    where: {
      id: orderId,
    },

    data: {
      orderStatus: status,
    },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};
