import { route, type RouteUrl } from 'ziggy-js';

export const relativeRoute = (name: string, params?: unknown): RouteUrl =>
    String(route(name as never, params as never, false));
