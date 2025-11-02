



import React, { useState, useMemo, useEffect } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import { Link } from 'react-router-dom';
import { Truck, PlusCircle, MoreVertical, Edit, Trash2, CheckCircle, ArrowLeft, Filter } from 'lucide-react';
import { PurchaseOrder, InventoryAdjustmentLog } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import PurchaseOrderModal from '../../components/inventory/PurchaseOrderModal';
import ReceivePOModal from '../../components/inventory/ReceivePOModal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

const getStatusBadge = (status: PurchaseOrder['status']) => {
    switch (status) {
        case 'Pending': return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">{status}</span>;
        case 'Partial': return <span className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900 rounded-full">{status}</span>;
        case 'Received': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
        case 'Cancelled': return <span className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-full">{status}</span>;
    }
};

const PurchaseOrdersPage: React.FC = () => {
    const { purchaseOrders, setPurchaseOrders, setProducts, currency, suppliers, products, branches, setInventoryAdjustmentLogs, session } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
    const [receivingPO, setReceivingPO] = useState<PurchaseOrder | null>(null);
    const [poToDelete, setPoToDelete] = useState<string | null>(null);
    
    // State for filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [filteredPOs, setFilteredPOs] = useState<PurchaseOrder[]>([]);
    const [isFiltering, setIsFiltering] = useState(true);

    useEffect(() => {
        setIsFiltering(true);
        const timer = setTimeout(() => {
            const result = purchaseOrders
                .filter(po => statusFilter === 'all' || po.status === statusFilter)
                .filter(po => supplierFilter === 'all' || po.supplierId === supplierFilter)
                .filter(po => {
                    if (!startDate && !endDate) return true;
                    const poDate = new Date(po.createdDate);
                    const start = startDate ? new Date(startDate) : null;
                    const end = endDate ? new Date(endDate) : null;
                    if (start) start.setHours(0, 0, 0, 0);
                    if (end) end.setHours(23, 59, 59, 999);
                    
                    if (start && end) return poDate >= start && poDate <= end;
                    if (start) return poDate >= start;
                    if (end) return poDate <= end;
                    return true;
                });
            setFilteredPOs(result);
            setIsFiltering(false);
        }, 500); // Simulate network delay for filtering

        return () => clearTimeout(timer);
    }, [purchaseOrders, statusFilter, supplierFilter, startDate, endDate]);

    const resetFilters = () => {
        setStatusFilter('all');
        setSupplierFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const openModalForNew = () => {
        setEditingPO(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (po: PurchaseOrder) => {
        setEditingPO(po);
        setIsModalOpen(true);
    };

    const openReceiveModal = (po: PurchaseOrder) => {
        setReceivingPO(po);
    };

    const handleDelete = (id: string) => {
        setPoToDelete(id);
    };

    const confirmDelete = () => {
        if (poToDelete) {
            setPurchaseOrders(prev => prev.filter(po => po.id !== poToDelete));
            setPoToDelete(null);
        }
    };
    
    // FIX: Correctly update product variant stock on PO receipt.
    const handleSaveReceipt = (updatedPO: PurchaseOrder, stockUpdates: { productId: string; quantity: number }[]) => {
        setPurchaseOrders(prev => prev.map(po => po.id === updatedPO.id ? updatedPO : po));
    
        setProducts(currentProducts => {
            return currentProducts.map(p => {
                const variantsToUpdate = p.variants.filter(v => stockUpdates.some(u => u.productId === v.id));
                if (variantsToUpdate.length > 0) {
                    const newVariants = p.variants.map(variant => {
                        const update = stockUpdates.find(u => u.productId === variant.id);
                        if (update) {
                            const newStockByBranch = { ...variant.stockByBranch };
                            newStockByBranch[updatedPO.deliveryBranchId] = (newStockByBranch[updatedPO.deliveryBranchId] || 0) + update.quantity;
                            return { ...variant, stockByBranch: newStockByBranch };
                        }
                        return variant;
                    });
                    return { ...p, variants: newVariants };
                }
                return p;
            });
        });
        
        const logItems = stockUpdates.map(update => {
            const poItem = updatedPO.items.find(i => i.productId === update.productId);
            return {
                productId: 'N/A', // In a real system you'd link this to the parent product
                productName: poItem?.name || 'Unknown',
                change: update.quantity,
            };
        });

        if (logItems.length > 0) {
            const newLog: InventoryAdjustmentLog = {
                id: `adj_${Date.now()}`,
                timestamp: new Date().toISOString(),
                user: session?.user?.name || 'Admin User',
                branchId: updatedPO.deliveryBranchId,
                type: 'Purchase Order Receipt',
                referenceId: updatedPO.id,
                items: logItems,
            };
            setInventoryAdjustmentLogs(prev => [newLog, ...prev]);
        }
    
        setReceivingPO(null);
        alert('Stock received and inventory updated successfully!');
    };
    
    const handleSave = (po: PurchaseOrder) => {
        if (editingPO) {
            setPurchaseOrders(prev => prev.map(p => p.id === po.id ? po : p));
        } else {
            const newPO = { ...po, id: `PO-${new Date().getTime()}` };
            setPurchaseOrders(prev => [newPO, ...prev]);
        }
        setIsModalOpen(false);
    };

    const columns: Column<PurchaseOrder>[] = [
        { header: 'PO Number', accessor: 'id', sortable: true },
        { header: 'Supplier', accessor: 'supplierName', sortable: true },
        { header: 'Branch', accessor: 'deliveryBranchId', sortable: true, render: (row) => branches.find(b => b.id === row.deliveryBranchId)?.name || 'N/A' },
        { header: 'Expected', accessor: 'expectedDate', sortable: true },
        { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
        { header: 'Total', accessor: 'totalCost', sortable: true, render: (row) => formatCurrency(row.totalCost, currency) },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="group relative text-right flex items-center justify-end gap-1">
                    {(row.status === 'Pending' || row.status === 'Partial') && (
                        <button onClick={() => openReceiveModal(row)} className="flex items-center gap-1 text-xs bg-green-600/20 text-green-400 font-semibold py-1 px-2 rounded-lg hover:bg-green-600/40 transition-colors">
                            <CheckCircle size={14} /> Receive Stock
                        </button>
                    )}
                    <button className="p-1.5 rounded-md hover:bg-border"><MoreVertical size={16} /></button>
                    <div className="absolute right-0 mt-8 w-32 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                        {row.status === 'Pending' && <button onClick={() => openModalForEdit(row)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background"><Edit size={14} /> Edit</button>}
                        <button onClick={() => handleDelete(row.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-background"><Trash2 size={14} /> Delete</button>
                    </div>
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
                    <h1 className="text-3xl font-bold text-text-primary">Purchase Orders</h1>
                </div>
                <button onClick={openModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} /> Create PO
                </button>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-6 p-4 bg-background rounded-lg">
                    <div>
                        <label className="text-xs text-text-secondary">Status</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="all">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Partial">Partial</option>
                            <option value="Received">Received</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-xs text-text-secondary">Supplier</label>
                        <select value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)} className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="all">All Suppliers</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <div>
                            <label className="text-xs text-text-secondary">Start Date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"/>
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary">End Date</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"/>
                        </div>
                    </div>
                    <button onClick={resetFilters} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm h-10">Reset</button>
                </div>
                <Table columns={columns} data={filteredPOs} isLoading={isFiltering} />
            </div>
            {isModalOpen && (
                <PurchaseOrderModal
                    po={editingPO}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            {receivingPO && (
                 <ReceivePOModal
                    po={receivingPO}
                    onSave={handleSaveReceipt}
                    onClose={() => setReceivingPO(null)}
                />
            )}
            <ConfirmationModal
                isOpen={!!poToDelete}
                onClose={() => setPoToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Purchase Order"
                message={`Are you sure you want to delete this purchase order (${poToDelete})? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default PurchaseOrdersPage;