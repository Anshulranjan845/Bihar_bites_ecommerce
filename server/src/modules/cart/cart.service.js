import prisma from "../../lib/prisma.js";

export const addToCart = async (userId, productId, quantity) => {
  console.log("ADD TO CART USER:", userId);
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.isAvailable) {
    throw new Error("Product unavailable");
  }

  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },

    include: {
      cartItems: true,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },

      include: {
        cartItems: true,
      },
    });
  }

  const existingCartItem = cart.cartItems.find(
    (item) => item.productId === productId,
  );

  if (existingCartItem) {
    await prisma.cartItem.update({
      where: {
        id: existingCartItem.id,
      },

      data: {
        quantity: existingCartItem.quantity + quantity,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return getCart(userId);
};

export const getCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },

    include: {
      cartItems: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  return cart;
};

export const updateCartItem = async (cartItemId, quantity) => {
  return prisma.cartItem.update({
    where: {
      id: cartItemId,
    },

    data: {
      quantity,
    },
  });
};

export const removeCartItem = async (cartItemId) => {
  return prisma.cartItem.delete({
    where: {
      id: cartItemId,
    },
  });
};

export const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });
};
