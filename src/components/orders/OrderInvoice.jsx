import { Link, useParams } from "react-router-dom";
import { useOrders } from "../../context/OrdersContext.jsx";
import dayjs from "dayjs";

function OrderInvoice() {
  const { id } = useParams();
  const { orders } = useOrders();

  const order = orders.find(o => o.id == Number(id));

  if (!order) return <div className="p-6">Order not found</div>;

  const { shippingAddress, items, subtotal, shipping, tax, total } = order;

  return (
    <div className="invoice-container p-10 max-w-4xl mx-auto bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      
      {/* Logo + Invoice Title */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-black shadow-md print:text-black print:shadow-none print:border">
            ST
          </span>
          <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent print:text-black">
            SkyTech
          </span>
        </Link>
        <h1 className="text-3xl font-bold mr-[3.25rem]">Invoice</h1>
      </div>

      {/* Bill From / Bill To */}
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Bill From:</h2>
          <p className="text-sm">SkyTech Store</p>
          <p className="text-sm">123 Tech Street</p>
          <p className="text-sm">Dhaka, Bangladesh</p>
          <p className="text-sm">Email: support@skytech.com</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
          <p className="text-sm">{shippingAddress.name}</p>
          <p className="text-sm">{shippingAddress.line1}, {shippingAddress.line2}</p>
          <p className="text-sm">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
          <p className="text-sm">{shippingAddress.country}</p>
        </div>
      </div>

      {/* Divider under Bill Block */}
      <hr className="border-neutral-300 mb-6" />

      {/* Order Info */}
      <div className="mb-6 flex justify-between text-sm">
        <div>
          <p><strong>Invoice #:</strong> {order.orderNumber}</p>
          <p><strong>Date:</strong> {dayjs(order.placedAt).format("YYYY-MM-DD HH:mm")}</p>
        </div>
        <div>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
      </div>
            <hr className="border-neutral-300 mb-6" />

      {/* Items Table */}
      <table className="w-full border-collapse mb-8 text-sm">
        <thead className="bg-neutral-100 dark:bg-neutral-800">
          <tr>
            <th className="p-3 text-left border-b">Item</th>
            <th className="p-3 text-left border-b">Quantity</th>
            <th className="p-3 text-left border-b">Unit Price</th>
            <th className="p-3 text-left border-b">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, index) => (
            <tr key={index} className="border-b hover:bg-neutral-50 dark:hover:bg-neutral-700">
              <td className="p-3">{i.title}</td>
              <td className="p-3">{i.quantity}</td>
              <td className="p-3">${i.price.toFixed(2)}</td>
              <td className="p-3">${(i.price * i.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-xs text-sm">
          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Shipping:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-300 pt-2 font-semibold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* QR Code + Bank Details / Signature Row */}
      <div className="flex justify-between mt-8 mb-6 items-center">
        {/* QR + Bank */}
        <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
                    <h2 className="text-sm font-semibold mb-1 blo">Scan to Pay:</h2>
          <img src="../../../assets/qr.png" alt="QR Code" className="h-24 w-24 mb-2" />
            </div>

          <div className="text-sm">
            <h2 className="font-semibold mb-1">Bank Details</h2>
            <p>Bank: ABC Bank</p>
            <p>Account #: 782459739212</p>
            <p>IFSC: ABC0001345</p>
          </div>
        </div>

        {/* Signature */}
        <div className="text-center">
          <img src="../../../assets/sign.jpg" alt="Signature" className="h-10 mb-1" />
          <p className="text-sm font-semibold">Mozammel Haq</p>
          <p className="text-sm">Owner</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded text-center text-sm">
        <p>SkyTech Electronics & Gadgets Ltd., 123 Tech Street, Dhaka, Bangladesh</p>
        <p>Email: support@skytech.com | Phone: +880 1234 5678</p>
      </div>

      {/* Print Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-neutral-900 text-white rounded-full dark:bg-neutral-700 hover:opacity-90 transition"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}

export default OrderInvoice;
