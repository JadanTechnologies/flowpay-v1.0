import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FileText, Calendar, Store, Loader, DollarSign, ShoppingCart, BarChart2, ListChecks } from 'lucide-react';
import { Sale } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { recentSales as mockSales } from '../data/mockData';
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

const AccountingPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currency, products } = useAppContext();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [reportType, setReportType] = useState<'sales_summary' | 'detailed_sales'>('sales_summary');

  const [reportData, setReportData] = useState<Sale[] | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError(null);
      try {
        if (isSupabaseConfigured) {
          // In a real app with a 'sales' table. This will fail gracefully if the table doesn't exist.
          const { data, error } = await supabase.from('sales').select('*');
          if (error) throw error;
          
          const formattedData = data.map((s: any) => ({
              id: s.id,
              customerName: s.customer_name,
              cashierName: s.cashier_name,
              date: new Date(s.created_at).toISOString(),
              amount: s.amount,
              status: s.status,
              branch: s.branch,
              items: s.items, // Assuming items are stored as JSON
              payments: s.payments, // Assuming payments are stored as JSON
          }));
          setSales(formattedData);
        } else {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
          setSales(mockSales);
        }
      } catch (err: any) {
        setError('Failed to fetch sales data from the database. Displaying mock data instead.');
        console.error(err);
        setSales(mockSales); // Fallback to mock data on error
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const branches = useMemo(() => {
    const uniqueBranches = [...new Set(sales.map(s => s.branch))];
    return uniqueBranches;
  }, [sales]);

  const handleGenerateReport = useCallback(() => {
    let filtered = [...sales];

    if (selectedBranch !== 'all') {
      filtered = filtered.filter(sale => sale.branch === selectedBranch);
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start) {
        start.setHours(0, 0, 0, 0);
    }
    if (end) {
        end.setHours(23, 59, 59, 999);
    }

    if (start || end) {
        filtered = filtered.filter(sale => {
            const saleDate = new Date(sale.date);
            if (start && end) {
                return saleDate >= start && saleDate <= end;
            }
            if (start) {
                return saleDate >= start;
            }
            if (end) {
                return saleDate <= end;
            }
            return true;
        });
    }

    setReportData(filtered);
  }, [sales, selectedBranch, startDate, endDate]);

  useEffect(() => {
    // Auto-generate report when sales data is first loaded.
    if (sales.length > 0 && !reportData) {
        handleGenerateReport();
    }
  }, [sales, reportData, handleGenerateReport]);


  const reportSummary = useMemo(() => {
    if (!reportData) return null;
    const paidSales = reportData.filter(sale => sale.status === 'Paid');
    const totalRevenue = paidSales.reduce((acc, sale) => acc + sale.amount, 0);
    const paidSalesCount = paidSales.length;
    const totalSales = reportData.length;
    const grandTotalAmount = reportData.reduce((sum, sale) => sum + sale.amount, 0);
    return { totalRevenue, paidSalesCount, totalSales, grandTotalAmount };
  }, [reportData]);

  const salesColumns: Column<Sale>[] = [
    {
      header: 'Customer',
      accessor: 'customerName',
      render: (row) => (
        <div>
          <div className="font-medium text-text-primary">{row.customerName}</div>
          <div className="text-sm text-text-secondary">ID: {row.id}</div>
        </div>
      )
    },
    { header: 'Date', accessor: 'date', sortable: true, render: (row) => new Date(row.date).toLocaleDateString() },
    { header: 'Branch', accessor: 'branch', sortable: true },
    { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
    {
      header: 'Amount',
      accessor: 'amount',
      sortable: true,
      render: (row) => <div className="text-right font-medium text-text-primary">{formatCurrency(row.amount, currency)}</div>
    }
  ];
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <Loader className="animate-spin text-primary" size={40} />
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center gap-2 p-1 rounded-lg bg-surface border border-border w-full md:w-auto mb-6">
            {(['sales_summary', 'detailed_sales'] as const).map((type) => (
                <button
                    key={type}
                    onClick={() => { setReportType(type); setReportData(null); }}
                    className={`px-4 py-2 text-sm rounded-md transition-colors w-full flex items-center justify-center gap-2 ${reportType === type ? 'bg-primary text-white' : 'hover:bg-border/50 text-text-secondary'}`}
                >
                    {type === 'sales_summary' ? <><ShoppingCart size={16}/> Sales Summary</> : <><ListChecks size={16}/> Detailed Sales Log</>}
                </button>
            ))}
        </div>

        {/* Report Filters */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Report Generator</h2>
          {error && <p className="text-sm text-yellow-400 bg-yellow-900/50 p-3 rounded-md mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
              <label className="text-sm font-medium text-text-secondary block mb-2">Start Date</label>
              <Calendar className="absolute left-3 top-10 text-text-secondary" size={18} />
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"/>
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-text-secondary block mb-2">End Date</label>
              <Calendar className="absolute left-3 top-10 text-text-secondary" size={18} />
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"/>
            </div>
            <div className="relative">
              <label className="text-sm font-medium text-text-secondary block mb-2">Branch</label>
              <Store className="absolute left-3 top-10 text-text-secondary" size={18} />
              <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="w-full appearance-none pl-10 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="all">All Branches</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <button onClick={handleGenerateReport} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors h-10">
              <FileText size={16} /> Generate Report
            </button>
          </div>
        </div>

        {/* Report Results */}
        <div className="mt-8">
            {reportType === 'sales_summary' && (
                <div className="bg-surface border border-border rounded-xl shadow-lg">
                  {reportData ? (
                    reportData.length > 0 ? (
                        <>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-text-primary mb-4">Report Results</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                   <DashboardCard title="Total Revenue (Paid)" value={formatCurrency(reportSummary?.totalRevenue || 0, currency)} change={`${reportSummary?.paidSalesCount || 0} paid transactions`} icon={<DollarSign className="text-green-500" />} />
                                   <DashboardCard title="Total Sales Transactions" value={`${reportSummary?.totalSales || 0}`} change="all statuses for this period" icon={<ShoppingCart className="text-primary"/>} />
                                   <DashboardCard title="Avg. Sale Value (Paid)" value={formatCurrency((reportSummary!.totalRevenue / (reportSummary!.paidSalesCount || 1)), currency)} change="per paid transaction" icon={<BarChart2 className="text-yellow-500"/>} />
                                </div>
                            </div>
                            <Table columns={salesColumns} data={reportData} />
                             <div className="p-4 bg-background rounded-b-xl flex justify-end font-bold text-lg border-t border-border">
                                <div className="grid grid-cols-2 gap-x-8 text-right">
                                    <span className="text-text-secondary">Grand Total:</span>
                                    <span className="text-text-primary">{formatCurrency(reportSummary?.grandTotalAmount || 0, currency)}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center text-text-secondary">No sales found for the selected filters.</div>
                    )
                  ) : (
                    <div className="p-12 text-center text-text-secondary">Please select your filters and click "Generate Report" to view data.</div>
                  )}
                </div>
            )}

            {reportType === 'detailed_sales' && (
                reportData ? (
                    reportData.length > 0 ? (
                        <DetailedSalesReport sales={reportData} products={products} currency={currency} />
                    ) : (
                         <div className="bg-surface border border-border rounded-xl shadow-lg p-12 text-center text-text-secondary">No sales found for the selected filters.</div>
                    )
                ) : (
                     <div className="bg-surface border border-border rounded-xl shadow-lg p-12 text-center text-text-secondary">Please select your filters and click "Generate Report" to view data.</div>
                )
            )}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Accounting</h1>
      </div>
      {renderContent()}
    </div>
  );
};

export default AccountingPage;