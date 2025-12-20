// Utility to map between DB snake_case and frontend camelCase

// Convert snake_case to camelCase
export const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj instanceof Date) return obj;
  
  const camelObj = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip if value is null or undefined
    if (value === null || value === undefined) {
      camelObj[key] = value;
      continue;
    }
    
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Recursively convert nested objects and arrays
    if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      camelObj[camelKey] = toCamelCase(value);
    } else if (Array.isArray(value)) {
      camelObj[camelKey] = value.map(item => 
        typeof item === 'object' && item !== null ? toCamelCase(item) : item
      );
    } else {
      camelObj[camelKey] = value;
    }
  }
  return camelObj;
};

// Convert camelCase to snake_case
export const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj instanceof Date) return obj;
  
  const snakeObj = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip if value is null or undefined
    if (value === null || value === undefined) {
      // Still convert the key
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      snakeObj[snakeKey] = value;
      continue;
    }
    
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    // Recursively convert nested objects and arrays
    if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      snakeObj[snakeKey] = toSnakeCase(value);
    } else if (Array.isArray(value)) {
      snakeObj[snakeKey] = value.map(item => 
        typeof item === 'object' && item !== null ? toSnakeCase(item) : item
      );
    } else {
      snakeObj[snakeKey] = value;
    }
  }
  return snakeObj;
};

