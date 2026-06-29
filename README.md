# JAR

JAR is a JSX Abstract Router for React and Preact. It keeps route state in a
Zustand store instead of binding routing to `window.location`, which makes it a
good fit for popups, extensions, embedded panels, and other non-document router
surfaces.

This package ships both framework adapters from one codebase:

- React: `jar` or `jar/react`
- Preact: `jar/preact`

## Install

React apps need React and Zustand:

```sh
npm install jar react zustand
```

Preact apps need Preact and Zustand:

```sh
npm install jar preact zustand
```

React and Preact are optional peers so one framework does not force-install the
other. Zustand is the shared required peer.

## React Usage

```tsx
import { Route, Router, createLink, createRouterStore } from "jar";
import { getChromeSessionStorage } from "zustand-chrome-storage";

export const useRouter = createRouterStore(getChromeSessionStorage(), "tab-1");
export const Link = createLink(useRouter);

export default function App() {
  return (
    <Router routerStore={useRouter}>
      <Route path="/" component={<MyRootPage />} />
      <Route path="/settings" component={<MySettingsPage />} />
    </Router>
  );
}
```

## Preact Usage

```tsx
import { Route, Router, createLink, createRouterStore } from "jar/preact";
import { getChromeSessionStorage } from "zustand-chrome-storage";

export const useRouter = createRouterStore(getChromeSessionStorage(), "tab-1");
export const Link = createLink(useRouter);

export default function App() {
  return (
    <Router routerStore={useRouter}>
      <Route path="/" component={<MyRootPage />} />
      <Route path="/settings" component={<MySettingsPage />} />
    </Router>
  );
}
```

## Router State

```ts
const { history, location, canGoBack, navigate, goBack, clearHistory } =
  useRouter();
```

`createRouterStore` accepts either the legacy positional signature:

```ts
createRouterStore(storage, "tab-1");
```

or an options object:

```ts
createRouterStore({
  storage,
  key: "tab-1",
  initialLocation: "/popup",
});
```
