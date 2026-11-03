async function ensureContainers() {
  let newsContainer = document.getElementById('auto-news-container');
  let nepseContainer = document.getElementById('nepse-news-container');
  
  // यदि div छैन भने Footer भन्दा ठिक माथि बनाउने - माथि होइन!
  if (!newsContainer) {
    newsContainer = document.createElement('div');
    newsContainer.id = 'auto-news-container';
    newsContainer.style.margin = '30px 15px';
    
    // Footer खोज्ने - धेरै तरिकाले
    let footer = document.querySelector('footer') || 
                 document.querySelector('[class*="footer"]') ||
                 document.querySelector('[id*="footer"]');
    
    // Footer मा MacaoNepalDarpan भएको भाग खोज्ने (तिम्रो साइटको सबैभन्दा तलको भाग)
    if (!footer) {
      const allDivs = document.querySelectorAll('div');
      for (let i = allDivs.length - 1; i >= 0; i--) {
        if (allDivs[i].textContent.includes('MacaoNepalDarpan.com') || 
            allDivs[i].textContent.includes('Built with love for Nepali community')) {
          footer = allDivs[i];
          break;
        }
      }
    }
    
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(newsContainer, footer);
    } else {
      // Footer नभेटिए body को सबैभन्दा तल हाल्ने, माथि होइन!
      document.body.appendChild(newsContainer);
    }
  }
  
  if (!nepseContainer) {
    nepseContainer = document.createElement('div');
    nepseContainer.id = 'nepse-news-container';
    nepseContainer.style.margin = '30px 15px';
    newsContainer.after(nepseContainer);
  }
  
  return { newsContainer, nepseContainer };
}

async function loadAllNews() {
  const { newsContainer, nepseContainer } = await ensureContainers();
  if (!newsContainer) return;

  try {
    const ts = Date.now();
    let news = [], nepse = [];
    try { const r = await fetch(`./news.json?v=${ts}`); if(r.ok) news = await r.json(); } catch(e){}
    try { const r2 = await fetch(`./nepse.json?v=${ts}`); if(r2.ok) nepse = await r2.json(); } catch(e){}

    if (newsContainer) {
      if (!news.length) {
        newsContainer.innerHTML = `<div style="text-align:center;padding:20px;background:#f8f9ff;border-radius:12px;border:1px dashed #003893"><p style="color:#003893">📰 ताजा समाचार लोड हुँदैछ...</p></div>`;
      } else {
        let html = `<div style="margin:30px 0;max-width:1280px;margin-left:auto;margin-right:auto;padding:0 15px"><h2 style="font-size:22px;font-weight:bold;color:#003893;border-left:5px solid #003893;padding-left:12px;margin-bottom:16px">📰 ताजा समाचार - नेपालबाट</h2><p style="font-size:13px;color:#666;margin-bottom:16px">स्रोत: कान्तिपुर, गोरखापत्र, अनलाइनखबर, RSS Nepal - हरेक 1 घण्टा अपडेट</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">`;
        news.slice(0,12).forEach(item=>{
          let bg='#e3f2fd', bd='#003893';
          if(item.source.includes('गोरखापत्र')){bg='#ffebee'; bd='#CE1126';}
          else if(item.source.includes('अनलाइनखबर')){bg='#e8f5e9'; bd='#067747';}
          else if(item.source.includes('RSS')){bg='#fff8e1'; bd='#FF9800';}
          const safeTitle = (item.title||'').replace(/</g,'&lt;');
          html+=`<div style="background:white;border:1px solid #e0e0e0;border-left:4px solid ${bd};border-radius:10px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,0.08)"><span style="font-size:11px;background:${bg};color:${bd};padding:3px 8px;border-radius:20px;font-weight:bold">${item.source}</span><h3 style="font-size:15px;font-weight:bold;margin:8px 0;line-height:1.4;color:#222">${safeTitle}</h3><a href="${item.link}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;font-size:13px;color:${bd};font-weight:bold;text-decoration:none">पुरा पढ्नुहोस् →</a></div>`;
        });
        html+=`</div></div>`; newsContainer.innerHTML=html;
      }
    }
    if (nepseContainer && nepse.length>0) {
      let html2=`<div style="margin:30px 0;max-width:1280px;margin-left:auto;margin-right:auto;padding:0 15px"><h2 style="font-size:20px;font-weight:bold;color:#067747;border-left:5px solid #067747;padding-left:12px;margin-bottom:16px">📈 शेयर बजार - NEPSE</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">`;
      nepse.slice(0,6).forEach(item=>{
        const safeTitle = (item.title||'').replace(/</g,'&lt;');
        html2+=`<div style="background:#f0faf4;border:1px solid #c8e6c9;border-left:4px solid #067747;border-radius:10px;padding:14px"><span style="font-size:11px;background:#c8e6c9;color:#067747;padding:3px 8px;border-radius:20px;font-weight:bold">📊 ${item.source}</span><h3 style="font-size:14px;font-weight:bold;margin:8px 0;color:#1b5e20">${safeTitle}</h3><a href="${item.link}" target="_blank" rel="noopener" style="font-size:13px;color:#067747;font-weight:bold;text-decoration:none">विस्तृत →</a></div>`;
      });
      html2+=`</div></div>`; nepseContainer.innerHTML=html2;
    }
  } catch(e){ console.error(e); }
}

// माथि नभएर तल आउनको लागि DOM पुरै Load भएपछि मात्र चलाउने!
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadAllNews, 500);
    setTimeout(loadAllNews, 2000);
  });
} else {
  setTimeout(loadAllNews, 500);
  setTimeout(loadAllNews, 2000);
}
setInterval(loadAllNews, 3600000)