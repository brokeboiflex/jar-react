import { StateStorage } from "zustand/middleware";
import { ComponentChildren } from "preact";
export interface RouterProps {
    children: ComponentChildren;
    routerStore: () => RouterState;
}
export interface RouteProps {
    path: string;
    component: ComponentChildren;
}
export interface RouterState {
    history: string[];
    location: string;
    navigate: (route: string) => void;
    goBack: () => void;
}
export interface LinkProps {
    to: string;
    children: ComponentChildren;
}
export declare function createLink(routerStore: () => RouterState): ({ to, children }: LinkProps) => import("preact").JSX.Element;
export declare function createRouterStore(storage?: StateStorage, key?: string): () => RouterState;
export declare function Router({ children, routerStore }: RouterProps): import("preact").JSX.Element | null;
export declare function Route({ path, component }: RouteProps): null;
