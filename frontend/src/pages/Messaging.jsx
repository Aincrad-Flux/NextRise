import React, { useState } from 'react';
import TopBar from '../components/TopBar.jsx';
import Sidebar from '../components/Sidebar';
import './Home.css';
import './Projects.css';

const mockConversations = [
  { id: 1, investor: 'Investisseur A', messages: [
    { from: 'startup', text: 'Bonjour, êtes-vous intéressé par notre projet ?' },
    { from: 'investor', text: 'Oui, pouvez-vous m’en dire plus ?' }
  ] },
  { id: 2, investor: 'Investisseur B', messages: [
    { from: 'startup', text: 'Bonjour, nous cherchons des partenaires.' }
  ] }
];

export default function Messaging() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || null);
  const selected = conversations.find(c => c.id === selectedId) || conversations[0];
  const [newMsg, setNewMsg] = useState('');

  const user = { firstName: 'Jean', lastName: 'Dupont', role: 'Startup' };
  const handleLogout = () => alert('Déconnexion... (à implémenter)');

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

  const handleNewConversation = () => {
    const name = window.prompt('Nom de l\'investisseur ?');
    if (!name || !name.trim()) return;
    const newConv = { id: Date.now(), investor: name.trim(), messages: [] };
    setConversations([newConv, ...conversations]);
    setSelectedId(newConv.id);
  };

  return (
    <div className="home-container">
      <TopBar />
      <div className="layout">
        <Sidebar active="messaging" user={user} onLogout={handleLogout} />
        <main className="home-main">
          <h2>Messagerie</h2>
          <div className="messaging-layout">
            <div className="messaging-conversations">
              <div className="conv-header">
                <h3>Conversations</h3>
                <button type="button" className="new-conv-btn" onClick={handleNewConversation}>Nouvelle conversation</button>
              </div>
              <ul className="conv-list">
                {conversations.map(c => (
                  <li key={c.id} className={selected?.id === c.id ? 'active' : ''} onClick={() => handleSelect(c.id)}>
                    {c.investor}
                  </li>
                ))}
              </ul>
            </div>
            <div className="messaging-thread">
              <h3>Messages avec {selected?.investor || '—'}</h3>
              <div className="messages-scroll">
                {selected?.messages?.map((m, i) => (
                  <div key={i} className={`message-row ${m.from === 'startup' ? 'out' : 'in'}`}>
                    <span className="message-bubble">{m.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="message-composer">
                <input className="message-input" value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Votre message..." />
                <button type="submit" className="primary-btn">Envoyer</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
