import { createCashfreeOrder, verifyPayment } from "./payment.service.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const payment = await createCashfreeOrder(req.body.orderId, req.user);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyCashfreePayment = async (req, res) => {
  try {
    const result = await verifyPayment(req.body.orderId);

    res.status(200).json({
      success: true,
      message: "Payment verified",

      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
