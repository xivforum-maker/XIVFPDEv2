import https from 'https';

const urls = [
  'https://xivfpde.com/scientific.html',
  'https://xivfpde.com/organization.html'
];

urls.forEach(url => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`\n--- ${url} ---`);
      // Find all text inside tags that might be names (e.g., h2, h3, h4, span, div with class name)
      const matches = data.match(/<[^>]+>([^<]+)<\/[^>]+>/g);
      if (matches) {
        const texts = matches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(t => t.length > 3 && t.length < 50);
        console.log(texts.join(' | '));
      }
    });
  });
});
