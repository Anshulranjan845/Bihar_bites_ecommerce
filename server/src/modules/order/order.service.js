import prisma from "../../lib/prisma.js";

export const createOrder = async (userId, addressId, paymentMethod) => {
  console.log("CHECKOUT USER:", userId);
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
  if (!cart || cart.cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  let totalAmount = 0;

  for (const item of cart.cartItems) {
    if (item.quantity > item.product.stock) {
      throw new Error(`${item.product.name} is out of stock`);
    }

    totalAmount += Number(item.product.price) * item.quantity;
  }

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,

        addressId,

        paymentMethod,

        totalAmount,

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

    for (const item of cart.cartItems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },

        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return createdOrder;
  });

  return order;
};

export const getUserOrders = async (userId) => {
  return prisma.order.findMany({
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
};
