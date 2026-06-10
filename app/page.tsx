'use client';
import { useState, useEffect, useRef } from 'react';

type Message = { role: string; content: string };

export default function Home() {
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState('');
const [loading, setLoading] = useState(false);
const bottomRef = useRef<HTMLDivElement>(null);

useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages, loading]);

async function sendMessage() {
if (!input.trim()) return;
const userMessage: Message = { role: 'user', content: input };
setInput('');
setLoading(true);
setMessages(prev => [...prev, userMessage]);
const res = await fetch('/api/chat', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ messages: [...messages, userMessage] }),
});
const data = await res.json();
const assistantMessage: Message = { role: 'assistant', content: data.reply };
setMessages(prev => [...prev, assistantMessage]);
setLoading(false);
}

return (
<main style={{
background: '#0a0a0a',
height: '100dvh',
display: 'flex',
flexDirection: 'column',
fontFamily: '"Courier New", monospace',
color: '#e0e0e0',
overflow: 'hidden',
maxWidth: '600px',
margin: '0 auto',
width: '100%',
}}>
<div style={{
background: '#1a1a2e',
borderBottom: '2px solid #4a4a8a',
padding: '12px 16px',
display: 'flex',
alignItems: 'center',
gap: '10px',
flexShrink: 0,
}}>
<div style={{
width: '10px', height: '10px',
borderRadius: '50%',
background: '#00ff88',
boxShadow: '0 0 6px #00ff88',
}} />
<span style={{ color: '#a0a0ff', fontSize: '14px', letterSpacing: '2px' }}>LUCAS</span>
<span style={{ color: '#555', fontSize: '11px', marginLeft: '8px' }}>en línea</span>
</div>

<div style={{
flex: 1,
overflowY: 'auto',
padding: '16px',
display: 'flex',
flexDirection: 'column',
gap: '10px',
}}>
{messages.map((msg, i) => (
<div key={i} style={{
display: 'flex',
flexDirection: 'column',
alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
}}>
<span style={{ fontSize: '10px', color: '#555', marginBottom: '3px' }}>
{msg.role === 'user' ? 'tú' : 'lucas'}
</span>
<div style={{
maxWidth: '80%',
padding: '10px 14px',
borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
background: msg.role === 'user' ? '#1a1a4a' : '#1a2a1a',
border: msg.role === 'user' ? '1px solid #3a3a8a' : '1px solid #3a6a3a',
color: msg.role === 'user' ? '#a0a0ff' : '#a0ffa0',
fontSize: '14px',
lineHeight: '1.5',
wordBreak: 'break-word',
}}>
{msg.content}
</div>
</div>
))}
{loading && (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
<span style={{ fontSize: '10px', color: '#555', marginBottom: '3px' }}>lucas</span>
<div style={{
padding: '10px 14px',
borderRadius: '12px 12px 12px 2px',
background: '#1a2a1a',
border: '1px solid #3a6a3a',
}}>
<TypingDots />
</div>
</div>
)}
<div ref={bottomRef} />
</div>

<div style={{
borderTop: '2px solid #4a4a8a',
padding: '10px 16px',
display: 'flex',
gap: '8px',
background: '#0f0f1a',
flexShrink: 0,
}}>
<input
style={{
flex: 1,
background: '#111122',
border: '1px solid #3a3a8a',
borderRadius: '20px',
padding: '10px 16px',
color: '#e0e0e0',
fontFamily: '"Courier New", monospace',
fontSize: '14px',
outline: 'none',
}}
value={input}
onChange={e => setInput(e.target.value)}
onKeyDown={e => e.key === 'Enter' && sendMessage()}
placeholder="escríbele a lucas..."
/>
<button
onClick={sendMessage}
style={{
background: '#1a1a4a',
border: '1px solid #4a4a8a',
borderRadius: '20px',
padding: '10px 16px',
color: '#a0a0ff',
fontFamily: '"Courier New", monospace',
fontSize: '13px',
cursor: 'pointer',
}}
>
enviar
</button>
</div>
</main>
);
}

function TypingDots() {
const [dots, setDots] = useState('');
useEffect(() => {
const interval = setInterval(() => {
setDots(d => d.length >= 3 ? '' : d + '.');
}, 400);
return () => clearInterval(interval);
}, []);
return (
<span style={{ color: '#a0ffa0', fontSize: '13px', letterSpacing: '3px' }}>
{dots || '.'}
</span>
);
}

