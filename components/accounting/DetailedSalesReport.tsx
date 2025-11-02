import React, { useMemo } from 'react';
import { Sale, Product, Branch } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';
import { Printer, FileDown } from 'lucide-react';

// Make jsPDF and autoTable available in the window scope for TypeScript
declare global {
    interface Window {
        jspdf: any;
    }
}

interface DetailedSalesReportProps {
    sales: Sale[];
    products: Product[];
    currency: string;
    branches: Branch[];
}

interface ReportRow {
    branchName: string;
    itemName: string;
    category: string;
    qtyBefore: number;
    qtySold: number;
    qtyAfter: number;
    costPrice: number;
    totalCost: number;
    sellingPrice: number;
    totalSelling: number;
    discount: number;
    balance: number;
    profit: number;
    cashierName: string;
    dateTime: string;
}

const DetailedSalesReport: React.FC<DetailedSalesReportProps> = ({ sales, products, currency, branches }) => {

    const reportRows = useMemo((): ReportRow[] => {
        const rows: ReportRow[] = [];
        sales.forEach(sale => {
            const branch = branches.find(b => b.name === sale.branch);
            if (!branch) return; // Skip if branch not found
            const branchId = branch.id;

            sale.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return;
                const variant = product.variants.find(v => v.id === item.id);
                if (!variant) return;

                const qtySold = item.quantity;
                const currentStock = variant.stockByBranch[branchId] ?? 0;
                // This is a simplification; for true accuracy, stock snapshots would be needed.
                const qtyAfter = currentStock; 
                const qtyBefore = currentStock + qtySold;
                
                const discount = item.discount || 0;
                const totalSelling = item.price * qtySold;
                const balance = totalSelling - discount;
                const totalCost = item.costPrice * qtySold;
                const profit = balance - totalCost;

                rows.push({
                    branchName: sale.branch,
                    itemName: item.name,
                    category: product.category,
                    qtyBefore,
                    qtySold,
                    qtyAfter,
                    costPrice: item.costPrice,
                    totalCost,
                    sellingPrice: item.price,
                    totalSelling,
                    discount,
                    balance,
                    profit,
                    cashierName: sale.cashierName,
                    dateTime: new Date(sale.date).toLocaleString(),
                });
            });
        });
        return rows;
    }, [sales, products, branches]);

    const grandTotals = useMemo(() => {
        return reportRows.reduce((totals, row) => ({
            totalCost: totals.totalCost + row.totalCost,
            totalSelling: totals.totalSelling + row.totalSelling,
            discount: totals.discount + row.discount,
            balance: totals.balance + row.balance,
            profit: totals.profit + row.profit,
        }), { totalCost: 0, totalSelling: 0, discount: 0, balance: 0, profit: 0 });
    }, [reportRows]);

    const handlePrint = () => {
        window.print();
    };

    const handleExportPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape' });
        
        doc.text('Detailed Sales Report', 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 20);

        const tableColumn = ["S/N", "Branch", "Item", "Category", "Qty Before", "Qty Sold", "Qty After", "Cost", "Total Cost", "Price", "Total Price", "Discount", "Balance", "Profit", "Cashier", "Date/Time"];
        const tableRows: (string | number)[][] = [];

        reportRows.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.branchName,
                row.itemName,
                row.category,
                row.qtyBefore,
                row.qtySold,
                row.qtyAfter,
                formatCurrency(row.costPrice, currency),
                formatCurrency(row.totalCost, currency),
                formatCurrency(row.sellingPrice, currency),
                formatCurrency(row.totalSelling, currency),
                formatCurrency(row.discount, currency),
                formatCurrency(row.balance, currency),
                formatCurrency(row.profit, currency),
                row.cashierName,
                row.dateTime,
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 25,
            theme: 'grid',
            headStyles: { fillColor: [0, 122, 122] },
            styles: { fontSize: 7, cellPadding: 1.5 },
            foot: [
                ['', 'Grand Total', '', '', '', '', '', '', formatCurrency(grandTotals.totalCost, currency), '', formatCurrency(grandTotals.totalSelling, currency), formatCurrency(grandTotals.discount, currency), formatCurrency(grandTotals.balance, currency), formatCurrency(grandTotals.profit, currency), '', '']
            ],
            footStyles: { fontStyle: 'bold', fillColor: [23, 31, 42] }
        });

        doc.save('detailed-sales-report.pdf');
    };

    return (
        <div className="printable-report-wrapper">
            <div className="bg-surface border border-border rounded-xl shadow-lg print-area">
                <div className="p-6 flex justify-between items-center no-print">
                    <h2 className="text-xl font-semibold text-text-primary">Detailed Sales Log</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-surface hover:bg-border text-text-secondary font-semibold py-2 px-4 rounded-lg transition-colors border border-border">
                            <Printer size={16} /> Print
                        </button>
                        <button onClick={handleExportPdf} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <FileDown size={16} /> Export PDF
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-secondary uppercase bg-background">
                            <tr>
                                {[ "S/N", "Branch", "Item Name", "Category", "Qty Before", "Qty Sold", "Qty After", "Cost Price", "Total Cost", "Selling Price", "Total Selling", "Discount", "Balance", "Profit", "Cashier", "Date & Time"].map(h => (
                                    <th key={h} scope="col" className="px-3 py-3 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reportRows.map((row, index) => (
                                <tr key={index} className="border-b border-border hover:bg-background">
                                    <td className="px-3 py-2">{index + 1}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{row.branchName}</td>
                                    <td className="px-3 py-2 font-medium text-text-primary whitespace-nowrap">{row.itemName}</td>
                                    <td className="px-3 py-2">{row.category}</td>
                                    <td className="px-3 py-2 text-center">{row.qtyBefore}</td>
                                    <td className="px-3 py-2 text-center">{row.qtySold}</td>
                                    <td className="px-3 py-2 text-center">{row.qtyAfter}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(row.costPrice, currency)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(row.totalCost, currency)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(row.sellingPrice, currency)}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(row.totalSelling, currency)}</td>
                                    <td className="px-3 py-2 text-right text-yellow-400">{formatCurrency(row.discount, currency)}</td>
                                    <td className="px-3 py-2 text-right font-semibold">{formatCurrency(row.balance, currency)}</td>
                                    <td className={`px-3 py-2 text-right font-semibold ${row.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(row.profit, currency)}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{row.cashierName}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{row.dateTime}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-background font-bold text-text-primary">
                             <tr>
                                <td colSpan={8} className="px-3 py-3 text-right text-base">Grand Total</td>
                                <td className="px-3 py-3 text-right text-base">{formatCurrency(grandTotals.totalCost, currency)}</td>
                                <td className="px-3 py-3"></td>
                                <td className="px-3 py-3 text-right text-base">{formatCurrency(grandTotals.totalSelling, currency)}</td>
                                <td className="px-3 py-3 text-right text-base text-yellow-400">{formatCurrency(grandTotals.discount, currency)}</td>
                                <td className="px-3 py-3 text-right text-base">{formatCurrency(grandTotals.balance, currency)}</td>
                                <td className={`px-3 py-3 text-right text-base ${grandTotals.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(grandTotals.profit, currency)}</td>
                                <td colSpan={2}></td>
                             </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DetailedSalesReport;