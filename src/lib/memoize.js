class NestedMap {
  constructor(value) {
    this.children = new Map();
    this.value = value;
    this.referenceCount = 0;
  }

  set(keys, value) {
    if (Array.isArray(keys)) {
      if (keys.length === 1) {
        return this.children.set(keys[0], new NestedMap(value));
      } else {
        let child = this.children.get(keys[0]);

        if (!child) {
          child = new NestedMap();
          this.children.set(keys[0], child);
        }

        child.set(keys.slice(1), value);
      }
    } else {
      return this.children.set(keys, value);
    }
  }

  get(keys) {
    if (Array.isArray(keys)) {
      if (keys.length === 0) {
        this.referenceCount += 1;

        return this.value;
      } else {
        const child = this.children.get(keys[0]);

        if (child) {
          return child.get(keys.slice(1));
        } else {
          return undefined;
        }
      }
    } else {
      return this.children.get(keys);
    }
  }

  has(keys) {
    if (Array.isArray(keys)) {
      if (keys.length === 0) {
        return true;
      } else {
        const child = this.children.get(keys[0]);

        if (child) {
          return child.has(keys.slice(1));
        } else {
          return false;
        }
      }
    } else {
      return this.children.has(keys);
    }
  }

  delete(keys) {
    if (Array.isArray(keys)) {
      if (keys.length === 0) {
        return true;
      } else {
        const child = this.children.get(keys[0]);

        if (child) {
          const shouldDeleteChild = child.delete(keys.slice(1));

          if (shouldDeleteChild) {
            this.children.delete(keys.slice(1));
          }

          if (this.children.size === 0) {
            return true;
          }
        } else {
          return false;
        }
      }
    } else {
      return this.children.delete(keys);
    }
  }

  traverse(visitor, keys = []) {
    if (this.children.size === 0) {
      visitor(this, keys);
    } else {
      this.children.forEach((value, key) => {
        value.traverse(visitor, [...keys, key]);
      });
    }
  }

  garbageCollect() {
    this.traverse((node, keys) => {
      if (node.referenceCount === 0 && node.children.size === 0) {
        this.delete(keys);
      } else {
        node.referenceCount = 0;
      }
    });
  }
}

export const memoize = func => {
  const cache = new NestedMap();

  const memoizedFunc = (...params) => {
    if (!cache.has(params)) {
      const boundedFunction = func(...params);
      cache.set(params, boundedFunction);
    }

    return cache.get(params);
  };

  memoizedFunc.cache = cache;

  return memoizedFunc;
};
