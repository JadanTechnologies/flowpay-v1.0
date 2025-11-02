import React, { useMemo } from 'react';
import { PlusCircle, Info, Star, Layers } from 'lucide-react';
import { Product } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/formatting';

interface ProductCardProps {
  product: Product & { stock: number };
  onClick: () => void;
  onShowDetails: () => void;
  onToggleFavorite: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onShowDetails, onToggleFavorite }) => {
  const isOutOfStock = product.stock <= 0;
  const { currency } = useAppContext();

  const hasVariants = product.variants.length > 1;

  const priceDisplay = useMemo(() => {
    if (product.variants.length === 0) return 'N/A';
    if (product.variants.length === 1) return formatCurrency(product.variants[0].price, currency);

    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) return formatCurrency(minPrice, currency);

    return `${formatCurrency(minPrice, currency)} - ${formatCurrency(maxPrice, currency)}`;

  }, [product.variants, currency]);

  return (
    <div 
      className={`
        bg-background border border-border rounded-lg p-3 flex flex-col items-center justify-between relative
        group transition-colors cursor-pointer
        ${isOutOfStock 
          ? 'opacity-50 grayscale' 
          : 'hover:border-primary'
        }
      `}
      onClick={isOutOfStock ? undefined : onClick}
    >
      {isOutOfStock && (
        <span className="absolute top-2 left-2 bg-red-900 text-red-300 text-xs font-bold px-2 py-1 rounded-full z-10">
          Out of Stock
        </span>
      )}
      
      {hasVariants && (
        <span className="absolute top-2 left-2 bg-blue-900 text-blue-300 text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center gap-1">
          <Layers size={12} /> Variants
        </span>
      )}
      
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-2 right-2 p-1.5 bg-background/50 rounded-full text-yellow-400 hover:text-yellow-300 z-10"
        title={product.isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Star size={16} fill={product.isFavorite ? 'currentColor' : 'none'} />
      </button>

      <button
        onClick={(e) => {
            e.stopPropagation();
            onShowDetails();
        }}
        className="absolute bottom-2 left-2 p-1.5 bg-background/50 rounded-full text-text-secondary hover:text-primary hover:bg-background z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        title="View details"
      >
        <Info size={16} />
      </button>
      
      <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md mb-2" />
      <div className="text-center">
        <h3 className={`font-semibold text-sm text-text-primary ${!isOutOfStock && 'group-hover:text-primary'} transition-colors`}>{product.name}</h3>
        <p className="text-xs text-text-secondary">{priceDisplay}</p>
      </div>
      
      {!isOutOfStock && (
        <div className="absolute bottom-2 right-2 p-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <PlusCircle size={24} />
        </div>
      )}
    </div>
  );
};

export default ProductCard;