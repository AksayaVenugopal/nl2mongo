import React, { useEffect, useState } from 'react';
import './App.css';
function App() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [outputData, setOutputData] = useState([]);
  const [mode, setMode] = useState('query');
  const [newRow, setNewRow] = useState({});
  useEffect(() => {
    fetch('/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'query' ? { query } : { nlQuery: query }),
      });
      const data = await response.json();
      setOutputData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Query error:', err);
      setOutputData([]);
    }
    setQuery('');
  };

  const handleAddRow = async () => {
    try {
      await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });
      const updated = await fetch('/users').then(res => res.json());
      setUsers(updated);
      setNewRow({});
    } catch (err) {
      console.error('Add row error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1b2a', color: '#e0f7fa', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      {/* Tables Section */}
      <div style={{ flex: 1, display: 'flex', borderBottom: '2px solid #1f4068' }}>
        {/* Original Table */}
        <div style={{ flex: 1, padding: '20px', borderRight: '2px solid #1f4068', overflow: 'auto' }}>
          <h2 style={{ color: '#00bcd4' }}>Original Users</h2>
          <div style={{ overflow: 'auto', maxHeight: '70vh', border: '1px solid #1f4068', borderRadius: '8px' }}>
            <Table data={users} />
          </div>
        </div>
        {/* Output Table */}
        <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <h2 style={{ color: '#00bcd4' }}>Query Output</h2>
          <div style={{ overflow: 'auto', maxHeight: '70vh', border: '1px solid #1f4068', borderRadius: '8px' }}>
            {outputData.length > 0 ? <Table data={outputData} /> : <div style={{ padding: '10px', color: '#ccc' }}>No output yet</div>}
          </div>
        </div>
      </div>

      {/* Terminal Section */}
      <div style={{ padding: '20px', backgroundColor: '#13293d', borderTop: '2px solid #1f4068' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ color: '#00bcd4' }}>Mode: {mode === 'query' ? 'Query' : 'Natural Language'}</label>
            <label className="switch">
              <input type="checkbox" checked={mode === 'nl'} onChange={() => setMode(mode === 'query' ? 'nl' : 'query')} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <form onSubmit={handleQuerySubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === 'query' ? 'Type MongoDB query: { "age": { "$gt": 25 } }' : 'Type natural language: "show users with quantity_sold > 40"'}
            style={{ width: '100%', padding: '12px', backgroundColor: '#0d1b2a', color: '#00ffcc', border: '1px solid #00bcd4', borderRadius: '4px' }}
          />
        </form>
      </div>

      {/* Add Row Section */}
      <div style={{ padding: '20px', backgroundColor: '#0d1b2a' }}>
        <h3 style={{ color: '#00bcd4' }}>Add Row</h3>
        <textarea
          rows="4"
          value={JSON.stringify(newRow, null, 2)}
          onChange={(e) => {
            try {
              setNewRow(JSON.parse(e.target.value));
            } catch {}
          }}
          style={{ width: '100%', padding: '12px', backgroundColor: '#13293d', color: '#00ffcc', border: '1px solid #00bcd4', borderRadius: '4px' }}
        />
        <button onClick={handleAddRow} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#00bcd4', color: '#0d1b2a', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Row
        </button>
      </div>
    </div>
  );
}

// Reusable Table
function Table({ data }) {
  if (!data || data.length === 0) return null;
  const headers = Object.keys(data[0]);
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ backgroundColor: '#1f4068' }}>
        <tr>
          {headers.map((key) => (
            <th key={key} style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #324a5f', color: '#81ecec' }}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {headers.map((key, j) => (
              <td key={j} style={{ padding: '10px', borderBottom: '1px solid #263859', color: '#d1faff' }}>{String(row[key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
