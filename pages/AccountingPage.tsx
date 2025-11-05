import React, { useState, useMemo, useEffect, useCallback } from 'react';
// FIX: Import the Handshake icon from lucide-react.
import { FileText, Calendar, Store, Loader, DollarSign, ShoppingCart, BarChart2, ListChecks, Printer, AlertTriangle, Handshake } from 'lucide-react';
import { Sale, Payment, Customer, CreditTransaction } from '../../types';
import Table, { Column } from '../components/ui/Table';
import DashboardCard from '../components/dashboard/DashboardCard';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatting';
import DetailedSalesReport from '../components/accounting/DetailedSalesReport';

const getStatusBadge = (status: Sale['status']) => {
  switch (status) {
    case 'Paid':
      return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
    case 'Pending':
      return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">{status}</span>;
    case 'Refunded':
      return <span className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-full">{status}</span>;
    case 'Credit':
        return <span className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900 rounded-full">{status}</span>;
    default:
      return null;
  }
};

const SalesSummaryReport: React.FC<{sales: Sale[], currency: string}> = ({ sales, currency }) => {
    const summary = useMemo(() => {
        const paidSales = sales.filter(s => s.status === 'Paid');
        const totalRevenue = paidSales.reduce((acc, s) => acc + s.amount, 0);
        return { totalRevenue, paidSalesCount: paidSales.length, totalSales: sales.length, grandTotalAmount: sales.reduce((acc, s) => acc + s.amount, 0), refundedSales: sales.filter(s => s.status === 'Refunded').length, creditSales: sales.filter(s => s.status === 'Credit').length };
    }, [sales]);
    
    const paymentMethodBreakdown = useMemo(() => {
        const breakdown: Record<string, number> = {};
        sales.flatMap(s => s.payments).forEach(p => {
            breakdown[p.method] = (breakdown[p.method] || 0) + p.amount;
        });
        return breakdown;
    }, [sales]);

    const columns: Column<Sale>[] = [
        { header: 'Sale ID', accessor: 'id', sortable: true },
        { header: 'Date', accessor: 'date', sortable: true, render: (row) => new Date(row.date).toLocaleString() },
        { header: 'Customer', accessor: 'customerName', sortable: true },
        { header: 'Branch', accessor: 'branch', sortable: true },
        { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
        { header: 'Amount', accessor: 'amount', sortable: true, render: (row) => <div className="text-right font-medium">{formatCurrency(row.amount, currency)}</div> },
    ];

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Total Revenue (Paid)" value={formatCurrency(summary.totalRevenue, currency)} change={`${summary.paidSalesCount} paid sales`} icon={<DollarSign className="text-green-500" />} />
                <DashboardCard title="Total Sales" value={`${summary.totalSales}`} change={`incl. ${summary.creditSales} on credit`} icon={<ShoppingCart className="text-blue-500" />} />
                <DashboardCard title="Card/Transfer Payments" value={formatCurrency((paymentMethodBreakdown['Card'] || 0) + (paymentMethodBreakdown['Bank Transfer'] || 0), currency)} change="processed" icon={<BarChart2 className="text-yellow-500" />} />
                <DashboardCard title="Refunds" value={`${summary.refundedSales}`} change="processed" icon={<ListChecks className="text-red-500" />} />
            </div>
             <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Sales Log</h2>
                <Table columns={columns} data={sales} />
            </div>
        </div>
    );
};

const CreditSalesReport: React.FC<{sales: Sale[], currency: string, customers: Customer[], creditTransactions: CreditTransaction[]}> = ({ sales, currency, customers, creditTransactions }) => {
    const customerCreditData = useMemo(() => {
        const creditSalesByCustomer: Record<string, { customerName: string; totalCredit: number; salesCount: number; }> = {};

        sales.filter(s => s.status === 'Credit').forEach(sale => {
            const customerId = sale.customerId || sale.customerName;
            if (!creditSalesByCustomer[customerId]) {
                creditSalesByCustomer[customerId] = {
                    customerName: sale.customerName,
                    totalCredit: 0,
                    salesCount: 0,
                };
            }
            creditSalesByCustomer[customerId].totalCredit += sale.amount;
            creditSalesByCustomer[customerId].salesCount++;
        });

        return Object.values(creditSalesByCustomer).map(data => {
            const customer = customers.find(c => c.name === data.customerName);
            const payments = creditTransactions.filter(t => t.customerId === customer?.id && t.type === 'Payment').reduce((sum, t) => sum + t.amount, 0);
            return {
                ...data,
                paymentsReceived: Math.abs(payments),
                outstanding: (customer?.creditBalance || 0),
            };
        });
    }, [sales, customers, creditTransactions]);

    type CustomerCreditRow = (typeof customerCreditData)[0] & { id: string };

    const columns: Column<CustomerCreditRow>[] = [
        { header: 'Customer', accessor: 'customerName', sortable: true },
        { header: 'Credit Sales', accessor: 'salesCount', sortable: true, render: row => `${row.salesCount} sale(s)` },
        { header: 'Total Credit Extended', accessor: 'totalCredit', sortable: true, render: row => formatCurrency(row.totalCredit, currency) },
        { header: 'Payments Received', accessor: 'paymentsReceived', sortable: true, render: row => formatCurrency(row.paymentsReceived, currency) },
        { header: 'Current Outstanding', accessor: 'outstanding', sortable: true, render: row => formatCurrency(row.outstanding, currency) },
    ];

    const totalCreditExtended = customerCreditData.reduce((sum, d) => sum + d.totalCredit, 0);

    return (
        <div className="space-y-6">
            <DashboardCard title="Total Credit Extended" value={formatCurrency(totalCreditExtended, currency)} change={`Across ${customerCreditData.length} customers`} icon={<Handshake className="text-blue-500" />} />
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Credit Sales by Customer</h2>
                <Table columns={columns} data={customerCreditData.map(d => ({...d, id: d.customerName}))} />
            </div>
        </div>
    );
};

const EndOfDayReport: React.FC<{sales: Sale[], currency: string, isSingleDay: boolean}> = ({ sales, currency, isSingleDay }) => {
    const [openingFloat, setOpeningFloat] = useState('100.00');
    const [actualCash, setActualCash] = useState('');
    
    const eodData = useMemo(() => {
        const paymentBreakdown = sales.flatMap(s => s.payments).reduce((acc, p) => {
            acc[p.method] = (acc[p.method] || 0) + p.amount;
            return acc;
        }, {} as Record<string, number>);

        const cashSales = paymentBreakdown['Cash'] || 0;
        const cardSales = paymentBreakdown['Card'] || 0;
        const transferSales = paymentBreakdown['Bank Transfer'] || 0;
        const creditSales = paymentBreakdown['Credit'] || 0;
        
        const float = parseFloat(openingFloat) || 0;
        const counted = parseFloat(actualCash) || null;
        const expectedCash = float + cashSales;
        const difference = counted !== null ? counted - expectedCash : null;

        return { cashSales, cardSales, transferSales, creditSales, expectedCash, difference };
    }, [sales, openingFloat, actualCash]);
    
    if (!isSingleDay) {
        return (
            <div className="bg-surface border border-border rounded-xl p-12 shadow-lg text-center">
                <AlertTriangle className="mx-auto text-yellow-400" size={40}/>
                <h3 className="mt-4 text-xl font-semibold">Invalid Date Range</h3>
                <p className="text-text-secondary mt-2">The End of Day report can only be generated for a single day. Please adjust your date filters.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-lg space-y-4">
                <h2 className="text-xl font-semibold text-text-primary">Sales & Payment Summary</h2>
                <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-background rounded"><span>Total Sales</span> <span className="font-bold">{formatCurrency(sales.reduce((sum, s) => sum + s.amount, 0), currency)}</span></div>
                    <div className="flex justify-between p-2 bg-background rounded"><span>Cash Sales</span> <span className="font-bold">{formatCurrency(eodData.cashSales, currency)}</span></div>
                    <div className="flex justify-between p-2 bg-background rounded"><span>Card Sales</span> <span className="font-bold">{formatCurrency(eodData.cardSales, currency)}</span></div>
                    <div className="flex justify-between p-2 bg-background rounded"><span>Bank Transfers</span> <span className="font-bold">{formatCurrency(eodData.transferSales, currency)}</span></div>
                    <div className="flex justify-between p-2 bg-background rounded"><span>Credit Sales</span> <span className="font-bold">{formatCurrency(eodData.creditSales, currency)}</span></div>
                </div>
            </div>
             <div className="md:col-span-1 bg-surface border border-border rounded-xl p-6 shadow-lg space-y-4">
                <h2 className="text-xl font-semibold text-text-primary">Cash Reconciliation</h2>
                <div><label className="text-sm">Opening Float</label><input type="number" value={openingFloat} onChange={e => setOpeningFloat(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" /></div>
                <div><label className="text-sm">Expected in Drawer</label><input type="text" value={formatCurrency(eodData.expectedCash, currency)} readOnly className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-text-secondary" /></div>
                <div><label className="text-sm">Actual Cash Counted</label><input type="number" value={actualCash} onChange={e => setActualCash(e.target.value)} placeholder="0.00" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" /></div>
                 <div className={`p-3 rounded text-center font-bold ${eodData.difference === null ? 'bg-background' : eodData.difference === 0 ? 'bg-green-900/80' : 'bg-red-900/80'}`}>
                    <p className="text-sm">Difference</p>
                    <p className="text-2xl">{eodData.difference !== null ? formatCurrency(eodData.difference, currency) : '-'}</p>
                </div>
            </div>
        </div>
    );
};

const AccountingPage: React.FC = () => {
  const { currency, products, branches: allBranches, recentSales, customers, creditTransactions } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [reportType, setReportType] = useState<'sales_summary' | 'detailed_sales' | 'credit_sales' | 'end_of_day'>('sales_summary');

  const [reportData, setReportData] = useState<Sale[] | null>(null);

  const branches = useMemo(() => [...new Set(recentSales.map(s => s.branch))], [recentSales]);

  const handleGenerateReport = useCallback(() => {
    let filtered = [...recentSales];
    if (selectedBranch !== 'all') filtered = filtered.filter(sale => sale.branch === selectedBranch);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);
    if (start || end) {
        filtered = filtered.filter(sale => {
            const saleDate = new Date(sale.date);
            if (start && end) return saleDate >= start && saleDate <= end;
            if (start) return saleDate >= start;
            if (end) return saleDate <= end;
            return true;
        });
    }
    setReportData(filtered);
  }, [recentSales, selectedBranch, startDate, endDate]);

  useEffect(() => {
    if (recentSales.length > 0 && !reportData) handleGenerateReport();
  }, [recentSales, reportData, handleGenerateReport]);

  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-96"><Loader className="animate-spin text-primary" size={40} /></div>;
    return (
      <>
        <div className="flex items-center gap-2 p-1 rounded-lg bg-surface border border-border w-full md:w-auto mb-6">
            {(['sales_summary', 'detailed_sales', 'credit_sales', 'end_of_day'] as const).map(type => (
                <button key={type} onClick={() => { setReportType(type); }} className={`px-4 py-2 text-sm rounded-md transition-colors w-full flex items-center justify-center gap-2 ${reportType === type ? 'bg-primary text-white' : 'hover:bg-border/50 text-text-secondary'}`}>
                    {type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                </button>
            ))}
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Report Generator</h2>
          {error && <p className="text-sm text-yellow-400 bg-yellow-900/50 p-3 rounded-md mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div><label className="text-sm font-medium text-text-secondary block mb-2">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full pl-3 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"/></div>
            <div><label className="text-sm font-medium text-text-secondary block mb-2">End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full pl-3 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"/></div>
            <div><label className="text-sm font-medium text-text-secondary block mb-2">Branch</label><select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="w-full appearance-none px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"><option value="all">All Branches</option>{branches.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
            <button onClick={handleGenerateReport} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors h-10"><FileText size={16} /> Generate Report</button>
          </div>
        </div>

        <div className="mt-8">
            {reportData ? (
                 reportData.length > 0 || reportType === 'end_of_day' ? (
                    <>
                        {reportType === 'sales_summary' && <SalesSummaryReport sales={reportData} currency={currency} />}
                        {reportType === 'detailed_sales' && <DetailedSalesReport sales={reportData} products={products} currency={currency} branches={allBranches} />}
                        {reportType === 'credit_sales' && <CreditSalesReport sales={reportData} currency={currency} customers={customers} creditTransactions={creditTransactions} />}
                        {/* FIX: Complete the component by adding the EndOfDayReport, fallback UI, and closing tags. */}
                        {reportType === 'end_of_day' && <EndOfDayReport sales={reportData} currency={currency} isSingleDay={startDate === endDate} />}
                    </>
                ) : (
                    <div className="text-center py-12 text-text-secondary">No sales data found for the selected filters.</div>
                )
            ) : null}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Accounting & Reports</h1>
      {renderContent()}
    </div>
  );
};

export default AccountingPage;