#!/usr/bin/env python3
""" BaseCaching module
"""
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """
    LRUCache implements a Least Recently Used (LRU) caching system.
    """

    def __init__(self):
        """
        Initializes the cache and sets up the usage tracking list for LRU.
        """
        super().__init__()
        self.usage = []

    def put(self, key, item):
        """
        Adds a key-value pair to the cache following LRU rules.
        If the cache exceeds MAX_ITEMS, the least recently used item is removed.
        Args:
            key: the key to store.
            item: the item associated with the key.
        """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                print("DISCARD: {}".format(self.usage[0]))
                del self.cache_data[self.usage.pop(0)]
            if key in self.usage:
                self.usage.remove(key)
            self.usage.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves the value associated with a given key and updates its usage.
        Returns None if the key is not in the cache or is None.
        """
        if key is not None and key in self.cache_data:
            self.usage.remove(key)
            self.usage.append(key)
            return self.cache_data[key]
        return None
