name: Full Auto News - Kantipur, Gorkhapatra, Onlinekhabar, RSS Nepal, NepseAlpha
on:
  schedule:
    - cron: '0 */1 * * *'
  workflow_dispatch:
jobs:
  fetch-news:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install
        run: pip install feedparser requests beautifulsoup4 lxml
      - name: Fetch All News
        run: python scripts/fetch_news_full.py
      - name: Commit
        run: |
          git config --global user.name 'MacaoNepalDarpan Bot'
          git config --global user.email 'bot@macaonepaldarpan.com'
          git add news.json nepse.json
          git diff --quiet && git diff --staged --quiet || git commit -m "Auto news update"
          git push