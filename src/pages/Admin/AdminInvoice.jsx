// AdminInvoicePage.jsx
import { Helmet } from 'react-helmet-async';
import OrderInvoice from '../../components/orders/OrderInvoice.jsx';

function AdminInvoicePage() {
  return (
    <>
      <Helmet>
        <title>Invoice — SkyTech</title>
      </Helmet>
      <OrderInvoice />
    </>
  );
}

export default AdminInvoicePage;
