# News Mindmap

A full-stack JavaScript app to analyze news articles and visualize them as mind maps using AI.

## Features
- Input a news article URL
- Scrape and summarize article using OpenRouter (Mistral model)
- Visualize summary as a mind map (React Flow)
- Click nodes to view summary/keywords

## How to Run Locally

1. Set your OpenRouter API key in `.env.local`.
2. Install dependencies:
   - `npm install` (root)
   - `cd frontend && npm install`
3. Start API: `npm run api`
4. Start frontend: `npm run dev`

## Deployment (Vercel)
- Frontend is deployed as main site
- `api/analyze.js` is deployed as API route
- Set `OPENROUTER_API_KEY` in Vercel environment settings

## API Key Setup
Add your OpenRouter API key to `.env.local`:
```
OPENROUTER_API_KEY=your_openrouter_key_here
```

## Tech Stack
- Vite + React
- Node.js + Express
- Axios, Cheerio, dotenv
- react-flow-renderer

## Styling
Minimal, clean CSS included in frontend.
