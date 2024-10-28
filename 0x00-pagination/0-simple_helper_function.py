#!/usr/bin/env python3
"""
Pagination function.
"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Gets the start and end index based on
    the specified page and page size
    """
    start = (page - 1) * page_size
    end = start + page_size
    return (start, end)