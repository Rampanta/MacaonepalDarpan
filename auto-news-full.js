// MacaoNepalDarpan - Final Auto News Display Code
// Brand Colors: Blue #003893, Green #067747, Red #CE1126

async function loadAllNews() {
  const newsContainer = document.getElementById('auto-news-container');
  const nepseContainer = document.getElementById('nepse-news-container');
  
  if (!newsContainer && !nepseContainer) return;

  try {
    // Cache बाट बच्न timestamp
    const timestamp = Date.now();
    let news = [];
    let nepse = [];

    // news.json लोड गर्ने
    try {
      const res = await fetch(`./news.json?v=${timestamp}`);
      if (res.ok) news = await res.json();
    } catch (e) { console.log('news.json load fail', e); }

    // nepse.json लोड गर्ने
    try {
      const res2 = await fetch(`./nepse.json?v=${timestamp}`);
      if (res2.ok) nepse = await res2.json();
    } catch (e) { console.log('nepse.json load fail', e); }

    // === 1. नेपाल समाचार देखाउने ===
    if (newsContainer) {
      if (!news || news.length === 0) {
        newsContainer.innerHTML = `
          <div style="text-align:center;padding:20px;background:#f8f9ff;border-radius:12px;border:1px dashed #003893">
            <p style="color:#003893">📰 ताजा समाचार लोड हुँदैछ...<br><small>GitHub Actions मा Run Workflow थिच्नुस</small></p>
          </div>`;
      } else {
        let html = `
          <div style="margin:30px 0">
            <h2 style="font-size:22px;font-weight:bold;color:#003893;border-left:5px solid #003893;padding-left:12px;margin-bottom:16px">
              📰 ताजा समाचार - नेपालबाट
            </h2>
            <p style="font-size:13px;color:#666;margin-bottom:16px">स्रोत: कान्तिपुर, गोरखापत्र, अनलाइनखबर, RSS Nepal, NepseAlpha</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">
        `;
        
        news.slice(0, 12).forEach(item => {
          let bgColor = '#e3f2fd';
          let borderColor = '#003893';
          if (item.source.includes('गोरखापत्र')) { bgColor = '#ffebee'; borderColor = '#CE1126'; }
          else if (item.source.includes('अनलाइनखबर')) { bgColor = '#e8f5e9'; borderColor = '#067747'; }
          else if (item.source.includes('कान्तिपुर')) { bgColor = '#e3f2fd'; borderColor = '#003893'; }
          else { bgColor = '#fff8e1'; borderColor = '#FF9800'; }

          const safeTitle = (item.title || '').replace(/</g, '&lt;');
          const safeSummary = (item.summary || '').replace(/</g, '&lt;');
          
          html += `
            <div style="background:white;border:1px solid #e0e0e0;border-left:4px solid ${borderColor};border-radius:10px;padding:14px;transition:0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.08)" 
                 onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)'">
              <span style="font-size:11px;background:${bgColor};color:${borderColor};padding:3px 8px;border-radius:20px;font-weight:bold">
                ${item.source}
              </span>
              <h3 style="font-size:15px;font-weight:bold;margin:8px 0;line-height:1.4;color:#222">${safeTitle}</h3>
              ${safeSummary ? `<p style="font-size:13px;color:#666;margin:6px 0;line-height:1.4">${safeSummary}</p>` : ''}
              <a href="${item.link}" target="_blank" rel="noopener" 
                 style="display:inline-block;margin-top:8px;font-size:13px;color:${borderColor};font-weight:bold;text-decoration:none">
                पुरा पढ्नुहोस् →
              </a>
            </div>
          `;
        });
        
        html += `</div></div>`;
        newsContainer.innerHTML = html;
      }
    }

    // === 2. शेयर बजार समाचार देखाउने ===
    if (nepseContainer) {
      if (nepse && nepse.length > 0) {
        let html2 = `
          <div style="margin:30px 0">
            <h2 style="font-size:20px;font-weight:bold;color:#067747;border-left:5px solid #067747;padding-left:12px;margin-bottom:16px">
              📈 शेयर बजार - NEPSE
            </h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">
        `;
        
        nepse.slice(0, 6).forEach(item => {
          const safeTitle = (item.title || '').replace(/</g, '&lt;');
          html2 += `
            <div style="background:#f0faf4;border:1px solid #c8e6c9;border-left:4px solid #067747;border-radius:10px;padding:14px">
              <span style="font-size:11px;background:#c8e6c9;color:#067747;padding:3px 8px;border-radius:20px;font-weight:bold">📊 ${item.source}</span>
              <h3 style="font-size:14px;font-weight:bold;margin:8px 0;color:#1b5e20">${safeTitle}</h3>
              <a href="${item.link}" target="_blank" rel="noopener" style="font-size:13px;color:#067747;font-weight:bold;text-decoration:none">विस्तृत →</a>
            </div>
          `;
        });
        
        html2 += `</div></div>`;
        nepseContainer.innerHTML = html2;
      } else {
        // Nepse खाली भए केही नदेखाउने, वा हल्का message
        nepseContainer.innerHTML = '';
      }
    }

  } catch (error) {
    console.error('Auto news error:', error);
    if (newsContainer) {
      newsContainer.innerHTML = `<p style="text-align:center;color:#999;padding:20px">समाचार लोड हुन सकेन, केही समय पछि Refresh गर्नुस</p>`;
    }
  }
}

// पेज लोड हुने बित्तिकै चलाउने
document.addEventListener('DOMContentLoaded', loadAllNews);
// हरेक 1 घण्टामा आफै Refresh
setInterval(loadAllNews, 3600000)