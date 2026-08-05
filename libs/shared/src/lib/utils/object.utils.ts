/**
 * Object Utilities
 */

export class ObjectUtils {
  /**
   * Deep clone an object
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Remove undefined/null values from object
   */
  static compact<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key as keyof T] = value;
      }
      return acc;
    }, {} as Partial<T>);
  }

  /**
   * Pick specific keys from object
   */
  static pick<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> {
    return keys.reduce((result, key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
      return result;
    }, {} as Pick<T, K>);
  }

  /**
   * Omit specific keys from object
   */
  static omit<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> {
    const result = { ...obj };
    keys.forEach((key) => delete result[key]);
    return result;
  }

  /**
   * Check if object is empty
   */
  static isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }

  /**
   * Merge objects deeply
   */
  static merge<T extends object>(target: T, ...sources: Partial<T>[]): T {
    return sources.reduce((acc, source) => {
      Object.entries(source).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          (acc as any)[key] = this.merge(
            (acc as any)[key] || {},
            value
          );
        } else {
          (acc as any)[key] = value;
        }
      });
      return acc;
    }, { ...target }) as T;
  }
}
