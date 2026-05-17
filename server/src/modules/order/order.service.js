import { getCache, setCache, clearCacheByPrefix } from "../../utils/cache.js";
import prisma from "../../lib/prisma.js";

export const createOrder = async (userId, addressId, paymentMethod) => {
  console.log("CHECKOUT USER:", userId);

  // GET USER CART
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },

    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  console.log("CART:", JSON.stringify(cart, null, 2));

  // CHECK EMPTY CART
  if (!cart || cart.cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // CHECK ADDRESS
  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  // CALCULATE TOTAL
  let totalAmount = 0;

  for (const item of cart.cartItems) {
    // STOCK VALIDATION
    if (item.quantity > item.product.stock) {
      throw new Error(`${item.product.name} is out of stock`);
    }

    totalAmount += Number(item.product.price) * item.quantity;
  }

  // CREATE ORDER ONLY
  // DO NOT CLEAR CART YET
  // DO NOT REDUCE STOCK YET
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,

        addressId,

        paymentMethod,

        totalAmount,

        orderStatus: "PENDING",

        orderItems: {
          create: cart.cartItems.map((item) => ({
            productId: item.productId,

            quantity: item.quantity,

            price: item.product.price,
          })),
        },
      },

      include: {
        orderItems: true,
      },
    });

    return createdOrder;
  });

  clearCacheByPrefix("orders:");
  return order;
};

// GET USER ORDERS
export const getUserOrders = async (userId) => {
  const key = `orders:user:${userId}`;
  const cached = getCache(key);
  if (cached) return cached;
  const data = await prisma.order.findMany({
    where: {
      userId,
    },

    include: {
      orderItems: {
        include: {
          product: true,
        },
      },

      address: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
  setCache(key, data, 45000);
  return data;
};


export const getAllOrders = async () => {
  const key = "orders:all";
  const cached = getCache(key);
  if (cached) return cached;
  const data = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      address: true,
      orderItems: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  setCache(key, data, 45000);
  return data;
};


export const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      address: true,
      orderItems: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};
