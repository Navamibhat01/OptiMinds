# scraper.py
import requests
from bs4 import BeautifulSoup

def scrape_product_details(url):
    """
    Scrapes product title and description from a URL.
    NOTE: This is a basic example and needs to be adapted for specific sites.
    """
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Example selectors for Amazon. You MUST inspect the page to find the correct ones.
        title = soup.select_one('#productTitle')
        
        # Look for feature bullets or product description
        description_element = soup.select_one('#feature-bullets.a-unordered-list')
        if not description_element:
            description_element = soup.select_one('#productDescription')
            
        title_text = title.get_text(strip=True) if title else "No title found"
        description_text = description_element.get_text(strip=True, separator=" ") if description_element else "No description found"

        combined_text = f"{title_text}. {description_text}"
        return combined_text

    except requests.exceptions.RequestException as e:
        print(f"Error scraping {url}: {e}")
        return None