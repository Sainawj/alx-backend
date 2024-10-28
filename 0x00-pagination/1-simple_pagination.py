#!/usr/bin/env python3
"""Example of basic pagination.
"""
import csv
from typing import List, Tuple

def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Calculates the start and end indices based on page and page size."""
    start = (page - 1) * page_size
    end = start + page_size
    return (start, end)

class Server:
    """Server class to handle pagination for a baby names database."""
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        """Sets up a new instance of Server."""
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Loads and caches the dataset if it hasn't been loaded yet."""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]  # Skip header row

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Returns a specific page of dataset entries."""
        assert isinstance(page, int) and isinstance(page_size, int)
        assert page > 0 and page_size > 0
        start, end = index_range(page, page_size)
        data = self.dataset()
        if start >= len(data):
            return []
        return data[start:end]