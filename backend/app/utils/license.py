"""
Mapping of Creative Commons license URLs to their short license codes.

This dictionary maps full URLs of various Creative Commons licenses to their
corresponding abbreviated license names. It is used to translate license URLs
retrieved from external APIs or metadata into a more readable and concise format.

Constants:
    LICENSE_MAP (dict): A dictionary mapping license URL strings to license short codes.
"""
LICENSE_MAP = {
    "https://creativecommons.org/licenses/by/2.0/": "CC BY 2.0",
    "https://creativecommons.org/licenses/by-sa/2.0/": "CC BY-SA 2.0",
    "https://creativecommons.org/licenses/by-nd/2.0/": "CC BY-ND 2.0",
    "https://creativecommons.org/licenses/by-nc/2.0/": "CC BY-NC 2.0",
    "https://creativecommons.org/licenses/by-nc-sa/2.0/": "CC BY-NC-SA 2.0",
    "https://creativecommons.org/licenses/by-nc-nd/2.0/": "CC BY-NC-ND 2.0",
    "https://creativecommons.org/licenses/by/3.0/": "CC BY 3.0",
    "https://creativecommons.org/licenses/by-sa/3.0/": "CC BY-SA 3.0",
    "https://creativecommons.org/licenses/by-nd/3.0/": "CC BY-ND 3.0",
    "https://creativecommons.org/licenses/by-nc/3.0/": "CC BY-NC 3.0",
    "https://creativecommons.org/licenses/by-nc-sa/3.0/": "CC BY-NC-SA 3.0",
    "https://creativecommons.org/licenses/by-nc-nd/3.0/": "CC BY-NC-ND 3.0",
    "https://creativecommons.org/licenses/by/4.0/": "CC BY 4.0",
    "https://creativecommons.org/licenses/by-sa/4.0/": "CC BY-SA 4.0",
    "https://creativecommons.org/licenses/by-nd/4.0/": "CC BY-ND 4.0",
    "https://creativecommons.org/licenses/by-nc/4.0/": "CC BY-NC 4.0",
    "https://creativecommons.org/licenses/by-nc-sa/4.0/": "CC BY-NC-SA 4.0",
    "https://creativecommons.org/licenses/by-nc-nd/4.0/": "CC BY-NC-ND 4.0",
}
