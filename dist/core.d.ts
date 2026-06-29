import type { StoreApi } from "zustand/vanilla";
import { type StateStorage } from "zustand/middleware";
export interface RouterState {
    history: string[];
    canGoBack: boolean;
    location: string;
    navigate: (route: string) => void;
    goBack: () => void;
    clearHistory: () => void;
}
export interface RouterPersistedState {
    history: string[];
    location: string;
}
export interface CreateRouterStoreOptions {
    storage?: StateStorage;
    key?: string;
    initialLocation?: string;
}
export type RouterStoreApi = StoreApi<RouterState>;
export declare function createRouterStoreApi(storageOrOptions?: StateStorage | CreateRouterStoreOptions, key?: string): RouterStoreApi;
