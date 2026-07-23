import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  cartItemId?: string;
  selectedMetal?: string;
  selectedSize?: string;
}

export type ViewMode = 'app' | 'admin' | 'page' | 'terms' | 'boutique' | 'locator';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, cartItemId?: string) => void;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;
  
  activeInfoModal: "archive" | "care" | null;
  setActiveInfoModal: (modal: "archive" | "care" | null) => void;
  
  showWhatsAppMenu: boolean;
  setShowWhatsAppMenu: (show: boolean) => void;
  
  showShareMenu: boolean;
  setShowShareMenu: (show: boolean) => void;

  showSocialMenu: boolean;
  setShowSocialMenu: (show: boolean) => void;

  direction: number;
  setDirection: (dir: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark', // default to dark mood
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      
      cart: [],
      addToCart: (item) => set((state) => {
        const itemIdentifier = item.cartItemId || item.id;
        const existing = state.cart.find(
          (i) => i.id === item.id && 
                 i.selectedMetal === item.selectedMetal && 
                 i.selectedSize === item.selectedSize
        );
        if (existing) {
          return {
            cart: state.cart.map((i) => 
               (i.id === item.id && i.selectedMetal === item.selectedMetal && i.selectedSize === item.selectedSize) 
                 ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        return { cart: [...state.cart, { ...item, cartItemId: Math.random().toString(36).substr(2, 9) }] };
      }),
      removeFromCart: (id, cartItemId) => set((state) => ({
        cart: state.cart.filter((i) => cartItemId ? i.cartItemId !== cartItemId : i.id !== id)
      })),
      updateCartItemQuantity: (cartItemId, quantity) => set((state) => ({
        cart: state.cart.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item)
      })),
      clearCart: () => set({ cart: [] }),

      viewMode: 'app',
      setViewMode: (mode) => set({ viewMode: mode }),

      currentIndex: 0,
      setCurrentIndex: (index) => set({ currentIndex: index }),

      isMenuOpen: false,
      setIsMenuOpen: (open) => set({ isMenuOpen: open }),

      isContactOpen: false,
      setIsContactOpen: (open) => set({ isContactOpen: open }),

      activeInfoModal: null,
      setActiveInfoModal: (modal) => set({ activeInfoModal: modal }),

      showWhatsAppMenu: false,
      setShowWhatsAppMenu: (show) => set({ showWhatsAppMenu: show }),

      showShareMenu: false,
      setShowShareMenu: (show) => set({ showShareMenu: show }),

      showSocialMenu: false,
      setShowSocialMenu: (show) => set({ showSocialMenu: show }),

      direction: 0,
      setDirection: (dir) => set({ direction: dir }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        cart: state.cart, 
        viewMode: state.viewMode,
        currentIndex: state.currentIndex
      }),
    }
  )
);
