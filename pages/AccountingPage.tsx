import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FileText, Calendar, Store, Loader, DollarSign, ShoppingCart, BarChart2, ListChecks, Printer } from 'lucide-react';
import { Sale, Payment } from '../types';
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

// FIX: Define missing report components to resolve compilation errors.
const CreditSalesReport: React.FC<{sales: Sale[], currency: string}> = ({ sales, currency }) => {
    return <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">Credit Sales Report coming soon.</div>;
};

const EndOfDayReport: React.FC<{sales: Sale[], currency: string}> = ({ sales, currency }) => {
    return <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">End of Day Report coming soon.</div>;
};

const AccountingPage: React.FC = () => {
  const { currency, products, branches: allBranches, recentSales } = useAppContext();
  const [sales, setSales] = useState<Sale[]>(recentSales);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [reportType, setReportType] = useState<'sales_summary' | 'detailed_sales' | 'credit_sales' | 'end_of_day'>('sales_summary');

  const [reportData, setReportData] = useState<Sale[] | null>(null);

  // FIX: Use sales data from context instead of re-fetching
  useEffect(() => {
    setSales(recentSales);
  }, [recentSales]);

  const branches = useMemo(() => [...new Set(sales.map(s => s.branch))], [sales]);

  const handleGenerateReport = useCallback(() => {
    let filtered = [...sales];
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
  }, [sales, selectedBranch, startDate, endDate]);

  useEffect(() => {
    if (sales.length > 0 && !reportData) handleGenerateReport();
  }, [sales, reportData, handleGenerateReport]);

  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-96"><Loader className="animate-spin text-primary" size={40} /></div>;
    return (
      <>
        <div className="flex items-center gap-2 p-1 rounded-lg bg-surface border border-border w-full md:w-auto mb-6">
            {(['sales_summary', 'detailed_sales', 'credit_sales', 'end_of_day'] as const).map(type => (
                <button key={type} onClick={() => { setReportType(type); setReportData(null); }} className={`px-4 py-2 text-sm rounded-md transition-colors w-full flex items-center justify-center gap-2 ${reportType === type ? 'bg-primary text-white' : 'hover:bg-border/50 text-text-secondary'}`}>
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
                 reportData.length > 0 ? (
                    <>
                        {reportType === 'sales_summary' && <SalesSummaryReport sales={reportData} currency={currency} />}
                        {reportType === 'detailed_sales' && <DetailedSalesReport sales={reportData} products={products} currency={currency} branches={allBranches} />}
                        {reportType === 'credit_sales' && <CreditSalesReport sales={reportData} currency={currency} />}
                        {reportType === 'end_of_day' && <EndOfDayReport sales={reportData} currency={currency} />}
                    </>
                 ) : (
                    <div className="bg-surface border border-border rounded-xl shadow-lg p-12 text-center text-text-secondary">No data found for the selected filters.</div>
                 )
            ) : (
                <div className="bg-surface border border-border rounded-xl shadow-lg p-12 text-center text-text-secondary">Please select filters and click "Generate Report".</div>
            )}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
      {renderContent()}
    </div>
  );
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
                <DashboardCard title="Payment Methods" value={formatCurrency(paymentMethodBreakdown['Card'] || 0, currency)} change="Card transactions" icon={<BarChart2 className="text-yellow-500" />} />
                <DashboardCard title="Refunds" value={`${summary.refundedSales}`} change="processed" icon={<ListChecks className="text-red-500" />} />
            </div>
             <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Sales Log</h2>
                <Table columns={columns} data={sales} />
            </div>
        </div>
    );
};

export default AccountingPage;