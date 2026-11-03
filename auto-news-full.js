async function loadAllNews() {
  let newsContainer = document.getElementById('auto-news-container');
  let nepseContainer = document.getElementById('nepse-news-container');
  
  // div छैन भने आफै बनाउने!
  if (!newsContainer) {
    newsContainer = document.createElement('div');
    newsContainer.id = 'auto-news-container';
    newsContainer.style.margin = '30px 15px';
    const footer = document.querySelector('footer');
    if (footer) footer.parentNode.insertBefore(newsContainer, footer);
    else document.body.appendChild(newsContainer);
  }
  if (!nepseContainer) {
    nepseContainer = document.createElement('div');
    nepseContainer.id = 'nepse-news-container';
    nepseContainer.style.margin = '30px 15px';
    newsContainer.after(nepseContainer);
  }
  try {
    const ts = Date.now();
    let news = [], nepse = [];
    try { const r = await fetch(`./news.json?v=${ts}`); if(r.ok) news = await r.json(); } catch(e){}
    try { const r2 = await fetch(`./nepse.json?v=${ts}`); if(r2.ok) nepse = await r2.json(); } catch(e){}
    if (newsContainer) {
      if (!news.length) {
        newsContainer.innerHTML = `<div style="text-align:center;padding:20px;background:#f8f9ff;border-radius:12px;border:1px dashed #003893"><p>📰 ताजा समाचार लोड हुँदैछ...</p></div>`;
      } else {
        let html = `<div style="margin:30px 0"><h2 style="font-size:22px;font-weight:bold;color:#003893;border-left:5px solid #003893;padding-left:12px">📰 ताजा समाचार - नेपालबाट</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">`;
        news.slice(0,12).forEach(item=>{
          let bg='#e3f2fd', bd='#003893';
          if(item.source.includes('गोरखापत्र')){bg='#ffebee'; bd='#CE1126';}
          else if(item.source.includes('अनलाइनखबर')){bg='#e8f5e9'; bd='#067747';}
          html+=`<div style="background:white;border-left:4px solid ${bd};padding:14px;border-radius:10px"><span style="background:${bg};color:${bd};padding:3px 8px;border-radius:20px;font-size:11px;font-weight:bold">${item.source}</span><h3 style="font-size:15px;font-weight:bold;margin:8px 0">${item.title}</h3><a href="${item.link}" target="_blank" style="color:${bd};font-weight:bold;text-decoration:none;font-size:13px">पुरा पढ्नुहोस् →</a></div>`;
        });
        html+=`</div></div>`; newsContainer.innerHTML=html;
      }
    }
  } catch(e){console.error(e);}
}
loadAllNews();
document.addEventListener('DOMContentLoaded', loadAllNews);
setTimeout(loadAllNews, 2000);
setInterval(loadAllNews, 3600000);