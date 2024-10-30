#!/usr/bin/env python3
""" BaseCaching module
"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """
    LIFOCache implements a Last-In, First-Out (LIFO) caching system.
    """

    def __init__(self):
        """
        Initializes the cache and sets up the LIFO order list.
        """
        super().__init__()
        self.order = []

    def put(self, key, item):
        """
        Adds a key-value pair to the cache following LIFO rules.
        If the cache exceeds MAX_ITEMS, the most recently added item is removed.
        Args:
            key: the key to store.
            item: the item associated with the key.
        """
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
                print("DISCARD: {}".format(self.order[-1]))
                del self.cache_data[self.order.pop(-1)]

            if key in self.order:
                self.order.remove(key)
            self.order.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves the value associated with a given key.
        Returns None if the key is not in the cache or is None.
        """
        return self.cache_data.get(key, None)
