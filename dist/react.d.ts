import type { MouseEvent, ReactNode } from "react";
import { type CreateRouterStoreOptions, type RouterState, type RouterStoreApi } from "./core";
import type { StateStorage } from "zustand/middleware";
export type { CreateRouterStoreOptions, RouterPersistedState, RouterState, RouterStoreApi, } from "./core";
export type RouterStore = (() => RouterState) & RouterStoreApi;
export declare function createRouterStore(storageOrOptions?: StateStorage | CreateRouterStoreOptions, key?: string): RouterStore;
export interface RouterProps {
    children: ReactNode;
    routerStore: RouterStore;
}
export interface RouteProps {
    path: string;
    component: ReactNode;
}
export interface LinkProps {
    to: string;
    children: ReactNode;
}
export declare function createLink(routerStore: RouterStore): ({ to, children }: LinkProps) => import("react").DetailedReactHTMLElement<{
    href: string;
    onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}, HTMLElement>;
export declare function Router({ children, routerStore }: RouterProps): import("react").FunctionComponentElement<{
    children?: ReactNode | undefined;
}> | null;
export declare function Route(_props: RouteProps): null;
