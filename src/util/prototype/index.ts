/* eslint-disable no-unused-vars */
import './string';
import './router';
import './server';
import './array';

declare global {
  interface Object {
    /**
     * This is also known as a method call chain
     * Also known as .pipe();
     */
    __pipes<T>(this: T, ...fs: ((value: T) => any)[]): Promise<T>;
  }
}

Object.defineProperty(Object.prototype, '__pipes', {
  async value<T>(this: T, ...fs: ((value: T) => any)[]) {
    return Promise.all(fs.map(f => f(this)));
  },
  enumerable: false,
  configurable: true,
});
