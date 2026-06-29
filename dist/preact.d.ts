import type { ComponentChildren, JSX, VNode } from "preact";
import { type CreateRouterStoreOptions, type RouterState, type RouterStoreApi } from "./core";
import type { StateStorage } from "zustand/middleware";
export type { CreateRouterStoreOptions, RouterPersistedState, RouterState, RouterStoreApi, } from "./core";
export type RouterStore = (() => RouterState) & RouterStoreApi;
export declare function createRouterStore(storageOrOptions?: StateStorage | CreateRouterStoreOptions, key?: string): RouterStore;
export interface RouterProps {
    children: ComponentChildren;
    routerStore: RouterStore;
}
export interface RouteProps {
    path: string;
    component: ComponentChildren;
}
export interface LinkProps {
    to: string;
    children: ComponentChildren;
}
export declare function createLink(routerStore: RouterStore): ({ to, children }: LinkProps) => VNode<import("preact").ClassAttributes<HTMLElement> & {
    href: string;
    onClick: (event: JSX.TargetedMouseEvent<HTMLAnchorElement>) => void;
}>;
export declare function Router({ children, routerStore }: RouterProps): VNode<import("preact").Attributes> | null;
export declare function Route(_props: RouteProps): null;
