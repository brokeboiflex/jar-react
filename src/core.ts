import { createStore } from "zustand/vanilla";
import type { StateCreator, StoreApi } from "zustand/vanilla";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

const DEFAULT_LOCATION = "/";
const STORAGE_PREFIX = "router-storage";

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

function isStorage(value: unknown): value is StateStorage {
  return (
    typeof value === "object" &&
    value !== null &&
    "getItem" in value &&
    "setItem" in value &&
    "removeItem" in value
  );
}

function normalizeLocation(location: unknown): string {
  return typeof location === "string" && location.length > 0
    ? location
    : DEFAULT_LOCATION;
}

function normalizeHistory(history: unknown, location: string): string[] {
  const nextHistory = Array.isArray(history)
    ? history.filter(
        (entry): entry is string => typeof entry === "string" && entry.length > 0
      )
    : [];

  if (nextHistory.length === 0) {
    nextHistory.push(location);
  }

  if (nextHistory[nextHistory.length - 1] !== location) {
    nextHistory.push(location);
  }

  return nextHistory;
}

function createSnapshot(history: unknown, location: unknown): RouterPersistedState &
  Pick<RouterState, "canGoBack"> {
  const nextLocation = normalizeLocation(location);
  const nextHistory = normalizeHistory(history, nextLocation);

  return {
    history: nextHistory,
    location: nextLocation,
    canGoBack: nextHistory.length > 1,
  };
}

function createInitialSnapshot(initialLocation: string) {
  return createSnapshot([initialLocation], initialLocation);
}

function createStorageName(key?: string): string {
  return key ? `${STORAGE_PREFIX}-${key}` : STORAGE_PREFIX;
}

function resolveOptions(
  storageOrOptions?: StateStorage | CreateRouterStoreOptions,
  key?: string
): CreateRouterStoreOptions {
  if (isStorage(storageOrOptions)) {
    return { storage: storageOrOptions, key };
  }

  return storageOrOptions ?? {};
}

function createRouterInitializer(initialLocation: string): StateCreator<RouterState> {
  return (set) => ({
    ...createInitialSnapshot(initialLocation),
    navigate: (route: string) =>
      set((state) => {
        const location = normalizeLocation(route);
        const current = createSnapshot(state.history, state.location);
        return createSnapshot([...current.history, location], location);
      }),
    goBack: () =>
      set((state) => {
        const current = createSnapshot(state.history, state.location);

        if (current.history.length <= 1) {
          return current;
        }

        const history = current.history.slice(0, -1);
        const location = history[history.length - 1] ?? initialLocation;
        return createSnapshot(history, location);
      }),
    clearHistory: () => set(() => createInitialSnapshot(initialLocation)),
  });
}

function mergePersistedState(
  persistedState: unknown,
  currentState: RouterState
): RouterState {
  if (typeof persistedState !== "object" || persistedState === null) {
    return currentState;
  }

  const { history, location } = persistedState as Partial<RouterPersistedState>;
  return {
    ...currentState,
    ...createSnapshot(history, location),
  };
}

export function createRouterStoreApi(
  storageOrOptions?: StateStorage | CreateRouterStoreOptions,
  key?: string
): RouterStoreApi {
  const options = resolveOptions(storageOrOptions, key);
  const initialLocation = normalizeLocation(options.initialLocation);
  const initializer = createRouterInitializer(initialLocation);

  if (!options.storage) {
    return createStore<RouterState>()(initializer);
  }

  return createStore<RouterState>()(
    persist<RouterState, [], [], RouterPersistedState>(initializer, {
      name: createStorageName(options.key),
      storage: createJSONStorage(() => options.storage as StateStorage),
      partialize: (state) => ({
        history: state.history,
        location: state.location,
      }),
      merge: mergePersistedState,
    })
  );
}
