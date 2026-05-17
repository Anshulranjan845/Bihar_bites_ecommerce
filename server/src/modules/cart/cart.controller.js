import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./cart.service.js";

export const addItem = async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }
    const cart = await addToCart(req.user.userId, req.body.productId, quantity);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const cart = await getCart(req.user.userId);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await updateCartItem(req.params.id, Number(req.body.quantity));

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeItem = async (req, res) => {
  try {
    await removeCartItem(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearUserCart = async (req, res) => {
  try {
    await clearCart(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
