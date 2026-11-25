import { getRouteApi } from "@tanstack/react-router";

const rootRoute = getRouteApi("__root__");

/** True only when this deployment has ONLYMEN_PAYMENTS=on. Defaults off. */
export function usePaymentsEnabled(): boolean {
  return Boolean(rootRoute.useRouteContext().access?.payments);
}
