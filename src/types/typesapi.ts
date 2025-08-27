export interface RouteContext<T extends Record<string, string> = Record<string, string>> {
  params: T;
}