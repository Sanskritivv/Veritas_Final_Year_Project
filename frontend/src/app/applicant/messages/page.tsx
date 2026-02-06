'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  from: 'you' | 'support';
  text: string;
  timestamp: string;
  unread?: boolean;
};

const initialMessages: Message[] = [
  {
    id: 'm1',
    from: 'support',
    text: 'Hi John, we have received your application and are currently reviewing your documents.',
    timestamp: 'Today, 10:21 AM',
  },
  {
    id: 'm2',
    from: 'you',
    text: 'Thank you. Please let me know if you need any additional information.',
    timestamp: 'Today, 10:24 AM',
  },
  {
    id: 'm3',
    from: 'support',
    text: 'We might request updated bank statements once the preliminary review is complete.',
    timestamp: 'Today, 11:02 AM',
    unread: true,
  },
];

export default function ApplicantMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (!draft.trim()) return;
    const next: Message = {
      id: `m-${Date.now()}`,
      from: 'you',
      text: draft.trim(),
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, next]);
    setDraft('');
    toast({
      title: 'Message sent',
      description: 'Your message has been delivered to the support team.',
    });
  };

  const handleMarkAsRead = () => {
    setMessages((prev) =>
      prev.map((msg) => ({ ...msg, unread: false }))
    );
    toast({
      title: 'Marked as read',
      description: 'All messages have been marked as read.',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const hasUnread = messages.some((m) => m.unread);

  return (
    <div className="grid gap-6">
      <Card className="flex flex-col h-[500px]">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Messages
            </CardTitle>
            <CardDescription>
              Secure messaging with the loan support team.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {hasUnread && (
              <Badge variant="default">New</Badge>
            )}
            {hasUnread && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkAsRead}
                className="text-xs"
              >
                Mark as read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1 rounded-md border bg-muted/40 p-3">
            <div className="space-y-3" ref={scrollRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'you' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.from === 'you'
                        ? 'bg-primary text-primary-foreground'
                        : msg.unread
                        ? 'bg-background border-2 border-primary'
                        : 'bg-background border'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="mt-1 text-[10px] opacity-70">
                      {msg.timestamp}
                      {msg.unread && ' • Unread'}
                    </p>
                  </div>
                </div>
              ))}
              {!messages.length && (
                <p className="text-xs text-muted-foreground text-center">
                  No messages yet. Start a conversation with our support team.
                </p>
              )}
            </div>
          </ScrollArea>
          <div className="flex flex-col gap-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message to the support team... (Press Enter to send)"
              className="min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={handleSend} disabled={!draft.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


