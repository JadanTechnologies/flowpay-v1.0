import React, { useState, useMemo, useEffect } from 'react';
import { Product, ProductVariant } from '../../types';
import Modal from '../ui/Modal';
import { useAppContext } from '../../contexts/AppContext';
import { PlusCircle, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface ProductFormProps {
    product: Product | null;
    onSave: (productData: Product) => void;
    onClose: () => void;
}

const cartesian = <T,>(...a: T[][]): T[][] => {
  if (a.length === 0) return [[]];
  return a.reduce<T[][]>((acc, b) => acc.flatMap(d => b.map(e => [...d, e])), [[]]);
};

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onClose }) => {
    const { branches, suppliers } = useAppContext();

    const [name, setName] = useState(product?.name || '');
    const [category, setCategory] = useState(product?.category || '');
    const [supplierId, setSupplierId] = useState(product?.supplier || '');
    const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
    const [hasVariants, setHasVariants] = useState(product ? product.variantOptions.length > 0 : false);
    const [variantOptions, setVariantOptions] = useState(product?.variantOptions.map(opt => ({...opt, values: opt.values.join(', ')})) || [{ name: 'Size', values: 'S, M, L' }]);
    const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || []);
    const [isUploading, setIsUploading] = useState(false);
    
    // Auto-generate variants when options change
    useEffect(() => {
        if (hasVariants) {
            const options = variantOptions
                .map(opt => opt.values.split(',').map(v => v.trim()).filter(Boolean))
                .filter(o => o.length > 0);
            
            const optionNames = variantOptions.map(opt => opt.name.trim()).filter(Boolean);
            
            if (options.length > 0 && optionNames.length === options.length) {
                const combinations = cartesian(...options);
                const newVariants = combinations.map((combo, index) => {
                    const optionsObj: Record<string, string> = {};
                    optionNames.forEach((name, i) => {
                        // FIX: Explicitly cast combo item to string to resolve type error.
                        optionsObj[name] = combo[i] as string;
                    });
                    
                    const existingVariant = variants.find(v => JSON.stringify(v.options) === JSON.stringify(optionsObj));
                    
                    return existingVariant || {
                        id: `new_${Date.now()}_${index}`,
                        sku: '',
                        price: 0,
                        costPrice: 0,
                        stockByBranch: {},
                        lowStockThreshold: 10,
                        options: optionsObj,
                    };
                });
                setVariants(newVariants);
            } else {
                setVariants([]);
            }
        } else {
             // For simple product, ensure there's one variant but only if we are creating a new product
            if (variants.length === 0 && !product) {
                setVariants([{
                    id: `new_${Date.now()}_0`,
                    sku: '', price: 0, costPrice: 0, stockByBranch: {}, lowStockThreshold: 10, options: {}
                }]);
            } else if (variants.length > 1) { // If switching from multi-variant to simple, keep first variant
                setVariants(v => [v[0]]);
            }
        }
    }, [hasVariants, variantOptions, product]);


    const handleOptionNameChange = (index: number, newName: string) => {
        const newOptions = [...variantOptions];
        newOptions[index].name = newName;
        setVariantOptions(newOptions);
    };

    const handleOptionValuesChange = (index: number, newValues: string) => {
        const newOptions = [...variantOptions];
        newOptions[index].values = newValues;
        setVariantOptions(newOptions);
    };

    const addOption = () => setVariantOptions([...variantOptions, { name: '', values: '' }]);
    const removeOption = (index: number) => setVariantOptions(variantOptions.filter((_, i) => i !== index));

    const handleVariantChange = (variantId: string, field: keyof Omit<ProductVariant, 'id' | 'options' | 'stockByBranch'>, value: any) => {
        setVariants(variants.map(v => v.id === variantId ? { ...v, [field]: value } : v));
    };
    
    const handleVariantStockChange = (variantId: string, branchId: string, value: string) => {
        const stock = parseInt(value, 10);
        setVariants(variants.map(v => {
            if (v.id === variantId) {
                const newStock = { ...v.stockByBranch, [branchId]: isNaN(stock) ? 0 : stock };
                return { ...v, stockByBranch: newStock };
            }
            return v;
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `product-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images') // Assumes a public bucket named 'product-images'
                .upload(filePath, file);
            
            setIsUploading(false);
            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                alert('Failed to upload image. Please check the console for details.');
                return;
            }

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setImageUrl(data.publicUrl);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalProductData = {
            id: product?.id || `prod_${Date.now()}`,
            name, category, supplier: supplierId, imageUrl,
            isFavorite: product?.isFavorite || false,
            variantOptions: hasVariants ? variantOptions.map(opt => ({ ...opt, values: opt.values.split(',').map(v => v.trim())})) : [],
            variants: variants.map((v, i) => ({...v, id: v.id.startsWith('new_') ? `${product?.id || `prod_${Date.now()}`}_${i}` : v.id })),
        };
        onSave(finalProductData);
    };

    return (
        <Modal title={product ? 'Edit Product' : 'Add New Product'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                        <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm"/>
                        <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                     <div className="md:col-span-2">
                        <label className="text-sm text-text-secondary block mb-1">Product Image</label>
                        <div className="flex items-center gap-4 mt-2">
                            {imageUrl && <img src={imageUrl} alt="Product Preview" className="h-16 w-16 object-cover rounded-md" />}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                disabled={isUploading}
                                className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                            />
                             {isUploading && <span className="text-xs text-text-secondary">Uploading...</span>}
                        </div>
                    </div>
                    
                    {/* Variants Toggle */}
                    <div className="flex items-center gap-2 pt-4 border-t border-border">
                        <input type="checkbox" id="hasVariants" checked={hasVariants} onChange={e => setHasVariants(e.target.checked)} className="h-4 w-4 rounded border-gray-600 text-primary focus:ring-primary bg-surface"/>
                        <label htmlFor="hasVariants" className="text-sm font-medium">This product has multiple options, like size or color</label>
                    </div>

                    {/* Variant Options Editor */}
                    {hasVariants && (
                        <div className="space-y-2 p-3 bg-background rounded-lg border border-border">
                            <h3 className="font-semibold text-sm">Product Options</h3>
                            {variantOptions.map((opt, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" placeholder="Option Name (e.g., Size)" value={opt.name} onChange={e => handleOptionNameChange(index, e.target.value)} className="w-1/3 bg-surface border border-border rounded-md px-2 py-1 text-sm"/>
                                    <input type="text" placeholder="Comma-separated values (e.g., S, M, L)" value={opt.values} onChange={e => handleOptionValuesChange(index, e.target.value)} className="flex-1 bg-surface border border-border rounded-md px-2 py-1 text-sm"/>
                                    <button type="button" onClick={() => removeOption(index)}><Trash2 className="text-red-500" size={16}/></button>
                                </div>
                            ))}
                            <button type="button" onClick={addOption} className="text-sm text-primary hover:underline">+ Add another option</button>
                        </div>
                    )}
                    
                    {/* Variants Table */}
                    <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold">{hasVariants ? 'Variants' : 'Pricing & Stock'}</h3>
                         <div className="overflow-x-auto -mx-6">
                            <table className="w-full text-sm mt-2">
                                <thead className="bg-background text-text-secondary text-left">
                                    <tr>
                                        {hasVariants && <th className="px-2 py-2">Options</th>}
                                        <th className="px-2 py-2">SKU</th>
                                        <th className="px-2 py-2">Price</th>
                                        <th className="px-2 py-2">Cost Price</th>
                                        <th className="px-2 py-2">Low Stock</th>
                                        {branches.map(b => <th key={b.id} className="px-2 py-2">{b.name} Stock</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map(variant => (
                                        <tr key={variant.id} className="border-b border-border">
                                            {hasVariants && <td className="px-2 py-1 font-semibold">{Object.values(variant.options).join(' / ')}</td>}
                                            <td className="px-2 py-1"><input type="text" value={variant.sku} onChange={e => handleVariantChange(variant.id, 'sku', e.target.value)} required className="w-32 bg-surface border border-border rounded-md px-2 py-1"/></td>
                                            <td className="px-2 py-1"><input type="number" step="0.01" value={variant.price} onChange={e => handleVariantChange(variant.id, 'price', parseFloat(e.target.value))} required className="w-24 bg-surface border border-border rounded-md px-2 py-1"/></td>
                                            <td className="px-2 py-1"><input type="number" step="0.01" value={variant.costPrice} onChange={e => handleVariantChange(variant.id, 'costPrice', parseFloat(e.target.value))} required className="w-24 bg-surface border border-border rounded-md px-2 py-1"/></td>
                                            <td className="px-2 py-1"><input type="number" value={variant.lowStockThreshold} onChange={e => handleVariantChange(variant.id, 'lowStockThreshold', parseInt(e.target.value))} required className="w-20 bg-surface border border-border rounded-md px-2 py-1"/></td>
                                            {branches.map(b => (
                                                <td key={b.id} className="px-2 py-1"><input type="number" value={variant.stockByBranch[b.id] || ''} onChange={e => handleVariantStockChange(variant.id, b.id, e.target.value)} className="w-20 bg-surface border border-border rounded-md px-2 py-1"/></td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-border hover:bg-border/70 text-text-primary font-semibold py-2 px-4 rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg text-sm">Save Product</button>
                </div>
            </form>
        </Modal>
    );
};

export default ProductForm;