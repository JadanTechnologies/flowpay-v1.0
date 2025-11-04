import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, PlusCircle, ArrowLeft, MoreVertical, Edit, Store } from 'lucide-react';
import { StockCount } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import { useAppContext } from '../../contexts/AppContext';
import StockCountModal from '../../components/inventory/StockCountModal';

const getStatusBadge = (status: StockCount['status']) => {
    switch (status) {
        case 'In Progress': return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">{status}</span>;
        case 'Completed': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
    }
};

const StockCountsPage: React.FC = () => {
    const { stockCounts, setStockCounts, products, setProducts, branches, currentBranchId } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCount, setEditingCount] = useState<StockCount | null>(null);
    const [branchFilter, setBranchFilter] = useState<string>(currentBranchId);

    const filteredCounts = useMemo(() => {
        return stockCounts.filter(sc => sc.branchId === branchFilter);
    }, [stockCounts, branchFilter]);

    const handleStartNewCount = () => {
        setEditingCount(null);
        setIsModalOpen(true);
    };
    
    const handleOpenCount = (count: StockCount) => {
        setEditingCount(count);
        setIsModalOpen(true);
    };

    const handleSaveCount = (count: StockCount) => {
        // Adjust stock levels based on the completed count
        if (count.status === 'Completed') {
            setProducts(currentProducts => {
                const updatedProducts = [...currentProducts];
                count.items.forEach(item => {
                    // FIX: Find product and variant to update stock
                    const productIndex = updatedProducts.findIndex(p => p.variants.some(v => v.sku === item.sku));
                    if (productIndex !== -1 && item.countedQuantity !== null) {
                        const product = updatedProducts[productIndex];
                        const variantIndex = product.variants.findIndex(v => v.sku === item.sku);
                        if (variantIndex !== -1) {
                            product.variants[variantIndex].stockByBranch[count.branchId] = item.countedQuantity;
                        }
                    }
                });
                return updatedProducts;
            });
        }

        // Save the count itself
        const existingIndex = stockCounts.findIndex(sc => sc.id === count.id);
        if (existingIndex > -1) {
            const updatedCounts = [...stockCounts];
            updatedCounts[existingIndex] = count;
            setStockCounts(updatedCounts);
        } else {
            setStockCounts([count, ...stockCounts]);
        }
        setIsModalOpen(false);
    };
    
    const columns: Column<StockCount>[] = [
        { header: 'Count ID', accessor: 'id', sortable: true },
        { header: 'Date', accessor: 'date', sortable: true },
        { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
        { header: 'Items Counted', accessor: 'items', render: (row) => row.items.length },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="text-right">
                    <button 
                        onClick={() => handleOpenCount(row)} 
                        className="flex items-center gap-1 text-xs bg-blue-600/20 text-blue-400 font-semibold py-1 px-2 rounded-lg hover:bg-blue-600/40 transition-colors"
                    >
                        <Edit size={14} /> {row.status === 'Completed' ? 'View' : 'Continue'}
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                     <Link to="/app/inventory" className="p-2 rounded-md hover:bg-surface">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-text-primary">Stock Counts</h1>
                </div>
                <button onClick={handleStartNewCount} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} /> Start New Count for {branches.find(b => b.id === branchFilter)?.name}
                </button>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-text-primary">History</h2>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                      <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="w-full appearance-none pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                </div>
                <Table columns={columns} data={filteredCounts} />
            </div>

            {isModalOpen && (
                <StockCountModal
                    stockCount={editingCount}
                    // FIX: Pass the current branch filter as branchId to the modal.
                    branchId={branchFilter}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveCount}
                />
            )}
        </div>
    );
};

export default StockCountsPage;