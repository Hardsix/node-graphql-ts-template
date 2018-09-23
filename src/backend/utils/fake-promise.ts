export function fakePromise<T>(x: T): Promise<T> {
  return x as any;
}
