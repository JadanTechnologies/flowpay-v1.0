

import React, { useState, useMemo } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { Shuffle, PlusCircle, ArrowLeft, MoreVertical, Edit, CheckCircle, Truck } from 'lucide-react';
import { StockTransfer, Product, ProductVariant } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import { useAppContext } from '../../contexts/AppContext';
import StockTransferModal from '../../components/inventory/StockTransferModal';

const getStatusBadge = (status: StockTransfer['status']) => {
    switch (status) {
        case 'Pending': return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">{status}</span>;
        case 'In Transit': return <span className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900 rounded-full">{status}</span>;
        case 'Completed': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
    }
};

const StockTransfersPage: React.FC = () => {
    const { stockTransfers, setStockTransfers, branches, products, setProducts, setInventoryAdjustmentLogs } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStartNewTransfer = () => {
        setIsModalOpen(true);
    };

    const handleSaveTransfer = (transfer: StockTransfer) => {
        setStockTransfers(prev => [transfer, ...prev]);
        setIsModalOpen(false);
    };

    const handleDispatchTransfer = (transferId: string) => {
        const transfer = stockTransfers.find(t => t.id === transferId);
        if (!transfer || transfer.status !== 'Pending') return;

        if (window.confirm('Are you sure you want to dispatch this transfer? Stock will be deducted from the source branch.')) {
            // 1. Deduct stock from the source branch
            setProducts(currentProducts => {
                const productsMap = new Map<string, Product>(currentProducts.map(p => [p.id, JSON.parse(JSON.stringify(p)) as Product]));
                transfer.items.forEach(item => {
                    for (const product of productsMap.values()) {
                        const variantToUpdate = product.variants.find((v: ProductVariant) => v.id === item.variantId);
                        if (variantToUpdate) {
                            variantToUpdate.stockByBranch[transfer.fromBranchId] = (variantToUpdate.stockByBranch[transfer.fromBranchId] || 0) - item.quantity;
                            break;
                        }
                    }
                });
                return Array.from(productsMap.values());
            });

            // 2. Create an inventory adjustment log
            setInventoryAdjustmentLogs(prev => {
                const logItems = transfer.items.map(item => {
                    const product = products.find(p => p.variants.some(v => v.id === item.variantId));
                    const variant = product?.variants.find(v => v.id === item.variantId);
                    const variantName = variant ? Object.values(variant.options).join(' ') : '';
                    const productName = product ? (variantName ? `${product.name} - ${variantName}` : product.name) : 'Unknown';

                    return {
                        productId: product?.id || 'unknown-product',
                        productName: productName,
                        change: -item.quantity,
                    };
                });

                const newLog = {
                    id: `adj_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    user: 'Admin User', // Or from session
                    branchId: transfer.fromBranchId,
                    type: 'Stock Transfer Out' as const,
                    referenceId: transfer.id,
                    items: logItems,
                };
                return [newLog, ...prev];
            });

            // 3. Update transfer status to 'In Transit'
            setStockTransfers(prev => prev.map(t =>
                t.id === transferId ? { ...t, status: 'In Transit' } : t
            ));
        }
    };

    const handleReceiveTransfer = (transferId: string) => {
        const transfer = stockTransfers.find(t => t.id === transferId);
        if (!transfer || transfer.status !== 'In Transit') return;
    
        if (window.confirm('Are you sure you want to mark this transfer as received? Stock will be added to the destination branch.')) {
            // 1. Add stock to the destination branch
            setProducts(currentProducts => {
                const productsMap = new Map<string, Product>(currentProducts.map(p => [p.id, JSON.parse(JSON.stringify(p)) as Product]));
                transfer.items.forEach(item => {
                    for (const product of productsMap.values()) {
                        const variantToUpdate = product.variants.find((v: ProductVariant) => v.id === item.variantId);
                        if (variantToUpdate) {
                            variantToUpdate.stockByBranch[transfer.toBranchId] = (variantToUpdate.stockByBranch[transfer.toBranchId] || 0) + item.quantity;
                            break;
                        }
                    }
                });
                return Array.from(productsMap.values());
            });
    
            // 2. Create an inventory adjustment log
            setInventoryAdjustmentLogs(prev => {
                const logItems = transfer.items.map(item => {
                    const product = products.find(p => p.variants.some(v => v.id === item.variantId));
                    const variant = product?.variants.find(v => v.id === item.variantId);
                    const variantName = variant ? Object.values(variant.options).join(' ') : '';
                    const productName = product ? (variantName ? `${product.name} - ${variantName}` : product.name) : 'Unknown';

                    return {
                        productId: product?.id || 'unknown-product',
                        productName: productName,
                        change: item.quantity,
                    };
                });
    
                const newLog = {
                    id: `adj_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    user: 'Admin User',
                    branchId: transfer.toBranchId,
                    type: 'Stock Transfer In' as const,
                    referenceId: transfer.id,
                    items: logItems,
                };
                return [newLog, ...prev];
            });
    
    
            // 3. Update transfer status to 'Completed'
            setStockTransfers(prev => prev.map(t =>
                t.id === transferId ? { ...t, status: 'Completed', completedDate: new Date().toISOString().split('T')[0] } : t
            ));
        }
    };
    
    const columns: Column<StockTransfer>[] = [
        { header: 'Transfer ID', accessor: 'id', sortable: true },
        { header: 'From', accessor: 'fromBranchId', sortable: true, render: (row) => branches.find(b => b.id === row.fromBranchId)?.name },
        { header: 'To', accessor: 'toBranchId', sortable: true, render: (row) => branches.find(b => b.id === row.toBranchId)?.name },
        { header: 'Date', accessor: 'createdDate', sortable: true },
        { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => {
                switch(row.status) {
                    case 'Pending':
                        return (
                            <div className="text-right">
                                <button 
                                    onClick={() => handleDispatchTransfer(row.id)} 
                                    className="flex items-center gap-1 text-xs bg-blue-600/20 text-blue-400 font-semibold py-1 px-2 rounded-lg hover:bg-blue-600/40 transition-colors"
                                >
                                    <Truck size={14} /> Dispatch
                                </button>
                            </div>
                        );
                    case 'In Transit':
                        return (
                            <div className="text-right">
                                <button 
                                    onClick={() => handleReceiveTransfer(row.id)} 
                                    className="flex items-center gap-1 text-xs bg-green-600/20 text-green-400 font-semibold py-1 px-2 rounded-lg hover:bg-green-600/40 transition-colors"
                                >
                                    <CheckCircle size={14} /> Receive
                                </button>
                            </div>
                        );
                    case 'Completed':
                        return <div className="text-right text-xs text-text-secondary">Completed</div>;
                    default:
                        return null;
                }
            }
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                     <Link to="/app/inventory" className="p-2 rounded-md hover:bg-surface">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-text-primary">Stock Transfers</h1>
                </div>
                <button onClick={handleStartNewTransfer} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} /> New Transfer
                </button>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <Table columns={columns} data={stockTransfers} />
            </div>

            {isModalOpen && (
                <StockTransferModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTransfer}
                />
            )}
        </div>
    );
};

export default StockTransfersPage;
