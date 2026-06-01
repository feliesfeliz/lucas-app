'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = { role: string; content: string };

export default function Home() {
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState('');
const [loading, setLoading] = useState(false);
const bottomRef = useRef<HTMLDivElement>(null);

async function loadMessages() {
const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
if (data) setMessages(data as Message[]);
}

useEffect(() => { loadMessages(); }, []);
useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

async function sendMessage() {
if (!input.trim()) return;
const userMessage: Message = { role: 'user', content: input };
setInput('');
setLoading(true);
await supabase.from('messages').insert(userMessage);
setMessages(prev => [...prev, userMessage]);
const res = await fetch('/api/chat', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ messages: [...messages, userMessage] }),
});
const data = await res.json();
const assistantMessage: Message = { role: 'assistant', content: data.reply };
await supabase.from('messages').insert(assistantMessage);
setMessages(prev => [...prev, assistantMessage]);
setLoading(false);
}

return (
<main className="flex flex-col h-screen bg-gray-950 text-white">
<div className="p-4 border-b border-gray-800 text-center font-bold text-lg">Lucas</div>
<div className="flex-1 overflow-y-auto p-4 space-y-3">
{messages.map((msg, i) => (
<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
<div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>
{msg.content}
</div>
</div>
))}
{loading && <div className="flex justify-start"><div className="bg-gray-800 px-4 py-2 rounded-2xl text-sm">...</div></div>}
<div ref={bottomRef} />
</div>
<div className="p-4 border-t border-gray-800 flex gap-2">
<input
className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm outline-none"
value={input}
onChange={e => setInput(e.target.value)}
onKeyDown={e => e.key === 'Enter' && sendMessage()}
placeholder="Escríbele a Lucas..."
/>
<button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded-full text-sm">Enviar</button>
</div>
</main>
);
}

