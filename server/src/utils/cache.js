const cacheStore = new Map();

export const getCache = (key) => {
  const record = cacheStore.get(key);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    cacheStore.delete(key);
    return null;
  }
  return record.value;
};

export const setCache = (key, value, ttlMs = 60000) => {
  cacheStore.set(key, { value, expiresAt: Date.now() + ttlMs });
};

export const clearCacheByPrefix = (prefix) => {
  for (const key of cacheStore.keys()) {
    if (key.startsWith(prefix)) cacheStore.delete(key);
  }
};
