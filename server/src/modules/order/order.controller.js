import { createOrder, getUserOrders, getAllOrders } from "./order.service.js";

export const checkout = async (req, res) => {
  try {
    const order = await createOrder(req.user.userId, req.body.addressId, req.body.paymentMethod);
    res.status(201).json({ success: true, message: "Order created successfully", data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await getUserOrders(req.user.userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
