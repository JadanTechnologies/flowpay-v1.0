import React, { useState, useReducer, useMemo, useEffect, useCallback } from 'react';
import { Search, Loader, UserPlus, Barcode, Star, Layers } from 'lucide-react';
import { Product, CartItem, HeldSale, Customer, Payment, Sale, ProductVariant } from '../types';
import Cart from '../components/pos/Cart';
import ProductCard from '../components/pos/ProductCard';
import PaymentModal from '../components/pos/PaymentModal';
import HeldSalesModal from '../components/pos/HeldSalesModal';
import CustomerFormModal from '../components/pos/CustomerFormModal';
import BarcodeScannerModal from '../components/pos/BarcodeScannerModal';
import ProductDetailsModal from '../components/pos/ProductDetailsModal';
import ReturnModal from '../components/pos/ReturnModal';
import SaleSuccessModal from '../components/pos/SaleSuccessModal';
import { recentSales as mockSalesHistory } from '../data/mockData';
import { useAppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatting';
import Receipt from '../components/pos/Receipt';
import ChargeToCustomerModal from '../components/pos/ChargeToCustomerModal';

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_DISCOUNT'; payload: { id: string; discount: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'RESTORE_CART'; payload: CartItem[] };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const itemToAdd = action.payload;
      if (itemToAdd.stock <= 0) return state;

      const existingItem = state.find(item => item.id === itemToAdd.id);
      
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + 1, itemToAdd.stock);
        return state.map(item =>
          item.id === itemToAdd.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      return [...state, { ...itemToAdd, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload);
    case 'UPDATE_QUANTITY': {
        const itemToUpdate = state.find(item => item.id === action.payload.id);
        if (!itemToUpdate) return state;

        let newQuantity = action.payload.quantity;

        if (newQuantity <= 0) {
            return state.filter(item => item.id !== action.payload.id);
        }
        
        if (newQuantity > itemToUpdate.stock) {
            newQuantity = itemToUpdate.stock;
        }

        return state.map(item =>
            item.id === action.payload.id
            ? { ...item, quantity: newQuantity }
            : item
        );
    }
    case 'UPDATE_DISCOUNT': {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, discount: action.payload.discount }
            : item
        );
    }
    case 'RESTORE_CART':
      return action.payload;
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

const PosPage: React.FC = () => {
  const { 
    products, 
    setProducts, 
    currency, 
    loading: contextLoading, 
    currentBranchId, 
    branches, 
    addNotification, 
    session,
    customers,
    setCustomers
  } = useAppContext();
  
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);
  const [isHeldSalesModalOpen, setHeldSalesModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<Product | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [saleSuccessInfo, setSaleSuccessInfo] = useState<Sale | null>(null);
  const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const currentBranchName = useMemo(() => branches.find(b => b.id === currentBranchId)?.name || 'N/A', [branches, currentBranchId]);

  const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  // Sync cart with product stock changes from the main product list
  useEffect(() => {
    if (products.length === 0 || cart.length === 0) return;

    const cartNeedsSync = cart.some(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        const variant = product?.variants.find(v => v.id === cartItem.id);
        const branchStock = variant?.stockByBranch[currentBranchId] ?? 0;
        return !product || !variant || branchStock !== cartItem.stock;
    });

    if (cartNeedsSync) {
        const syncedCart = cart.map(cartItem => {
            const product = products.find(p => p.id === cartItem.productId);
            const variant = product?.variants.find(v => v.id === cartItem.id);
            if (product && variant) {
                const branchStock = variant.stockByBranch[currentBranchId] ?? 0;
                const newQuantity = Math.min(cartItem.quantity, branchStock);
                return { ...cartItem, stock: branchStock, quantity: newQuantity, price: variant.price, imageUrl: product.imageUrl };
            }
            return null;
        }).filter((item): item is CartItem => item !== null && item.quantity > 0);
        
        if (JSON.stringify(cart) !== JSON.stringify(syncedCart)) {
            dispatch({ type: 'RESTORE_CART', payload: syncedCart });
        }
    }
  }, [products, cart, currentBranchId]);


  const printReceipt = useCallback(() => {
      window.print();
      setSaleToPrint(null); // Clear after printing
  }, []);

  useEffect(() => {
    if (saleToPrint) {
      const timer = setTimeout(() => printReceipt(), 100);
      return () => clearTimeout(timer);
    }
  }, [saleToPrint, printReceipt]);

  const handleToggleFavorite = (productId: string) => {
    setProducts(currentProducts =>
        currentProducts.map(p =>
            p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
        )
    );
  };

  const filteredProducts = useMemo(() => 
    products.map(p => ({
        ...p,
        stock: p.variants.reduce((sum, v) => sum + (v.stockByBranch[currentBranchId] || 0), 0)
    }))
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(product => categoryFilter === 'all' || product.category === categoryFilter)
    .filter(product => !showFavoritesOnly || product.isFavorite),
    [searchTerm, products, currentBranchId, showFavoritesOnly, categoryFilter]
  );


  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity) - (item.discount || 0), 0), [cart]);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handlePayment = () => {
    if (cart.length > 0) {
      setPaymentModalOpen(true);
    } else {
      addNotification({ message: "Cart is empty!", type: 'warning' });
    }
  };
  
  const handleSuccessfulPayment = (payments: Payment[], finalStatus: Sale['status'], customer: Customer) => {
    const cashierName = session?.user?.user_metadata?.name || session?.user?.email || 'System';
    
    let finalPayments = [...payments];
    let amountAddedToCredit = 0;

    if (finalStatus === 'Credit') {
        const totalPaidByTender = payments.reduce((sum, p) => sum + p.amount, 0);
        amountAddedToCredit = total - totalPaidByTender;
        if (amountAddedToCredit > 0) {
            finalPayments.push({ method: 'Credit', amount: amountAddedToCredit });
        }
    }

    const newSale: Sale = {
        id: `sale_${Date.now()}`,
        customerName: customer.name,
        customerId: customer.id,
        cashierName,
        date: new Date().toISOString(),
        amount: total,
        status: finalStatus,
        branch: currentBranchName,
        items: cart,
        payments: finalPayments,
    };
    
    console.log("Sale completed:", newSale);

    if (finalStatus === 'Credit' && customer.id !== 'cust_4' && amountAddedToCredit > 0) {
        setCustomers(currentCustomers =>
            currentCustomers.map(c =>
                c.id === customer.id
                    ? { ...c, creditBalance: c.creditBalance + amountAddedToCredit }
                    : c
            )
        );
    }

    setProducts(currentProducts => {
        return currentProducts.map(p => {
            const newVariants = p.variants.map(v => {
                const cartItem = cart.find(item => item.id === v.id);
                if (cartItem) {
                    const newStockByBranch = { ...v.stockByBranch };
                    newStockByBranch[currentBranchId] = (newStockByBranch[currentBranchId] || 0) - cartItem.quantity;
                    return { ...v, stockByBranch: newStockByBranch };
                }
                return v;
            });
            return { ...p, variants: newVariants };
        });
    });
    
    dispatch({ type: 'CLEAR_CART' });
    setPaymentModalOpen(false);
    setIsChargeModalOpen(false);
    setSaleSuccessInfo(newSale);
  }
  
  const handleProcessRefund = (returnedItems: CartItem[], originalSale: Sale) => {
    setProducts(currentProducts => {
        return currentProducts.map(p => {
            const newVariants = p.variants.map(v => {
                 const returnedItem = returnedItems.find(item => item.id === v.id);
                 if (returnedItem) {
                    const newStockByBranch = { ...v.stockByBranch };
                    newStockByBranch[currentBranchId] = (newStockByBranch[currentBranchId] || 0) + returnedItem.quantity;
                    return { ...v, stockByBranch: newStockByBranch };
                 }
                 return v;
            });
            return { ...p, variants: newVariants };
        });
    });

    const totalRefundAmount = returnedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cashierName = session?.user?.user_metadata?.name || session?.user?.email || 'System';
    const refundSale: Sale = {
        id: `refund_${Date.now()}`,
        customerName: originalSale.customerName,
        customerId: originalSale.customerId,
        cashierName,
        date: new Date().toISOString(),
        amount: -totalRefundAmount,
        status: 'Refunded',
        branch: currentBranchName,
        items: returnedItems.map(item => ({...item, price: -item.price})),
        payments: [{ method: 'Cash', amount: -totalRefundAmount }],
    };

    console.log("Refund Processed: ", refundSale);

    setIsReturnModalOpen(false);
    addNotification({ message: `Refund of ${formatCurrency(totalRefundAmount, currency)} processed successfully.`, type: 'success' });
};

  const handleHoldSale = () => {
    if (cart.length === 0) {
      addNotification({ message: "Cart is empty!", type: 'warning' });
      return;
    }
    const newHeldSale: HeldSale = {
      id: Date.now().toString(),
      items: cart,
      timestamp: Date.now(),
      total: total,
    };
    setHeldSales(prev => [...prev, newHeldSale]);
    dispatch({ type: 'CLEAR_CART' });
    addNotification({ message: 'Sale has been put on hold.', type: 'info' });
  };
  
  const handleChargeToAccount = (customer: Customer) => {
    if (cart.length === 0) {
        addNotification({ message: "Cart is empty!", type: 'warning' });
        return;
    }
    handleSuccessfulPayment([], 'Credit', customer);
  };

  const handleRestoreSale = (saleId: string) => {
    if (cart.length > 0) {
        if (!window.confirm('This will replace your current cart. Are you sure?')) {
            return;
        }
    }
    const saleToRestore = heldSales.find(sale => sale.id === saleId);
    if (saleToRestore) {
        dispatch({ type: 'RESTORE_CART', payload: saleToRestore.items });
        setHeldSales(prev => prev.filter(sale => sale.id !== saleId));
        setHeldSalesModalOpen(false);
    }
  };

  const handleDeleteHeldSale = (saleId: string) => {
    setHeldSales(prev => prev.filter(sale => sale.id !== saleId));
  };
  
  const handleAddToCart = (product: Product, variant: ProductVariant) => {
    const stockInBranch = variant.stockByBranch[currentBranchId] || 0;
    if (stockInBranch <= 0) {
      addNotification({ message: `'${product.name}' is out of stock in this branch.`, type: 'error'});
      return;
    }

    const cartItem = cart.find(item => item.id === variant.id);
    if (cartItem && cartItem.quantity >= stockInBranch) {
        addNotification({ message: `Cannot add more of "${product.name}". Max stock quantity reached.`, type: 'warning'});
        return;
    }
    
    const variantName = Object.values(variant.options).join(' ');
    const cartItemName = variantName ? `${product.name} - ${variantName}` : product.name;

    const newCartItem: CartItem = {
        id: variant.id,
        productId: product.id,
        name: cartItemName,
        sku: variant.sku,
        price: variant.price,
        costPrice: variant.costPrice,
        imageUrl: product.imageUrl,
        quantity: 1,
        stock: stockInBranch
    };
    
    dispatch({ type: 'ADD_ITEM', payload: newCartItem });
    setIsDetailsModalOpen(false);
  };
  
  const handleProductClick = (product: Product) => {
    if (product.variants.length > 1) {
        handleShowProductDetails(product);
    } else if (product.variants.length === 1) {
        handleAddToCart(product, product.variants[0]);
    } else {
        addNotification({ message: `No purchasable versions found for '${product.name}'.`, type: 'error' });
    }
  }

  const handleSaveCustomer = (newCustomer: Omit<Customer, 'id' | 'creditBalance'>) => {
    const customerToAdd: Customer = {
        ...newCustomer,
        id: `cust_${Date.now()}`,
        creditBalance: 0
    };
    setCustomers(prev => [...prev, customerToAdd]);
    setIsCustomerModalOpen(false);
    setIsChargeModalOpen(true); // Re-open charge modal after adding
    addNotification({ message: `Customer "${customerToAdd.name}" added successfully.`, type: 'success'});
  };

  const handleScanSuccess = (scannedSku: string) => {
    setIsScannerModalOpen(false);
    for (const product of products) {
        for (const variant of product.variants) {
            if (variant.sku === scannedSku) {
                handleAddToCart(product, variant);
                return;
            }
        }
    }
    addNotification({ message: `Product with barcode SKU "${scannedSku}" not found.`, type: 'error'});
  };

  const handleShowProductDetails = (product: Product) => {
    setSelectedProductForDetails(product);
    setIsDetailsModalOpen(true);
  };

  const renderProductGrid = () => {
    if (contextLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
            <Loader className="animate-spin text-primary" size={48} />
        </div>
      );
    }

    if (filteredProducts.length === 0) {
        return (
             <div className="flex-1 flex items-center justify-center text-text-secondary">
                No products found.
            </div>
        )
    }

    return (
       <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
              onShowDetails={() => handleShowProductDetails(product)}
              onToggleFavorite={() => handleToggleFavorite(product.id)}
            />
          ))}
        </div>
    )
  }

  return (
    <>
        <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)] gap-6 print:hidden">
          {/* Product Selection */}
          <div className="flex-[2] bg-surface border border-border rounded-xl p-4 flex flex-col">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background border border-border rounded-lg pl-10 pr-12 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                 <button 
                    onClick={() => setShowFavoritesOnly(prev => !prev)} 
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg ${showFavoritesOnly ? 'bg-yellow-400/20 text-yellow-400' : 'text-text-secondary hover:bg-border'}`}
                    title="Toggle Favorites"
                >
                    <Star size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="relative flex-1 md:flex-none flex items-center gap-2">
                <button onClick={() => setIsScannerModalOpen(true)} className="p-2.5 bg-primary/20 hover:bg-primary/40 rounded-lg text-primary h-full" title="Scan Barcode">
                    <Barcode size={20}/>
                </button>
              </div>
            </div>
            <div className="mb-4">
                <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter} className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-auto">
                    {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
                </select>
            </div>
            {renderProductGrid()}
          </div>

          {/* Cart */}
          <div className="flex-1 bg-surface border border-border rounded-xl p-4 flex flex-col">
            <Cart
              cart={cart}
              dispatch={dispatch}
              subtotal={subtotal}
              tax={tax}
              total={total}
              onClear={() => dispatch({ type: 'CLEAR_CART' })}
              onHold={handleHoldSale}
              onPayment={handlePayment}
              onReturn={() => setIsReturnModalOpen(true)}
              heldSalesCount={heldSales.length}
              onOpenHeldSales={() => setHeldSalesModalOpen(true)}
              onChargeToAccount={() => setIsChargeModalOpen(true)}
            />
          </div>

          {isPaymentModalOpen && (
            <PaymentModal
              totalAmount={total}
              customer={customers.find(c => c.id === 'cust_4')}
              onClose={() => setPaymentModalOpen(false)}
              onConfirm={(payments, status) => handleSuccessfulPayment(payments, status, customers.find(c => c.id === 'cust_4')!)}
            />
          )}
          
          {isChargeModalOpen && (
            <ChargeToCustomerModal
                onClose={() => setIsChargeModalOpen(false)}
                onCharge={handleChargeToAccount}
                onAddNewCustomer={() => {
                    setIsChargeModalOpen(false);
                    setIsCustomerModalOpen(true);
                }}
            />
          )}

          {isHeldSalesModalOpen && (
            <HeldSalesModal
                heldSales={heldSales}
                onClose={() => setHeldSalesModalOpen(false)}
                onRestore={handleRestoreSale}
                onDelete={handleDeleteHeldSale}
            />
          )}

          {isCustomerModalOpen && (
              <CustomerFormModal
                onClose={() => setIsCustomerModalOpen(false)}
                onSave={handleSaveCustomer}
              />
          )}

          {isScannerModalOpen && (
            <BarcodeScannerModal
                onClose={() => setIsScannerModalOpen(false)}
                onScanSuccess={handleScanSuccess}
            />
           )}
           
          {isReturnModalOpen && (
            <ReturnModal
                salesHistory={mockSalesHistory}
                onClose={() => setIsReturnModalOpen(false)}
                onProcessRefund={handleProcessRefund}
            />
           )}

          {isDetailsModalOpen && selectedProductForDetails && (
            <ProductDetailsModal
                product={selectedProductForDetails}
                onClose={() => setIsDetailsModalOpen(false)}
                onAddToCart={handleAddToCart}
            />
           )}

          {saleSuccessInfo && (
              <SaleSuccessModal
                sale={saleSuccessInfo}
                onNewSale={() => {
                    setSaleSuccessInfo(null);
                }}
                onPrint={() => {
                    setSaleToPrint(saleSuccessInfo);
                }}
              />
          )}
        </div>
        <div className="hidden print:block">
            {saleToPrint && <Receipt sale={saleToPrint} />}
        </div>
    </>
  );
};

export default PosPage;