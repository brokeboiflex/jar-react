import { StateStorage } from "zustand/middleware";
import { ReactNode } from "react";
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
    location: string;
    navigate: (route: string) => void;
    goBack: () => void;
}
export interface LinkProps {
    to: string;
    children: ReactNode;
}
export declare function createLink(routerStore: () => RouterState): ({ to, children }: LinkProps) => import("react/jsx-runtime").JSX.Element;
export declare function createRouterStore(storage?: StateStorage, key?: string): () => RouterState;
export declare function Router({ children, routerStore }: RouterProps): import("react/jsx-runtime").JSX.Element | null;
export declare function Route({ path, component }: RouteProps): null;
