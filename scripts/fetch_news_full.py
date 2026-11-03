import feedparser
import requests
import json
from datetime import datetime
from bs4 import BeautifulSoup

SOURCES = {
    "kantipur": "https://ekantipur.com/rss",
    "gorkhapatra": "https://gorkhapatraonline.com/rss",
    "onlinekhabar": "https://www.onlinekhabar.com/feed",
    "rss_nepal": "https://rssnepal.com/feed",
}

def fetch_rss(name, url):
    print(f"Fetching {name}: {url}")
    try:
        feed = feedparser.parse(url)
        items = []
        for entry in feed.entries[:15]:
            items.append({
                "source": name,
                "title": entry.get("title", "").strip(),
                "link": entry.get("link", ""),
                "published": entry.get("published", ""),
                "summary": BeautifulSoup(entry.get("summary", ""), "lxml").get_text()[:200]
            })
        return items
    except Exception as e:
        print(f"Error {name}: {e}")
        return []

def fetch_nepse():
    # NepseAlpha sample - replace with real API if available
    try:
        print("Fetching NEPSE data...")
        # Example placeholder - update with real endpoint
        return {
            "updated": datetime.now().isoformat(),
            "indices": [
                {"name": "NEPSE", "value": "2,450.32", "change": "+12.5"},
                {"name": "Sensitive", "value": "485.10", "change": "-2.3"}
            ]
        }
    except Exception as e:
        print(f"NEPSE error: {e}")
        return {"updated": datetime.now().isoformat(), "indices": []}

def main():
    all_news = []
    for name, url in SOURCES.items():
        all_news.extend(fetch_rss(name, url))
    
    # Sort by latest
    all_news = sorted(all_news, key=lambda x: x.get("published", ""), reverse=True)[:100]

    with open("news.json", "w", encoding="utf-8") as f:
        json.dump({
            "updated_at": datetime.now().isoformat(),
            "total": len(all_news),
            "news": all_news
        }, f, ensure_ascii=False, indent=2)

    nepse_data = fetch_nepse()
    with open("nepse.json", "w", encoding="utf-8") as f:
        json.dump(nepse_data, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(all_news)} news items")

if __name__ == "__main__":
    main()