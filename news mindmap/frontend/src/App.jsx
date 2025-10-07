import React, { useState } from 'react';
import axios from 'axios';
import ReactFlow from 'react-flow-renderer';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setSelectedNode(null);
    try {
      const res = await axios.post('/api/analyze', { url });
      setResult(res.data);
    } catch (err) {
      alert('Error analyzing article');
    }
    setLoading(false);
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  return (
    <div className="container">
      <h1>News Mindmap</h1>
      <input
        type="text"
        placeholder="Enter news article URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        className="url-input"
      />
      <button onClick={handleAnalyze} disabled={loading || !url} className="analyze-btn">
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {result && (
        <>
          <div className="mindmap">
            <ReactFlow
              elements={[...result.nodes, ...result.edges]}
              onElementClick={onNodeClick}
              style={{ width: '100%', height: 400 }}
            />
          </div>
          <div className="summary">
            <h2>Article Summary</h2>
            <p>{result.summary}</p>
            {selectedNode && (
              <div className="node-details">
                <h3>Node: {selectedNode.data.label}</h3>
                <p>{selectedNode.data.summary || 'No details available.'}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
