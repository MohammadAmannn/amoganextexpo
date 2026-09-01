import { create } from 'zustand'
interface AppState { activeOrganizationId: string | null; setActiveOrganizationId(id: string | null): void }
export const useAppStore = create<AppState>((set) => ({ activeOrganizationId: null, setActiveOrganizationId: (activeOrganizationId) => set({ activeOrganizationId }) }))
