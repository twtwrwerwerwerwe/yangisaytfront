import { create } from "zustand";

interface OrderModalState {
  isOpen: boolean;
  prefillRouteId: string | null;
  open: (routeId?: string) => void;
  close: () => void;
}

export const useOrderModalStore = create<OrderModalState>((set) => ({
  isOpen: false,
  prefillRouteId: null,
  open: (routeId) => set({ isOpen: true, prefillRouteId: routeId || null }),
  close: () => set({ isOpen: false, prefillRouteId: null }),
}));
