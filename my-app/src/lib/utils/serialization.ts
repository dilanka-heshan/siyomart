/**
 * Safely serializes MongoDB objects and other complex data structures
 * to make them compatible with Client Components in Next.js
 */
export function serializeData(data: any): any {
  // Handle null/undefined
  if (data === null || data === undefined) {
    return null;
  }
  
  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString();
  }
  
  // Handle arrays by mapping each element
  if (Array.isArray(data)) {
    return data.map(item => serializeData(item));
  }
  
  // Handle plain objects
  if (typeof data === 'object') {
    // Handle MongoDB ObjectId by converting to string
    if (data._bsontype === 'ObjectID' || (data.id && data.toHexString)) {
      return data.toString();
    }
    
    // Handle MongoDB objects with toJSON method - use this instead of original object
    if (data.toJSON && typeof data.toJSON === 'function') {
      return serializeData(data.toJSON());
    }
    
    // Special check to ensure we're dealing with a plain object (no custom prototype)
    const isPlainObject = 
      data.constructor === Object || 
      data.constructor === undefined || 
      data.constructor.name === 'Object';
      
    if (!isPlainObject) {
      // Convert non-plain objects to plain objects
      return serializeData(Object.fromEntries(
        Object.entries(Object.getOwnPropertyDescriptors(data))
          .filter(([_, descriptor]) => descriptor.enumerable)
          .map(([key, descriptor]) => [key, descriptor.value])
      ));
    }
    
    // Regular object - recursively serialize each property
    const serialized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip methods and non-own properties
      if (typeof value !== 'function' && Object.prototype.hasOwnProperty.call(data, key)) {
        serialized[key] = serializeData(value);
      }
    }
    return serialized;
  }
  
  // Primitives can be returned as is
  return data;
}

/**
 * Safe stringify that handles circular references
 */
export function safeStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, ( value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  });
}
