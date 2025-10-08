const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    // Scrape article text
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    let text = '';
    // Try to extract articleBody from application/ld+json
    let foundJson = false;
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html());
        if (json.articleBody) {
          text = json.articleBody;
          foundJson = true;
        }
      } catch (e) {}
    });
    // Fallback to <p> tags if no articleBody found
    if (!foundJson) {
      $('p').each((_, el) => {
        text += $(el).text() + '\n';
      });
    }

    // Send to OpenRouter API
    const openrouterRes = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: [
          {
            role: 'user',
            content: `Summarize and extract a mind map from this article: ${text}`,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Assume OpenRouter returns { summary, nodes, edges }
    const { summary, nodes, edges } = openrouterRes.data;
    res.json({ summary, nodes, edges });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze article' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
