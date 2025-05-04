# JAR React

A custom router with syntax similiar to `preact-iso` that abstracts routing from `window.location` and gives developers more control over persistence.

# Usage

JAR uses `zustand` under the hood giving developers freedom over how they want to store the state. If you want to persist te state you have to provide the `createRouterStore` function with your preffered storage.

Below is an example of usage in chrome extension development with [`zustand-chrome-storage`](https://www.npmjs.com/package/zustand-chrome-storage).

```ts
//app.tsx
import { ChromeSessionStorage } from "zustand-chrome-storage";
import { Router, createRouterStore, createLink, Route } from "jar-react";

// Assign unique id to make each tab have it's own router
export const useRouter = createRouterStore(ChromeSessionStorage, uuidv4());
export const Link = createLink(useRouter);

export default function App() {
  return (
    <Router routerStore={useRouter}>
      <Route path="/" component={<MyRootPage />} />
      <Route path="/signup" component={<MySignupPage />} />
    </Router>
  );
}
```

As you can see we use `createRouterStore` to create reusable `useRouter` function and `createLink` to create a reusable `Link` component. We can import those in other components to navigate between them, display current location and history or to go back.

```ts
import { useRouter } from "../app";

export function MyRootPage() {
  const {history, location, navigate, goBack} = useRouter()

  return (
    ...
  );
}
```
