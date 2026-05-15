import prisma from "../../lib/prisma.js";
import cashfree from "../../config/cashfree.js";

export const createCashfreeOrder = async (orderId, user) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const request = {
    order_amount: Number(order.totalAmount),

    order_currency: "INR",

    order_id: order.id,

    customer_details: {
      customer_id: user.userId,
      customer_name: user.name || "Customer",
      customer_email: user.email || "customer@email.com",
      customer_phone: "9999999999",
    },

    order_meta: {
      return_url: "http://localhost:5173/payment-success?order_id={order_id}",
    },
  };

  const response = await cashfree.PGCreateOrder(request);

  await prisma.order.update({
    where: {
      id: order.id,
    },

    data: {
      gatewayOrderId: response.data.cf_order_id,
    },
  });

  return response.data;
};

export const verifyPayment = async (orderId) => {
  const response = await cashfree.PGFetchOrder(orderId);

  console.log("CASHFREE VERIFY RESPONSE:", response.data);

  const paymentStatus = response.data.order_status;

  if (paymentStatus === "PAID") {
    await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
      },
    });

    return {
      success: true,
      status: "PAID",
      message: "Payment successful",
    };
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },

    data: {
      paymentStatus: "FAILED",
      orderStatus: "CANCELLED",
    },
  });

  return {
    success: false,
    status: paymentStatus,
    message: "Payment failed or cancelled",
  };
};
