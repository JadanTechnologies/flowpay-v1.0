

import React, { useState } from 'react';
import { Truck, PlusCircle, MoreVertical, Edit, CheckCircle, DollarSign, FileText, Send } from 'lucide-react';
import { Consignment, Customer, Sale, Invoice, Product, ProductVariant } from '../../types';
import Table, { Column } from '../../components/ui/Table';
import { useAppContext } from '../../contexts/AppContext';
import ConsignmentFormModal from '../../components/logistics/ConsignmentFormModal';
import WaybillModal from '../../components/logistics/WaybillModal';

const getStatusBadge = (status: Consignment['status']) => {
    switch (status) {
        case 'Pending': return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">{status}</span>;
        case 'Dispatched':
        case 'In Transit': return <span className="px-2 py-1 text-xs font-medium text-blue-300 bg-blue-900 rounded-full">{status}</span>;
        case 'Delivered':
        case 'Sold': return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">{status}</span>;
    }
};

const ConsignmentsPage: React.FC = () => {
    const { 
        consignments, setConsignments, 
        session, branches, drivers, trucks, products, setProducts, 
        customers, addNotification, setInventoryAdjustmentLogs 
    } = useAppContext();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewingWaybill, setViewingWaybill] = useState<Consignment | null>(null);

    const handleSaveConsignment = (consignment: Consignment) => {
        setConsignments(prev => [consignment, ...prev]);
        setIsCreateModalOpen(false);
        addNotification({ message: `Consignment ${consignment.id} created successfully.`, type: 'success' });
    };

    const handleDispatch = (consignment: Consignment) => {
        if (window.confirm('Dispatching this consignment will deduct stock from the origin branch. Proceed?')) {
            // Deduct stock
            setProducts(currentProducts => {
                // FIX: Explicitly type the Map to ensure product is correctly typed.
                const productsMap = new Map<string, Product>(currentProducts.map(p => [p.id, JSON.parse(JSON.stringify(p)) as Product]));
                consignment.items.forEach(item => {
                    for (const product of productsMap.values()) {
                        const variantToUpdate = product.variants.find((v: ProductVariant) => v.id === item.variantId);
                        if (variantToUpdate) {
                            variantToUpdate.stockByBranch[consignment.originBranchId] = (variantToUpdate.stockByBranch[consignment.originBranchId] || 0) - item.quantity;
                            break;
                        }
                    }
                });
                return Array.from(productsMap.values());
            });

            // Create log
            setInventoryAdjustmentLogs(prev => {
                const logItems = consignment.items.map(item => {
                    const product = products.find(p => p.variants.some(v => v.id === item.variantId));
                    const variant = product?.variants.find(v => v.id === item.variantId);
                    const productName = product ? `${product.name} ${Object.values(variant?.options || {}).join(' ')}`.trim() : 'Unknown';
                    return { productId: product?.id || '', productName, change: -item.quantity };
                });
                return [{
                    id: `adj_con_out_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    user: session?.user?.name || 'Admin',
                    branchId: consignment.originBranchId,
                    type: 'Stock Transfer Out',
                    referenceId: consignment.id,
                    items: logItems
                }, ...prev];
            });

            // Update status
            setConsignments(prev => prev.map(c => 
                c.id === consignment.id ? { ...c, status: 'In Transit', dispatchDate: new Date().toISOString() } : c
            ));
            addNotification({ message: `Consignment ${consignment.id} dispatched.`, type: 'info' });
        }
    };
    
    const handleSellConsignment = (consignment: Consignment) => {
        // This would open a customer selection modal in a real app.
        const customer = customers.find(c => c.id === 'cust_3'); // Mock: Sell to Gadget Galaxy
        if (!customer) {
            addNotification({ message: "Could not find a customer to sell to.", type: 'error' });
            return;
        }

        if (window.confirm(`Sell all items in this consignment to ${customer.name}? This will generate an invoice.`)) {
            const newInvoiceId = `inv_con_${consignment.id}`;
            setConsignments(prev => prev.map(c => 
                c.id === consignment.id ? { ...c, status: 'Sold', soldToCustomerId: customer.id, invoiceId: newInvoiceId } : c
            ));
            addNotification({ message: `Consignment sold to ${customer.name}. Invoice ${newInvoiceId} generated.`, type: 'success' });
        }
    };

    const columns: Column<Consignment>[] = [
        { header: 'ID', accessor: 'id' },
        { header: 'Origin', accessor: 'originBranchId', render: (row) => branches.find(b => b.id === row.originBranchId)?.name },
        { header: 'Destination', accessor: 'destinationAddress' },
        { header: 'Driver', accessor: 'driverId', render: (row) => drivers.find(d => d.id === row.driverId)?.name },
        { header: 'Truck', accessor: 'truckId', render: (row) => trucks.find(t => t.id === row.truckId)?.licensePlate },
        { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
        {
            header: 'Actions', accessor: 'actions', render: (row) => (
                <div className="flex gap-2">
                    {row.status === 'Pending' && (
                        <button onClick={() => handleDispatch(row)} className="flex items-center gap-1 text-xs bg-blue-600/20 text-blue-400 font-semibold py-1 px-2 rounded-lg">
                            <Send size={14} /> Dispatch
                        </button>
                    )}
                    {session?.user?.role === 'Admin' && row.status === 'In Transit' && (
                        <button onClick={() => handleSellConsignment(row)} className="flex items-center gap-1 text-xs bg-green-600/20 text-green-400 font-semibold py-1 px-2 rounded-lg">
                            <DollarSign size={14} /> Sell
                        </button>
                    )}
                    {row.status === 'Sold' && (
                         <button onClick={() => setViewingWaybill(row)} className="flex items-center gap-1 text-xs bg-gray-600/20 text-gray-400 font-semibold py-1 px-2 rounded-lg">
                            <FileText size={14} /> View Waybill
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-text-primary">Consignments</h1>
                <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <PlusCircle size={16} /> Create Consignment
                </button>
            </div>
             <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                <Table columns={columns} data={consignments} />
            </div>

            {isCreateModalOpen && (
                <ConsignmentFormModal 
                    onSave={handleSaveConsignment}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}

            {viewingWaybill && (
                <WaybillModal
                    consignment={viewingWaybill}
                    onClose={() => setViewingWaybill(null)}
                />
            )}
        </div>
    );
};

export default ConsignmentsPage;