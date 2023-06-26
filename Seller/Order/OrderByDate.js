const OrderModal = require("../../Users/Model/OrderModal");
const AsyncFunc = require("../../utils/AsyncFunc");

const OrderByDate = AsyncFunc(async (req, res, next) => {
  // Calculate the date 10 days ago
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  // Find all orders within the specified date range
  const orders = await OrderModal.find({
    created_at: {
      $gte: tenDaysAgo, // Greater than or equal to ten days ago
      $lte: new Date(), // Less than or equal to today
    },
  });

  if (orders.length === 0) {
    return res.status(400).json({ message: "No Order has been found." });
  }
  // Group the orders by date
  const ordersByDate = {};
  orders.forEach((order) => {
    const date = order.created_at.toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
    if (ordersByDate[date]) {
      ordersByDate[date].push(order);
    } else {
      ordersByDate[date] = [order];
    }
  });

  // Calculate the total orders on each date
  const totalOrdersByDate = [];
  let id = 1;
  console.log(ordersByDate);
  for (const date in ordersByDate) {
    totalOrdersByDate.push({
      id,
      date,
      total: ordersByDate[date].length,
    });
    id++;
  }
  return res.status(200).json({ data: totalOrdersByDate });
});

module.exports = OrderByDate;
