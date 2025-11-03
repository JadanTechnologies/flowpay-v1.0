import React, { useState, useMemo } from 'react';
// FIX: The `react-router-dom` module seems to have CJS/ESM interop issues in this environment. Using a namespace import as a workaround.
import { Link } from 'react-router-dom';
import { Package, PlusCircle, Search, MoreVertical, Edit, Trash2, SlidersHorizontal, Loader, Upload, Download, Bell, History, Filter, Store, ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Product, InventoryAdjustmentLog, InventoryAdjustmentLogType, ProductVariant } from '../types';
import StockAdjustmentModal from '../components/inventory/StockAdjustmentModal';
import BulkUpdateModal from '../components/inventory/BulkUpdateModal';
import { useAppContext } from '../contexts/AppContext';
import ProductForm from '../components/inventory/ProductForm';
import { formatCurrency } from '../utils/formatting';

interface BulkUpdateResults {
    successCount: number;
    errors: string[];
}

const InventoryPage: React.FC = () => {
    const { products, setProducts, loading, addNotification, branches, currency, currentBranchId, setInventoryAdjustmentLogs, session, saveProduct } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [adjustingStockProduct, setAdjustingStockProduct] = useState<Product | null>(null);
    const [adjustingStockVariant, setAdjustingStockVariant] = useState<ProductVariant | null>(null);
    const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
    const [bulkUpdateResults, setBulkUpdateResults] = useState<BulkUpdateResults | null>(null);
    const [branchFilter, setBranchFilter] = useState(currentBranchId);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    const categories = useMemo(() => {
        return ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
    }, [products]);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const processedProducts = useMemo(() => {
        const branchStock = (p: Product) => p.variants.reduce((sum: number, v) => sum + (v.stockByBranch[branchFilter] || 0), 0);
        const getMinPrice = (p: Product) => {
            if (!p.variants || p.variants.length === 0) return 0;
            return Math.min(...p.variants.map(v => v.price));
        };

        let filtered = products
            .filter(p => {
                const stock = branchStock(p);
                const lowStockThreshold = p.variants[0]?.lowStockThreshold ?? 0; // Simplified threshold check
                switch (filterStatus) {
                    case 'inStock': return stock > lowStockThreshold;
                    case 'lowStock': return stock > 0 && stock <= lowStockThreshold;
                    case 'outOfStock': return stock <= 0;
                    default: return true;
                }
            })
            .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
            .filter(p => {
                const searchTermLower = searchTerm.toLowerCase();
                if (!searchTermLower) return true;
                const skus = p.variants.map(v => v.sku.toLowerCase()).join(' ');
                return p.name.toLowerCase().includes(searchTermLower) ||
                    skus.includes(searchTermLower) ||
                    p.category.toLowerCase().includes(searchTermLower);
            });

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                let aValue: string | number, bValue: string | number;

                switch (sortConfig.key) {
                    case 'name':
                        aValue = a.name;
                        bValue = b.name;
                        break;
                    case 'category':
                        aValue = a.category;
                        bValue = b.category;
                        break;
                    case 'stock':
                        aValue = branchStock(a);
                        bValue = branchStock(b);
                        break;
                    case 'price':
                        aValue = getMinPrice(a);
                        bValue = getMinPrice(b);
                        break;
                    default:
                        return 0;
                }

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filtered;
    }, [products, searchTerm, filterStatus, branchFilter, categoryFilter, sortConfig]);

    const getPriceDisplay = (product: Product) => {
        if (!product.variants || product.variants.length === 0) return 'N/A';
        const prices = product.variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        if (minPrice === maxPrice) return formatCurrency(minPrice, currency);
        return `${formatCurrency(minPrice, currency)} - ${formatCurrency(maxPrice, currency)}`;
    };

    const toggleExpand = (productId: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const openModalForNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const openStockModal = (product: Product, variant: ProductVariant) => {
        setAdjustingStockProduct(product);
        setAdjustingStockVariant(variant);
        setIsStockModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product and all its variants?')) {
            // TODO: Convert to Supabase delete
            setProducts(products.filter(p => p.id !== id));
            addNotification({ message: 'Product deleted successfully.', type: 'success' });
        }
    };

    const handleSave = async (productData: Product) => {
        await saveProduct(productData);
        setIsModalOpen(false);
    };
    
    const handleSaveStockAdjustment = ({ variantId, newStock, reason }: { variantId: string; newStock: number; reason: string }) => {
        if (!adjustingStockProduct || !adjustingStockVariant) return;
        // TODO: Convert to Supabase update
        setProducts(currentProducts => currentProducts.map(p => {
            const variantIndex = p.variants.findIndex(v => v.id === variantId);
            if (variantIndex > -1) {
                const updatedVariants = [...p.variants];
                const variant = updatedVariants[variantIndex];
                const oldStock = variant.stockByBranch[branchFilter] || 0;
                
                const newLog: InventoryAdjustmentLog = {
                    id: `adj_${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    // FIX: Access user's name from `user_metadata`
                    user: session?.user?.user_metadata?.name || 'Admin User',
                    branchId: branchFilter,
                    type: 'Manual Adjustment',
                    referenceId: reason,
                    items: [{
                        productId: adjustingStockProduct.id,
                        productName: `${adjustingStockProduct.name} ${Object.values(adjustingStockVariant.options).join(' ')}`.trim(),
                        change: newStock - oldStock,
                    }],
                };
                setInventoryAdjustmentLogs(prev => [newLog, ...prev]);

                variant.stockByBranch[branchFilter] = newStock;
                
                addNotification({ message: `Stock for ${p.name} adjusted to ${newStock}.`, type: 'success' });
                return { ...p, variants: updatedVariants };
            }
            return p;
        }));
        setIsStockModalOpen(false);
    };

    const handleBulkUpdateClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const rows = text.split('\n').slice(1);
            let updatedCount = 0;
            const notFoundSkus: string[] = [];
            const invalidStockValues: { sku: string, value: string }[] = [];
            
            // TODO: Convert to Supabase bulk update
            setProducts(currentProducts => {
                const updatedProducts = JSON.parse(JSON.stringify(currentProducts)); // Deep copy
                rows.forEach(row => {
                    const [sku, newStockStr] = row.split(',').map(s => s.trim());
                    if (!sku || !newStockStr) return;

                    const newStock = parseInt(newStockStr, 10);
                    if (isNaN(newStock) || newStock < 0) {
                        invalidStockValues.push({ sku, value: newStockStr });
                        return;
                    }

                    let found = false;
                    for (const product of updatedProducts) {
                        const variant = product.variants.find((v: ProductVariant) => v.sku === sku);
                        if (variant) {
                            variant.stockByBranch[branchFilter] = newStock;
                            updatedCount++;
                            found = true;
                            break;
                        }
                    }

                    if (!found) notFoundSkus.push(sku);
                });
                return updatedProducts;
            });
            
            setBulkUpdateResults({
                successCount: updatedCount,
                errors: [
                    ...notFoundSkus.map(sku => `SKU not found: ${sku}`),
                    ...invalidStockValues.map(item => `Invalid stock value for SKU ${item.sku}: "${item.value}"`)
                ]
            });
            setIsBulkUpdateModalOpen(true);
        };

        reader.readAsText(file);
        event.target.value = '';
    };
    
    const handleDownloadSample = () => {
        const csvContent = "data:text/csv;charset=utf-8,sku,new_stock\n" + products.flatMap(p => p.variants).slice(0, 3).map(v => `${v.sku},${v.stockByBranch[branchFilter] || 0}`).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `stock_update_${branches.find(b=>b.id===branchFilter)?.name}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const getStockStatus = (stock: number, lowStockThreshold: number) => {
        if (stock <= 0) return <span className="px-2 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full">Out of Stock</span>;
        if (stock <= lowStockThreshold) return <span className="px-2 py-1 text-xs font-medium text-yellow-300 bg-yellow-900 rounded-full">Low Stock</span>;
        return <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full">In Stock</span>;
    };
    
    const SortableHeader: React.FC<{ label: string, sortKey: string }> = ({ label, sortKey }) => {
        const isSorted = sortConfig?.key === sortKey;
        const direction = sortConfig?.direction;
        return (
            <th className="px-4 py-3">
                <button onClick={() => requestSort(sortKey)} className="flex items-center gap-1 uppercase hover:text-text-primary">
                    {label}
                    {isSorted ? (direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <div className="w-[14px] h-[14px]"></div>}
                </button>
            </th>
        );
    };


    return (
        <div className="space-y-6">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Product Inventory</h1>
                    <div className="text-sm text-text-secondary mt-2">
                        Bulk update stock for <span className="font-bold text-primary">{branches.find(b => b.id === branchFilter)?.name}</span> via CSV.
                        <button onClick={handleDownloadSample} className="ml-2 text-primary hover:underline font-semibold inline-flex items-center gap-1"><Download size={12}/>Download Sample</button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleBulkUpdateClick} className="flex items-center gap-2 bg-surface hover:bg-border text-text-secondary font-semibold py-2 px-4 rounded-lg transition-colors border border-border">
                        <Upload size={16} /> Bulk Update Stock
                    </button>
                    <button onClick={openModalForNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <PlusCircle size={16} /> Add Product
                    </button>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 shadow-lg">
                 <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <div className="flex items-center gap-2 p-1 rounded-lg bg-background border border-border">
                        {(['all', 'inStock', 'lowStock', 'outOfStock'] as const).map(status => (
                            <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1 text-sm rounded-md transition-colors ${filterStatus === status ? 'bg-primary text-white' : 'hover:bg-border/50 text-text-secondary'}`}>
                                {status.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full appearance-none pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                                {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
                            </select>
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                            <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="w-full appearance-none pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                         <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-background border border-border rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-secondary uppercase bg-background">
                            <tr>
                                <th className="px-4 py-3 w-10"></th>
                                <SortableHeader label="Product" sortKey="name" />
                                <SortableHeader label="Category" sortKey="category" />
                                <SortableHeader label="Price" sortKey="price" />
                                <SortableHeader label={`Stock (${branches.find(b => b.id === branchFilter)?.name})`} sortKey="stock" />
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedProducts.map(product => {
                                const branchStock = product.variants.reduce((sum: number, v) => sum + (v.stockByBranch[branchFilter] || 0), 0);
                                const hasMultipleVariants = product.variants.length > 1;
                                return (
                                    <React.Fragment key={product.id}>
                                        <tr className="border-b border-border hover:bg-background">
                                            <td className="px-4 py-3">
                                                {hasMultipleVariants && (
                                                    <button onClick={() => toggleExpand(product.id)} className="p-1 rounded-md hover:bg-border">
                                                        {expandedRows.has(product.id) ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                                                    <div>
                                                        <div className="font-medium text-text-primary">{product.name}</div>
                                                        <div className="text-sm text-text-secondary">{hasMultipleVariants ? `${product.variants.length} variants` : product.variants[0]?.sku}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{product.category}</td>
                                            <td className="px-4 py-3">{getPriceDisplay(product)}</td>
                                            <td className="px-4 py-3 font-semibold">{branchStock}</td>
                                            <td className="px-4 py-3">{getStockStatus(branchStock, product.variants[0]?.lowStockThreshold || 0)}</td>
                                            <td className="px-4 py-3 text-right">
                                                 <div className="group relative inline-block">
                                                    <button className="p-1.5 rounded-md hover:bg-border"><MoreVertical size={16} /></button>
                                                    <div className="absolute right-0 mt-1 w-40 bg-surface border border-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible z-10">
                                                        <button onClick={() => openModalForEdit(product)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background"><Edit size={14} /> Edit Product</button>
                                                        {!hasMultipleVariants && <button onClick={() => openStockModal(product, product.variants[0])} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-background"><SlidersHorizontal size={14} /> Adjust Stock</button>}
                                                        <button onClick={() => handleDelete(product.id)} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-background"><Trash2 size={14} /> Delete Product</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedRows.has(product.id) && (
                                             <tr className="bg-background/50">
                                                <td colSpan={8} className="p-0">
                                                    <div className="px-8 py-4">
                                                        <table className="w-full text-xs">
                                                            <thead className="text-text-secondary">
                                                                <tr>
                                                                    <th className="px-2 py-1 text-left">Variant</th>
                                                                    <th className="px-2 py-1 text-left">SKU</th>
                                                                    <th className="px-2 py-1 text-right">Price</th>
                                                                    <th className="px-2 py-1 text-right">Stock ({branches.find(b => b.id === branchFilter)?.name})</th>
                                                                    <th className="px-2 py-1 text-right">Total Stock</th>
                                                                    <th className="px-2 py-1 text-right"></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {product.variants.map(variant => {
                                                                    const vBranchStock = variant.stockByBranch[branchFilter] || 0;
                                                                    // FIX: Use Object.values for type-safe reduce operation
                                                                    const vTotalStock = Object.values(variant.stockByBranch).reduce((s, stock) => s + stock, 0);
                                                                    return (
                                                                        <tr key={variant.id} className="border-b border-border/50 last:border-b-0">
                                                                            <td className="px-2 py-2 font-medium">{Object.values(variant.options).join(' / ')}</td>
                                                                            <td className="px-2 py-2">{variant.sku}</td>
                                                                            <td className="px-2 py-2 text-right">{formatCurrency(variant.price, currency)}</td>
                                                                            <td className="px-2 py-2 text-right">{vBranchStock}</td>
                                                                            <td className="px-2 py-2 text-right">{vTotalStock}</td>
                                                                            <td className="px-2 py-2 text-right">
                                                                                <button onClick={() => openStockModal(product, variant)} className="p-1 hover:bg-border rounded-md text-text-secondary" title="Adjust Stock">
                                                                                    <SlidersHorizontal size={14}/>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                             </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && <ProductForm product={editingProduct} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
            {isStockModalOpen && adjustingStockProduct && adjustingStockVariant && (
                <StockAdjustmentModal 
                    product={adjustingStockProduct}
                    variant={adjustingStockVariant}
                    onSave={handleSaveStockAdjustment} 
                    onClose={() => { setIsStockModalOpen(false); setAdjustingStockProduct(null); setAdjustingStockVariant(null); }} 
                />
            )}
            {isBulkUpdateModalOpen && bulkUpdateResults && (
                <BulkUpdateModal
                    results={bulkUpdateResults}
                    onClose={() => setIsBulkUpdateModalOpen(false)}
                />
            )}
        </div>
    );
};

export default InventoryPage;