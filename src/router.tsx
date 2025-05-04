import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { create } from "zustand";
import { ReactNode, Fragment, isValidElement } from "react";
export interface RouterProps {
  children: ReactNode;
  routerStore: () => RouterState;
}
export interface RouteProps {
  path: string;
  component: ReactNode;
}

export interface RouterState {
  history: string[];
  canGoBack: boolean;
  location: string;
  navigate: (route: string) => void;
  goBack: () => void;
  clearHistory: () => void;
}

export interface LinkProps {
  to: string;
  children: ReactNode;
}

export function createLink(routerStore: () => RouterState) {
  return function Link({ to, children }: LinkProps) {
    const { navigate } = routerStore();
    return (
      <a
        href=""
        onClick={(e) => {
          e.preventDefault();
          navigate(to);
        }}
      >
        {children}
      </a>
    );
  };
}
export function createRouterStore(
  storage?: StateStorage,
  key?: string
): () => RouterState {
  // @ts-ignore

  if (storage) {
    return create<RouterState>()(
      persist(
        (set) => ({
          history: ["/"],
          location: "/", // Default route
          canGoBack: false,
          navigate: (route: string) =>
            set((state: RouterState) => ({
              history: [...state.history, route],
              location: route,
              canGoBack: history.length > 1,
            })),
          goBack: () =>
            set((state: RouterState) => ({
              location: state.history[state.history.length - 2],
              history: [...state.history].slice(0, -1),
              canGoBack: history.length > 1,
            })),
          clearHistory: () =>
            set(() => ({
              history: ["/"],
              location: "/",
              canGoBack: false,
            })),
        }),
        {
          name: `router-storage${key ? "-" + key : ""}`,
          storage: createJSONStorage(() => storage),
        }
      )
    );
  } else {
    return create<RouterState>()((set) => ({
      history: ["/"],
      canGoBack: false,
      location: "/", // Default route
      navigate: (route: string) =>
        set((state: RouterState) => ({
          history: [...state.history, route],
          location: route,
          canGoBack: history.length > 1,
        })),
      goBack: () =>
        set((state: RouterState) => ({
          location: state.history[state.history.length - 2],
          history: [...state.history].slice(0, -1),
          canGoBack: history.length > 1,
        })),
      clearHistory: () =>
        set(() => ({
          history: ["/"],
          location: "/",
          canGoBack: false,
        })),
    }));
  }
}
export function Router({ children, routerStore }: RouterProps) {
  const { location } = routerStore();

  // Filter children to get Route components
  const routes = Array.isArray(children) ? children : [children];
  const routeElements = routes.filter(
    (child) => isValidElement(child) && (child as any).type === Route
  );

  // Find the component that matches the current route
  const currentRoute = routeElements.find((route) => {
    const routeProps = (route as any).props as RouteProps;
    return routeProps.path === location;
  });

  return currentRoute ? (
    <Fragment key={location}>{(currentRoute as any).props.component}</Fragment>
  ) : null;
}

// Route component
// @ts-ignore
export function Route({ path, component }: RouteProps) {
  return null;
}
