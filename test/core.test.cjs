const assert = require("node:assert/strict");
const test = require("node:test");
const { createRouterStore } = require("../dist/index.cjs");

function createMemoryStorage(initial = {}) {
  const values = { ...initial };

  return {
    getItem(name) {
      return Object.prototype.hasOwnProperty.call(values, name)
        ? values[name]
        : null;
    },
    setItem(name, value) {
      values[name] = value;
    },
    removeItem(name) {
      delete values[name];
    },
    values,
  };
}

test("router state derives canGoBack from internal history", () => {
  const routerStore = createRouterStore();

  assert.deepEqual(routerStore.getState().history, ["/"]);
  assert.equal(routerStore.getState().location, "/");
  assert.equal(routerStore.getState().canGoBack, false);

  routerStore.getState().navigate("/settings");

  assert.deepEqual(routerStore.getState().history, ["/", "/settings"]);
  assert.equal(routerStore.getState().location, "/settings");
  assert.equal(routerStore.getState().canGoBack, true);
});

test("goBack is a no-op at the root route", () => {
  const routerStore = createRouterStore();

  routerStore.getState().goBack();

  assert.deepEqual(routerStore.getState().history, ["/"]);
  assert.equal(routerStore.getState().location, "/");
  assert.equal(routerStore.getState().canGoBack, false);
});

test("goBack returns to the previous route and updates canGoBack", () => {
  const routerStore = createRouterStore();

  routerStore.getState().navigate("/settings");
  routerStore.getState().goBack();

  assert.deepEqual(routerStore.getState().history, ["/"]);
  assert.equal(routerStore.getState().location, "/");
  assert.equal(routerStore.getState().canGoBack, false);
});

test("clearHistory returns to the configured initial route", () => {
  const routerStore = createRouterStore({ initialLocation: "/popup" });

  routerStore.getState().navigate("/settings");
  routerStore.getState().clearHistory();

  assert.deepEqual(routerStore.getState().history, ["/popup"]);
  assert.equal(routerStore.getState().location, "/popup");
  assert.equal(routerStore.getState().canGoBack, false);
});

test("persisted history rehydrates with a derived canGoBack value", () => {
  const storage = createMemoryStorage({
    "router-storage-tab-1": JSON.stringify({
      state: {
        history: ["/", "/settings"],
        location: "/settings",
        canGoBack: false,
      },
      version: 0,
    }),
  });

  const routerStore = createRouterStore(storage, "tab-1");

  assert.deepEqual(routerStore.getState().history, ["/", "/settings"]);
  assert.equal(routerStore.getState().location, "/settings");
  assert.equal(routerStore.getState().canGoBack, true);
});
