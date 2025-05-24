import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Colors from '../colors';

const Chat = () => {
  const { chatId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (chatId) {
      loadChatData();
      subscribeToMessages();
    }
  }, [chatId, user]);

  const loadChatData = async () => {
    try {
      console.log('📱 Chat yükleniyor - Chat ID:', chatId);

      // Chat bilgilerini al
      const chatDoc = await getDoc(doc(db, 'Chat', chatId));

      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        console.log('💬 Chat verileri:', chatData);

        // Diğer kullanıcıyı bul
        const currentUserEmail = user?.primaryEmailAddress?.emailAddress;
        const otherUserData = chatData.users?.find(u => u.email !== currentUserEmail);

        if (otherUserData) {
          setOtherUser(otherUserData);
          console.log('👤 Diğer kullanıcı:', otherUserData);
        }
      }
    } catch (error) {
      console.error('❌ Chat verisi yüklenirken hata:', error);
    }
  };

  const subscribeToMessages = () => {
    try {
      console.log('📡 Mesajlar dinleniyor...');

      const messagesQuery = query(
        collection(db, 'ChatMessages'),
        where('chatId', '==', chatId)
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesList = [];
        snapshot.forEach((doc) => {
          messagesList.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Mesajları zaman sırasına göre sırala
        messagesList.sort((a, b) => {
          const aTime = a.timestamp?.toDate() || new Date(0);
          const bTime = b.timestamp?.toDate() || new Date(0);
          return aTime - bTime;
        });

        console.log('💬 Mesajlar güncellendi:', messagesList.length, 'adet');
        setMessages(messagesList);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('❌ Mesaj dinleme hatası:', error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

      console.log('📤 Mesaj gönderiliyor:', newMessage);

      await addDoc(collection(db, 'ChatMessages'), {
        chatId: chatId,
        message: newMessage.trim(),
        sendBy: currentUserEmail,
        timestamp: new Date(),
        messageType: 'text'
      });

      setNewMessage('');
      console.log('✅ Mesaj gönderildi');
    } catch (error) {
      console.error('❌ Mesaj gönderme hatası:', error);
      alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const MessageBubble = ({ message }) => {
    const currentUserEmail = user?.primaryEmailAddress?.emailAddress;
    const isMyMessage = message.sendBy === currentUserEmail;
    const messageTime = message.timestamp?.toDate();

    return (
      <div style={{
        display: 'flex',
        justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
        marginBottom: '10px'
      }}>
        <div style={{
          maxWidth: '70%',
          backgroundColor: isMyMessage ? Colors.PRIMARY : '#f0f0f0',
          color: isMyMessage ? 'white' : '#333',
          padding: '12px 16px',
          borderRadius: '18px',
          borderBottomRightRadius: isMyMessage ? '4px' : '18px',
          borderBottomLeftRadius: isMyMessage ? '18px' : '4px'
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {message.message}
          </p>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '11px',
            opacity: 0.7
          }}>
            {messageTime ? messageTime.toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            }) : ''}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `4px solid ${Colors.PRIMARY}`,
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <p style={{ fontSize: '16px', color: '#666' }}>Sohbet yükleniyor...</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <button
          onClick={() => navigate('/inbox')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: Colors.PRIMARY,
            cursor: 'pointer'
          }}
        >
          ←
        </button>

        {otherUser?.imageUrl ? (
          <img
            src={otherUser.imageUrl}
            alt={otherUser.name}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '22px',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '45px',
            height: '45px',
            borderRadius: '22px',
            backgroundColor: Colors.PRIMARY,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {otherUser?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}

        <div>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {otherUser?.name || 'Kullanıcı'}
          </h2>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#666'
          }}>
            {otherUser?.petName && `${otherUser.petName} hakkında`}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#f8f9fa'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '40px',
              backgroundColor: Colors.PRIMARY,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              fontSize: '30px'
            }}>
              💬
            </div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#333'
            }}>Henüz mesaj yok</h3>
            <p style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.5'
            }}>
              İlk mesajınızı gönderin ve sohbeti başlatın
            </p>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderTop: '1px solid #f0f0f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px'
        }}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            rows={1}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              fontSize: '14px',
              resize: 'none',
              maxHeight: '100px',
              minHeight: '45px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '22px',
              backgroundColor: (!newMessage.trim() || sending) ? '#ccc' : Colors.PRIMARY,
              color: 'white',
              border: 'none',
              cursor: (!newMessage.trim() || sending) ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {sending ? '⏳' : '→'}
          </button>
        </div>
      </div>

      <style>
        {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
      </style>
    </div>
  );
};

export default Chat;
