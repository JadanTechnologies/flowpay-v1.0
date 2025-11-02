import React, { useState, useMemo, useEffect } from 'react';
import { Product, ProductVariant } from '../../types';
import Modal from '../ui/Modal';
import { ShoppingCart, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose, onAddToCart }) => {
    const { currency, currentBranchId } = useAppContext();
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    // Pre-select the first available option for each attribute
    useEffect(() => {
        const defaultOptions: Record<string, string> = {};
        product.variantOptions.forEach(opt => {
            if (opt.values.length > 0) {
                defaultOptions[opt.name] = opt.values[0];
            }
        });
        setSelectedOptions(defaultOptions);
    }, [product]);

    const currentVariant = useMemo(() => {
        if (product.variants.length === 1) return product.variants[0];
        return product.variants.find(v => 
            Object.entries(selectedOptions).every(([key, value]) => v.options[key] === value)
        );
    }, [selectedOptions, product]);
    
    const stockInBranch = currentVariant?.stockByBranch[currentBranchId] ?? 0;
    const isOutOfStock = stockInBranch <= 0;
    const isLowStock = stockInBranch > 0 && currentVariant && stockInBranch <= currentVariant.lowStockThreshold;

    const getStockStatus = () => {
        if (!currentVariant) {
             return (
                <div className="flex items-center gap-2 text-text-secondary">
                    <span className="font-semibold">Unavailable</span>
                </div>
            );
        }
        if (isOutOfStock) {
            return (
                <div className="flex items-center gap-2 text-red-400">
                    <XCircle size={18} />
                    <span className="font-semibold">Out of Stock</span>
                </div>
            );
        }
        if (isLowStock) {
            return (
                <div className="flex items-center gap-2 text-yellow-400">
                    <AlertTriangle size={18} />
                    <span className="font-semibold">Low Stock ({stockInBranch} left)</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2 text-green-400">
                <CheckCircle size={18} />
                <span className="font-semibold">In Stock</span>
            </div>
        );
    };

    const handleOptionSelect = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({...prev, [optionName]: value}));
    }

    return (
        <Modal title={product.name} onClose={onClose}>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-lg" />
                    <div className="flex flex-col">
                        <p className="text-sm text-text-secondary">SKU: {currentVariant?.sku || 'N/A'}</p>
                        
                        <div className="my-4">
                            <span className="text-4xl font-extrabold text-primary">{currentVariant ? formatCurrency(currentVariant.price, currency) : 'Select options'}</span>
                        </div>
                        
                        <div className="space-y-4">
                            {product.variantOptions.map(option => (
                                <div key={option.name}>
                                    <h4 className="text-sm font-bold text-text-secondary mb-2">{option.name}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {option.values.map(value => (
                                            <button
                                                key={value}
                                                onClick={() => handleOptionSelect(option.name, value)}
                                                className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-colors ${selectedOptions[option.name] === value ? 'border-primary bg-primary/20 text-primary' : 'border-border bg-background hover:border-gray-600'}`}
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                         <div className="flex justify-between items-center bg-background p-3 rounded-md border border-border mt-4">
                            <span className="text-text-secondary font-medium">Availability</span>
                            {getStockStatus()}
                        </div>

                        <div className="mt-auto pt-4">
                            <button 
                                onClick={() => currentVariant && onAddToCart(product, currentVariant)}
                                disabled={!currentVariant || isOutOfStock}
                                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-700 disabled:text-text-secondary disabled:cursor-not-allowed"
                            >
                                <ShoppingCart size={18} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProductDetailsModal;