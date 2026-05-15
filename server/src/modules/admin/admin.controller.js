import {
  getAllOrders,
  getAllUsers,
  getDashboardStats,
  getLowStockProducts,
  getRecentOrders,
  updateOrderStatus,
} from "./admin.service.js";

export const dashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const recentOrders = async (req, res) => {
  try {
    const orders = await getRecentOrders();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const lowStockProducts = async (req, res) => {
  try {
    const products = await getLowStockProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changeOrderStatus = async (req, res) => {
  try {
    const order = await updateOrderStatus(req.params.id, req.body.status);

    res.status(200).json({
      success: true,
      message: "Order status updated",

      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const allUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
