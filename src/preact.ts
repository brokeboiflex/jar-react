import { Fragment, h, isValidElement } from "preact";
import type { ComponentChildren, JSX, VNode } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
  createRouterStoreApi,
  type CreateRouterStoreOptions,
  type RouterState,
  type RouterStoreApi,
} from "./core";
import type { StateStorage } from "zustand/middleware";

export type {
  CreateRouterStoreOptions,
  RouterPersistedState,
  RouterState,
  RouterStoreApi,
} from "./core";

export type RouterStore = (() => RouterState) & RouterStoreApi;

function bindRouterStore(routerStoreApi: RouterStoreApi): RouterStore {
  function useRouter() {
    const [state, setState] = useState(routerStoreApi.getState);

    useEffect(() => {
      return routerStoreApi.subscribe((nextState) => setState(nextState));
    }, []);

    return state;
  }

  return Object.assign(useRouter, routerStoreApi);
}

export function createRouterStore(
  storageOrOptions?: StateStorage | CreateRouterStoreOptions,
  key?: string
): RouterStore {
  return bindRouterStore(createRouterStoreApi(storageOrOptions, key));
}

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

export function createLink(routerStore: RouterStore) {
  return function Link({ to, children }: LinkProps) {
    const { navigate } = routerStore();

    return h(
      "a",
      {
        href: to,
        onClick: (event: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
          navigate(to);
        },
      },
      children
    );
  };
}

function isRouteElement(child: ComponentChildren): child is VNode<RouteProps> {
  return isValidElement(child) && child.type === Route;
}

export function Router({ children, routerStore }: RouterProps) {
  const { location } = routerStore();
  const routes = Array.isArray(children) ? children : [children];
  const currentRoute = routes.filter(isRouteElement).find((route) => {
    return route.props.path === location;
  });

  return currentRoute
    ? h(Fragment, { key: location }, currentRoute.props.component)
    : null;
}

export function Route(_props: RouteProps) {
  return null;
}
