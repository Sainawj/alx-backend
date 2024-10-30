#!/usr/bin/env python3
""" BaseCaching module
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    A caching class for storing key-value pairs.
    Methods:
        put(key, item) - adds a key-value pair to the cache.
        get(key) - retrieves the value linked to a given key.
    """

    def __init__(self):
        """
        Initializes the cache by calling the parent class's __init__ method.
        """
        super().__init__()

    def put(self, key, item):
        """
        Adds a key-value pair to the cache.
        Args:
            key: the key associated with the item.
            item: the value to be stored.
        """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves the value associated with a key.
        Returns None if the key is None or not found in the cache.
        """
        return self.cache_data.get(key, None)
