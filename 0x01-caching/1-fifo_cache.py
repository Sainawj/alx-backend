#!/usr/bin/env python3
""" BaseCaching module
"""
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """
    Implements a FIFO (First-In, First-Out) caching system.
    """

    def __init__(self):
        """
        Initializes the cache and sets up the FIFO order list.
        """
        super().__init__()
        self.order = []

    def put(self, key, item):
        """
        Adds a key-value pair to the cache following FIFO rules.
        If the cache exceeds MAX_ITEMS, the oldest item is removed.
        Args:
            key: the key to store.
            item: the item associated with the key.
        """
        if key is not None and item is not None:
            if (
                len(self.cache_data) >= BaseCaching.MAX_ITEMS
                and key not in self.cache_data
            ):
                print("DISCARD: {}".format(self.order[0]))
                del self.cache_data[self.order[0]]
                self.order.pop(0)
            self.order.append(key)
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves the value associated with a given key.
        Returns None if the key is not in the cache or is None.
        """
        return self.cache_data.get(key)
