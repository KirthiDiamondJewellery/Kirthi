import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

export default function FilterModal({
  isOpen,
  onClose,
  categories,
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc') => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[500] md:hidden"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#D4AF37]/30 rounded-t-3xl z-[501] md:hidden pb-[env(safe-area-inset-bottom,24px)] flex flex-col max-h-[85vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm md:text-[11px]">Filters & Sort</h3>
              <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-8 flex-1 custom-scrollbar">
              {/* Sort By */}
              <div>
                <h4 className="text-white/60 uppercase tracking-[0.2em] text-xs md:text-[10px] mb-4">Sort By</h4>
                <div className="space-y-1">
                  {[
                    { id: 'featured', label: 'Featured' },
                    { id: 'price-asc', label: 'Price: Low to High' },
                    { id: 'price-desc', label: 'Price: High to Low' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id as any);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between py-3 text-left border-b border-white/5 last:border-0 cursor-pointer"
                    >
                      <span className={`text-sm md:text-[12px] uppercase tracking-wider ${sortBy === option.id ? 'text-[#D4AF37]' : 'text-white'}`}>
                        {option.label}
                      </span>
                      {sortBy === option.id && <Check size={16} className="text-[#D4AF37]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-white/60 uppercase tracking-[0.2em] text-xs md:text-[10px] mb-4">Categories</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between py-3 text-left border-b border-white/5 last:border-0 cursor-pointer"
                    >
                      <span className={`text-sm md:text-[12px] uppercase tracking-wider ${activeCategory === cat ? 'text-[#D4AF37]' : 'text-white'}`}>
                        {cat}
                      </span>
                      {activeCategory === cat && <Check size={16} className="text-[#D4AF37]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
