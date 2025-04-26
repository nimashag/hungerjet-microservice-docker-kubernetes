import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./RestaurantAdminLayout";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";

interface Restaurant {
  _id: string;
  name: string;
}

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

const RestaurantOrders = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/api/restaurants/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRestaurant(response.data[0]);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  };

  const fetchOrders = async (restaurantId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3002/api/orders/restaurant/${restaurantId}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchRestaurant();
    };
    init();
  }, []);

  useEffect(() => {
    if (restaurant?._id) {
      fetchOrders(restaurant._id);
    }
  }, [restaurant]);

  const toggleOrderStatus = async (orderId: string, currentStatus: string) => {
    try {
      let newStatus = "";

      if (currentStatus === "Pending") newStatus = "Confirmed";
      else if (currentStatus === "Confirmed") newStatus = "Preparing";
      else if (currentStatus === "Preparing") newStatus = "Waiting for Pickup";
      else return; // No further action if already Waiting for Pickup

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3002/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();

    // Centered Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Order Summary Report", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    // Info Section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Bold Labels
    doc.setFont("helvetica", "bold");
    doc.text("Restaurant Name:", 14, 32);
    doc.text("Address:", 14, 40);
    doc.text("Date:", 14, 48);

    // Normal Text
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`${restaurant?.name || "N/A"}`, 55, 32);
    doc.text(`${(restaurant as any)?.address || "N/A"}`, 55, 40); // Cast if address is not typed
    doc.text(new Date().toLocaleDateString(), 55, 48);

    // Flatten orders into item-level rows
    const tableData = orders.flatMap((order) =>
      order.items.map((item) => [
        order._id.slice(-6), // Short Order ID
        item.name,
        item.quantity,
        `$${order.totalAmount.toFixed(2)}`,
        order.paymentStatus,
        new Date(order.createdAt).toLocaleDateString(),
        order.status,
      ])
    );

    autoTable(doc, {
      startY: 60,
      head: [
        ["Order ID", "Items", "Quantity", "Total", "Payment", "Date", "Status"],
      ],
      body: tableData,
      styles: {
        fontSize: 10,
        textColor: [60, 60, 60],
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [93, 156, 236], // Light blue
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255], // Light subtle blue
      },
      margin: { top: 60 },
    });

    doc.save("Order_Summary_Report.pdf");
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold  text-gray-800">Customer Orders</h1>
          <button
            onClick={generateReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            Generate Report
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-3">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700">
                  Order Status
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-neutral-800">
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="px-6 py-4 font-medium text-neutral-800">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">
                    {order.items.map((item, index) => (
                      <div key={index}>{item.name}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4  font-medium text-neutral-600">
                    {order.items.map((item, index) => (
                      <div key={index}>{item.quantity}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">
                    ${order.totalAmount}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-md font-medium ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-md font-medium text-neutral-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-600">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-row items-center gap-4"
                    >
                      {/* Status Badge */}
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-md font-semibold
                      ${
                        order.status === "Pending"
                          ? "bg-red-100 text-red-700"
                          : order.status === "Confirmed"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Preparing"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Waiting for Pickup"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      >
                        {order.status}
                      </span>

                      {/* Next Step Button */}
                      {order.status !== "Waiting for Pickup" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            toggleOrderStatus(order._id, order.status)
                          }
                          disabled={order.paymentStatus !== "Paid"} // << only allow if Paid
                          className={`inline-block px-4 py-2 rounded-full text-md font-semibold shadow transition-all duration-300
                        ${
                          order.paymentStatus !== "Paid"
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : order.status === "Pending"
                            ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                            : order.status === "Confirmed"
                            ? "bg-blue-400 hover:bg-blue-500 text-white"
                            : order.status === "Preparing"
                            ? "bg-green-400 hover:bg-green-500 text-white"
                            : ""
                        }`}
                        >
                          {order.paymentStatus !== "Paid"
                            ? "Waiting for Payment"
                            : "Move to Next Step"}
                        </motion.button>
                      )}
                    </motion.div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-6 text-center text-sm text-neutral-500">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RestaurantOrders;
