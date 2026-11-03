import feedparser
import json
import requests
from datetime import datetime

print("Starting news fetch...")

RSS_SOURCES = {
    "कान्तिपुर": [
        "https://ekantipur.com/rss",
        "https://ekantipur.com/feed",
        "https://www.ekantipur.com/rss"
    ],
    "गोरखापत्र": [
        "https://gorkhapatraonline.com/rss",
        "https://gorkhapatraonline.com/feed",
        "https://www.gorkhapatraonline.com/rss"
    ],
    "अनलाइनखबर": [
        "https://www.onlinekhabar.com/feed",
        "https://onlinekhabar.com/feed",
        "https://english.onlinekhabar.com/feed"
    ],
    "RSS Nepal": [
        "https://www.onlinekhabar.com/feed",
        "https://ekantipur.com/feed"
    ],
    "NepseAlpha": [
        "https://www.nepsealpha.com/feed",
        "https://www.sharesansar.com/feed"
    ]
}

def fetch_feed(url):
    try:
        print(f"Trying {url}")
        feed = feedparser.parse(url)
        if feed.entries and len(feed.entries) > 0:
            print(f"  -> Found {len(feed.entries)} entries")
            return feed.entries[:5]
        else:
            print(f"  -> No entries")
    except Exception as e:
        print(f"  -> Failed {url}: {e}")
    return []

def fetch_all():
    all_news = []
    nepse_news = []
    
    for source, urls in RSS_SOURCES.items():
        print(f"\nFetching {source}...")
        found = False
        for rss_url in urls:
            entries = fetch_feed(rss_url)
            if entries:
                for e in entries:
                    title = e.get("title", "").strip()
                    link = e.get("link", "")
                    if not title or len(title) < 5:
                        continue
                    item = {
                        "source": source,
                        "title": title,
                        "link": link,
                        "published": e.get("published", e.get("updated", "")),
                        "summary": (e.get("summary", e.get("description", ""))[:150] + "...") if e.get("summary") else "",
                        "fetched_at": datetime.now().isoformat(),
                        "category": "nepse" if "Nepse" in source else "news"
                    }
                    if "Nepse" in source:
                        nepse_news.append(item)
                    else:
                        all_news.append(item)
                found = True
                print(f"  ✓ Added from {source}")
                break
        
        if not found:
            print(f"  ✗ No feed found for {source}, using sample")
            # Sample data so file is not empty
            if "Nepse" not in source:
                all_news.append({
                    "source": source,
                    "title": f"{source} - ताजा समाचार अपडेट हुँदैछ",
                    "link": urls[0].replace("/rss","").replace("/feed",""),
                    "published": "",
                    "summary": "RSS बाट समाचार ल्याउने प्रयास हुँदैछ, केही समयमा अपडेट हुन्छ",
                    "fetched_at": datetime.now().isoformat(),
                    "category": "news"
                })
    
    print(f"\nTotal: {len(all_news)} news + {len(nepse_news)} nepse")
    
    # Always create files even if empty
    try:
        with open("news.json", "w", encoding="utf-8") as f:
            json.dump(all_news, f, ensure_ascii=False, indent=2)
        print("news.json written")
    except Exception as e:
        print(f"Failed to write news.json: {e}")
        with open("news.json", "w", encoding="utf-8") as f:
            f.write("[]")
    
    try:
        with open("nepse.json", "w", encoding="utf-8") as f:
            json.dump(nepse_news, f, ensure_ascii=False, indent=2)
        print("nepse.json written")
    except Exception as e:
        print(f"Failed to write nepse.json: {e}")
        with open("nepse.json", "w", encoding="utf-8") as f:
            f.write("[]")

if __name__ == "__main__":
    fetch_all