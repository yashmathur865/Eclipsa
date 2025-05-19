const Order = require("../models/Order");

//Get All orders for a particular user
exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

//Get detail anout a particular order
exports.getOrderById = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId).populate("products.product user");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

//Updating order status
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status, trackingNumber } = req.body;

  const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled', 'returned'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        trackingNumber: trackingNumber || undefined
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, message: "Order updated", order: updatedOrder });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return res.status(500).json({ success: false, message: "Failed to update order" });
  }
};


//Get details about all the orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user")
      .populate("products.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};


