import React from 'react';
import { paymentHistory } from '../../data/mockData';
import PaymentHistoryTable from '../../components/settings/PaymentHistoryTable';

const PaymentHistoryPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-text-primary mb-1">Payment History</h2>
            <p className="text-text-secondary">View and download your past invoices.</p>
            <PaymentHistoryTable history={paymentHistory} />
        </div>
    );
};

export default PaymentHistoryPage;
