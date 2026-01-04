import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Send, MessageSquare } from 'lucide-react';
import { MOCK_MESSAGES, MOCK_DOCTORS } from '../../../lib/mockData';

export function PatientMessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  
  const messages = MOCK_MESSAGES.filter(
    m => m.senderId === 'patient-1' || m.receiverId === 'patient-1'
  );

  const getDoctorName = (id: string) => {
    return MOCK_DOCTORS.find(d => d.id === id)?.fullName || 'Doctor';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-gray-600">Communicate securely with your healthcare providers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {['doctor-1'].map(doctorId => (
                  <div
                    key={doctorId}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat === doctorId ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedChat(doctorId)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        {getDoctorName(doctorId)[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{getDoctorName(doctorId)}</p>
                        <p className="text-sm text-gray-600 truncate">Last message...</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {selectedChat ? (
            <>
              <CardHeader className="border-b">
                <CardTitle>{getDoctorName(selectedChat)}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[420px] p-4">
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === 'patient-1' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.senderId === 'patient-1'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.senderId === 'patient-1' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.sentAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setMessageText('');
                        }
                      }}
                    />
                    <Button onClick={() => setMessageText('')}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
