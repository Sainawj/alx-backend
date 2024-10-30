#!/usr/bin/env python3
""" BaseCaching module
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    LFUCache implements a Least Frequently Used (LFU) caching system.
    """

    def __init__(self):
        """
        Initializes the cache with an access order list and a frequency counter.
        """
        super().__init__()
        self.usage = []
        self.frequency = {}

    def put(self, key, item):
        """
        Adds a key-value pair to the cache following LFU rules.
        If the cache exceeds MAX_ITEMS, the least frequently used item is removed.
        Args:
            key: the key to store.
            item: the item associated with the key.
        """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                lfu = min(self.frequency.values())
                lfu_keys = [k for k, v in self.frequency.items() if v == lfu]
                if len(lfu_keys) > 1:
                    lru_lfu = {k: self.usage.index(k) for k in lfu_keys}
                    discard = self.usage[min(lru_lfu.values())]
                else:
                    discard = lfu_keys[0]

                print("DISCARD: {}".format(discard))
                del self.cache_data[discard]
                self.usage.remove(discard)
                del self.frequency[discard]

            # Update usage and frequency tracking
            self.frequency[key] = self.frequency.get(key, 0) + 1
            if key in self.usage:
                self.usage.remove(key)
            self.usage.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves the value associated with a given key and updates its usage frequency.
        Returns None if the key is not in the cache or is None.
        """
        if key is not None and key in self.cache_data:
            self.usage.remove(key)
            self.usage.append(key)
            self.frequency[key] += 1
            return self.cache_data[key]
        return None
