import React from 'react';
import { Invoice, BusinessProfile } from '../../types';
import { formatCurrency } from '../../utils/formatting';

interface InvoiceTemplateProps {
    invoice: Invoice;
    businessProfile: BusinessProfile;
    currency: string;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice, businessProfile, currency }) => {
    
    // Simplified line items for demo purposes
    const lineItems = [
        { description: 'Product/Service A', quantity: 2, unitPrice: 500 },
        { description: 'Product/Service B', quantity: 1, unitPrice: 200 },
    ];
    if (invoice.id === 'inv_1003') {
        lineItems.splice(0, 2, { description: 'Bookkeeping Services', quantity: 1, unitPrice: 450 });
    }

    const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = invoice.amount;

    const getStatusStyles = () => {
        switch (invoice.status) {
            case 'Paid': return 'text-green-600 bg-green-100 border-green-500';
            case 'Due': return 'text-blue-600 bg-blue-100 border-blue-500';
            case 'Overdue': return 'text-red-600 bg-red-100 border-red-500';
        }
    }

    return (
        <div className="print-area bg-white text-gray-800 p-10 font-sans printable-report-wrapper">
            {/* Header */}
            <header className="flex justify-between items-start mb-10">
                <div>
                    {businessProfile.logoUrl ? (
                        <img src={businessProfile.logoUrl} alt="Company Logo" className="h-16 mb-4"/>
                    ) : (
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{businessProfile.companyName}</h1>
                    )}
                    <p className="text-sm">{businessProfile.address}</p>
                    <p className="text-sm">{businessProfile.email} | {businessProfile.phone}</p>
                    {businessProfile.taxId && <p className="text-sm">Tax ID: {businessProfile.taxId}</p>}
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-light uppercase text-gray-400">Invoice</h2>
                    <p className="font-mono text-sm mt-2"># {invoice.id}</p>
                    <div className={`mt-4 inline-block font-bold py-1 px-3 border-2 rounded ${getStatusStyles()}`}>
                        {invoice.status.toUpperCase()}
                    </div>
                </div>
            </header>

            {/* Bill To & Dates */}
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Bill To</h3>
                    <p className="font-semibold text-lg">{invoice.customerName}</p>
                    <p>123 Customer Ave, Client City</p>
                </div>
                <div className="text-right">
                    <div className="mb-4">
                        <p className="text-sm font-bold text-gray-500">Issue Date</p>
                        <p>{new Date(invoice.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500">Due Date</p>
                        <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-10 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left font-bold text-gray-600">Description</th>
                        <th className="p-3 text-center font-bold text-gray-600">Qty</th>
                        <th className="p-3 text-right font-bold text-gray-600">Unit Price</th>
                        <th className="p-3 text-right font-bold text-gray-600">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {lineItems.map((item, index) => (
                        <tr key={index} className="border-b">
                            <td className="p-3">{item.description}</td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right">{formatCurrency(item.unitPrice, currency)}</td>
                            <td className="p-3 text-right">{formatCurrency(item.unitPrice * item.quantity, currency)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-10">
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>{formatCurrency(subtotal, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tax (8%):</span>
                        <span>{formatCurrency(tax, currency)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <span className="text-gray-900">Total Due:</span>
                        <span className="text-primary">{formatCurrency(total, currency)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center text-xs text-gray-500 border-t pt-4">
                <p>Thank you for your business!</p>
                <p>Please make payments to Bank: FlowPay Bank, Account: 1234567890. Use invoice number as reference.</p>
            </footer>
        </div>
    );
};

export default InvoiceTemplate;