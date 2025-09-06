import React, { useMemo, useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import Sidebar from '../components/Sidebar';
import './Home.css';
import './Projects.css';
import investorsData from '../data/investorsData';

const mockConversations = [
  { id: 1, investor: 'Alice Capital', messages: [
    { from: 'startup', text: 'Hello, are you interested in our project?' },
    { from: 'investor', text: 'Yes, can you tell me more?' }
  ] },
  { id: 2, investor: 'Beta Ventures', messages: [
    { from: 'startup', text: 'Hi, we are looking for partners.' }
  ] }
];

export default function Messaging() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || null);
  const selected = conversations.find(c => c.id === selectedId) || conversations[0];
  const [newMsg, setNewMsg] = useState('');

  const user = { firstName: 'John', lastName: 'Doe', role: 'Startup' };
  const handleLogout = () => alert('Logout... (to implement)');

  // New conversation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filteredInvestors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return investorsData;
    return investorsData.filter(i => i.name.toLowerCase().includes(q));
  }, [query]);

  const openNewConversation = () => setIsModalOpen(true);
  const closeModal = () => { setIsModalOpen(false); setQuery(''); };
  const handlePickInvestor = (inv) => {
    // If a conversation already exists with this investor, focus it; otherwise create it
    const existing = conversations.find(c => c.investor === inv.name);
    if (existing) {
      setSelectedId(existing.id);
      closeModal();
      return;
    }
    const newConv = {
      id: Math.max(0, ...conversations.map(c => c.id)) + 1,
      investor: inv.name,
      messages: [
        { from: 'startup', text: 'Hello! I would like to introduce our startup.' }
      ]
    };
    const next = [newConv, ...conversations];
    setConversations(next);
    setSelectedId(newConv.id);
    closeModal();
  };

  const handleSelect = (id) => setSelectedId(id);
  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selected) return;
    const updated = conversations.map(c =>
      c.id === selected.id
        ? { ...c, messages: [...c.messages, { from: 'startup', text: newMsg.trim() }] }
        : c
    );
    setConversations(updated);
    setNewMsg('');
  };

  return (
    <div className="home-container">
      <TopBar />
      <div className="layout">
        <Sidebar active="messaging" user={user} onLogout={handleLogout} />
  <main className="home-main messaging">
          <h2>Messaging</h2>
          <div className="messaging-layout">
            <div className="messaging-conversations" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h3 style={{ marginBottom: '.5rem' }}>Conversations</h3>
              <ul className="conv-list" style={{ flex: 1, overflowY: 'auto' }}>
                {conversations.map(c => (
                  <li key={c.id} className={selected?.id === c.id ? 'active' : ''} onClick={() => handleSelect(c.id)}>
                    {c.investor}
                  </li>
                ))}
              </ul>
              <button className="primary-btn" onClick={openNewConversation}>New conversation</button>
            </div>
            <div className="messaging-thread">
              <h3>Chat with {selected?.investor || '—'}</h3>
              <div className="messages-scroll">
                {selected?.messages?.map((m, i) => (
                  <div key={i} className={`message-row ${m.from === 'startup' ? 'out' : 'in'}`}>
                    <span className="message-bubble">{m.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="message-composer">
                <input className="message-input" value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Your message..." />
                <button type="submit" className="primary-btn">Send</button>
              </form>
            </div>
          </div>
          {isModalOpen && (
            <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
              <div className="modal" role="dialog" aria-modal="true" aria-label="Start new conversation">
                <button className="close-btn" aria-label="Close" onClick={closeModal}>×</button>
                <h2 style={{ marginTop: 0 }}>Start a new conversation</h2>
                <p style={{ marginTop: 0, color: 'var(--color-text-muted)' }}>Search and pick an investor to chat with.</p>
                <input
                  autoFocus
                  className="message-input"
                  placeholder="Search investors..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ width: '100%', margin: '0.5rem 0 0.75rem' }}
                />
                <div style={{ maxHeight: '320px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
                  <ul className="conv-list" style={{ margin: 0 }}>
                    {filteredInvestors.length === 0 && (
                      <li style={{ cursor: 'default' }}>No investors found</li>
                    )}
                    {filteredInvestors.map((i) => (
                      <li key={i.id} onClick={() => handlePickInvestor(i)}>
                        {i.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}




