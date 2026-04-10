"use client";

import { useState } from "react";
import { markMessageRead, deleteMessage } from "@/app/actions/contact";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export default function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const selected = messages.find((m) => m.id === selectedId);

  const handleSelect = async (msg: Message) => {
    setSelectedId(msg.id);
    if (!msg.read) {
      await markMessageRead(msg.id);
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await deleteMessage(id);
    setMessages(messages.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
    setDeleting(null);
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Message List */}
      <div className="lg:col-span-2">
        <div className="admin-card overflow-hidden p-0">
          {messages.length > 0 ? (
            <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className="w-full text-left p-4 transition-colors cursor-pointer"
                  style={{
                    background: selectedId === msg.id ? "var(--accent-glow)" : msg.read ? "transparent" : "rgba(99,102,241,0.03)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.read && (
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--accent-primary)" }} />
                    )}
                    <span className={`text-sm truncate ${!msg.read ? "font-bold" : "font-medium"}`}>
                      {msg.name}
                    </span>
                    <span className="text-xs ml-auto shrink-0" style={{ color: "var(--text-tertiary)" }}>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-medium truncate" style={{ color: "var(--text-secondary)" }}>
                    {msg.subject}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
                    {msg.message.slice(0, 80)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12" style={{ color: "var(--text-tertiary)" }}>
              <p>No messages yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-3">
        {selected ? (
          <div className="admin-card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">{selected.subject}</h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  From <strong>{selected.name}</strong> ({selected.email})
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(selected.id)}
                disabled={deleting === selected.id}
                className="px-3 py-1.5 text-xs rounded-lg font-medium cursor-pointer"
                style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
              >
                {deleting === selected.id ? "Deleting..." : "Delete"}
              </button>
            </div>
            <div
              className="p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap"
              style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
            >
              {selected.message}
            </div>
            <div className="mt-4">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="btn-primary text-sm"
              >
                Reply via Email
              </a>
            </div>
          </div>
        ) : (
          <div className="admin-card text-center py-16" style={{ color: "var(--text-tertiary)" }}>
            <p>Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
