import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Colors from '../colors';

const Inbox = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    if (user) {
      getUserList();
    }
  }, [user]);

  useEffect(() => {
    if (userList.length > 0) {
      const filtered = filterUserList();
      setFilteredList(filtered);
    }
  }, [userList]);

  // 🗑️ Tüm sohbetleri Firebase'den sil
  const deleteAllChats = async () => {
    if (!window.confirm('Tüm sohbetleri silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      console.log("🗑️ Tüm sohbetler siliniyor...");
      const allChatsQuery = query(collection(db, 'Chat'));
      const allChatsSnapshot = await getDocs(allChatsQuery);

      console.log("📊 Silinecek sohbet sayısı:", allChatsSnapshot.size);

      for (const chatDoc of allChatsSnapshot.docs) {
        console.log("🗑️ Sohbet siliniyor:", chatDoc.id);
        await deleteDoc(doc(db, 'Chat', chatDoc.id));
      }

      console.log("✅ Tüm sohbetler silindi!");
      setUserList([]);
      setFilteredList([]);
      alert('Tüm sohbetler başarıyla silindi!');
    } catch (error) {
      console.error("❌ Sohbet silme hatası:", error);
      alert('Sohbetler silinirken bir hata oluştu.');
    }
  };

  // Kullanıcı listesinin alınması mevcut kullanıcı e-postalarına bağlıdır
  const getUserList = async () => {
    setLoading(true);
    setUserList([]);

    const currentUserEmail = user?.primaryEmailAddress?.emailAddress;
    console.log("📧 Inbox yükleniyor - Kullanıcı email:", currentUserEmail);

    if (!currentUserEmail) {
      console.error("❌ Kullanıcı email'i bulunamadı");
      setLoading(false);
      return;
    }

    try {
      // Firebase'den bu kullanıcının dahil olduğu tüm sohbetleri al
      console.log("🔍 Firebase query: userIds array-contains", currentUserEmail);
      const q = query(collection(db, 'Chat'),
        where('userIds', 'array-contains', currentUserEmail));
      const querySnapshot = await getDocs(q);

      console.log("📊 Firebase'den dönen sohbet sayısı:", querySnapshot.size);

      if (querySnapshot.size === 0) {
        console.log("❌ Bu kullanıcı için hiçbir sohbet bulunamadı!");
        console.log("🔍 Kontrol edilecek email:", currentUserEmail);
      }

      const chatList = [];
      querySnapshot.forEach((doc) => {
        const chatData = doc.data();
        console.log("\n💬 Bulunan sohbet:");
        console.log("📄 Document ID:", doc.id);
        console.log("📧 UserIds array:", chatData.userIds);
        console.log("👥 Users array:", chatData.users?.map(u => ({ email: u.email, name: u.name })));
        console.log("✅ Array contains check:", chatData.userIds?.includes(currentUserEmail));

        chatList.push({
          id: doc.id,
          ...chatData
        });
      });

      console.log("✅ Toplanan sohbet listesi:", chatList.length, "adet");
      setUserList(chatList);
    } catch (error) {
      console.error("❌ Sohbet listesi yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  // Diğer kullanıcıların listesini filtrele
  const filterUserList = () => {
    const list = [];
    const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

    console.log("🔄 Filtreleme başlıyor - Mevcut kullanıcı:", currentUserEmail);
    console.log("📋 Toplam işlenecek sohbet:", userList.length);

    userList.forEach((record, index) => {
      console.log(`\n--- Sohbet ${index + 1} işleniyor ---`);
      console.log("📄 Record ID:", record.id);
      console.log("📧 UserIds:", record.userIds);
      console.log("👥 Users array:", record.users);

      // userIds kontrolü
      if (!record.userIds || !Array.isArray(record.userIds)) {
        console.warn("⚠️ userIds eksik veya geçersiz");
        return;
      }

      // users kontrolü
      if (!record.users || !Array.isArray(record.users)) {
        console.warn("⚠️ users array eksik veya geçersiz");
        return;
      }

      // Diğer kullanıcıyı bul
      const otherUser = record.users.find((u) =>
        u && u.email && u.email !== currentUserEmail
      );

      console.log("🔍 Bulunan diğer kullanıcı:", otherUser);

      if (otherUser) {
        const result = {
          docId: record.id,
          email: otherUser.email,
          name: otherUser.name || otherUser.email?.split('@')[0] || 'Kullanıcı',
          imageUrl: otherUser.imageUrl || '',
          role: otherUser.role || 'user',
          petId: otherUser.petId || '',
          petName: otherUser.petName || ''
        };

        console.log("✅ Listeye eklenen kullanıcı:", result);
        list.push(result);
      } else {
        console.warn("❌ Bu sohbette diğer kullanıcı bulunamadı");
      }
    });

    console.log("🎯 Final filtrelenmiş liste:", list.length, "adet");
    return list;
  };

  const navigateToChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const UserItem = ({ userInfo }) => {
    console.log("UserItem received:", userInfo);

    if (!userInfo) {
      return (
        <div style={{
          padding: '15px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          margin: '10px'
        }}>
          <p>Invalid user data</p>
        </div>
      );
    }

    // Get initials if no profile image
    const getInitials = () => {
      if (!userInfo.name) return "?";
      return userInfo.name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    };

    // Format email to show only the username part before @
    const formatEmail = (email) => {
      if (!email) return '';
      const parts = email.split('@');
      return parts[0];
    };

    return (
      <div
        onClick={() => navigateToChat(userInfo.docId)}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          margin: '15px 0',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          e.target.style.borderColor = Colors.PRIMARY;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          e.target.style.borderColor = '#f0f0f0';
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          {userInfo.imageUrl ? (
            <img
              src={userInfo.imageUrl}
              alt={userInfo.name}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #f0f0f0'
              }}
            />
          ) : (
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${Colors.PRIMARY}, #d4a60d)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(232, 178, 14, 0.3)'
            }}>
              {getInitials()}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h4 style={{
              margin: '0 0 5px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#333'
            }}>
              {userInfo?.name || formatEmail(userInfo?.email) || 'Unknown User'}
            </h4>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: Colors.GRAY
            }}>
              {userInfo.petName ? `About ${userInfo.petName}` : 'Tap to continue chat'}
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {userInfo.role === 'owner' && (
              <div style={{
                backgroundColor: '#e8f5e8',
                color: '#2e7d32',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Owner
              </div>
            )}
            <div style={{
              fontSize: '24px',
              color: Colors.PRIMARY,
              fontWeight: 'bold'
            }}>
              →
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Modern Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px 20px',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${Colors.PRIMARY}, #d4a60d)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              💬
            </div>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#333',
                margin: '0 0 5px 0'
              }}>
                Messages
              </h1>
              <p style={{
                fontSize: '16px',
                color: Colors.GRAY,
                margin: 0
              }}>
                Connect with pet owners and adopters
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            {filteredList.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f8f9fa',
                padding: '8px 15px',
                borderRadius: '20px'
              }}>
                <span style={{
                  fontSize: '14px',
                  color: Colors.GRAY
                }}>
                  Active Chats:
                </span>
                <div style={{
                  backgroundColor: Colors.PRIMARY,
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {filteredList.length}
                </div>
              </div>
            )}

            {/* Clean up button */}
            <button
              onClick={deleteAllChats}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#c82333';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: `4px solid ${Colors.PRIMARY}`,
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '25px'
            }} />
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '10px'
            }}>
              Loading Messages
            </h3>
            <p style={{
              fontSize: '16px',
              color: Colors.GRAY
            }}>
              Please wait while we fetch your conversations...
            </p>
          </div>
        ) : (
          <>
            {filteredList.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 40px',
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '60px',
                  background: `linear-gradient(135deg, ${Colors.PRIMARY}, #d4a60d)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '30px',
                  fontSize: '50px'
                }}>
                  💭
                </div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  marginBottom: '15px',
                  color: '#333'
                }}>
                  No conversations yet
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: Colors.GRAY,
                  lineHeight: '1.6',
                  maxWidth: '400px',
                  marginBottom: '30px'
                }}>
                  Start your first conversation by contacting pet owners when you find a pet you're interested in adopting.
                </p>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    backgroundColor: Colors.PRIMARY,
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#d4a60d';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = Colors.PRIMARY;
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🐾 Browse Pets
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  marginBottom: '25px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#333',
                    margin: 0
                  }}>
                    Recent Conversations
                  </h3>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '0'
                }}>
                  {filteredList.map((item) => (
                    <UserItem key={item.docId || Math.random().toString()} userInfo={item} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .inbox-header {
              flex-direction: column !important;
              gap: 20px !important;
              text-align: center !important;
            }
            
            .inbox-header-actions {
              justify-content: center !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Inbox;
