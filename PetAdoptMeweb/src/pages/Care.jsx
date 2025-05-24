import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { SmartCareService } from '../services/smartCareService';
import Colors from '../colors';

const Care = () => {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState('pets');
  const [userPets, setUserPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petAnalysis, setPetAnalysis] = useState(null);
  const [smartRecommendations, setSmartRecommendations] = useState([]);
  const [feedingPlan, setFeedingPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPets();
    }
  }, [user]);

  const loadUserPets = async () => {
    try {
      setLoading(true);
      console.log('🐾 Kullanıcı pet\'leri yükleniyor...');

      const pets = await SmartCareService.getUserPets(user?.emailAddresses[0]?.emailAddress);
      setUserPets(pets);

      if (pets.length > 0) {
        // İlk pet'i seç ve analiz et
        selectPet(pets[0]);
      }

      console.log('✅ Pet verileri yüklendi:', pets.length, 'adet');
    } catch (error) {
      console.error('❌ Pet verileri yüklenirken hata:', error);
      alert('Pet verileriniz yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const selectPet = async (pet) => {
    try {
      console.log('🧠 AI analizi başlıyor:', pet.name);
      setSelectedPet(pet);

      // AI analizi
      const analysis = SmartCareService.analyzePetBehavior(pet);
      setPetAnalysis(analysis);
      setSmartRecommendations(analysis.recommendations);

      // Akıllı beslenme planı
      const feeding = SmartCareService.generateSmartFeedingPlan(pet, analysis);
      setFeedingPlan(feeding);

      console.log('✅ AI analizi tamamlandı - Skor:', analysis.aiScore);
    } catch (error) {
      console.error('❌ AI analizi hatası:', error);
    }
  };

  const showAdviceDetail = (advice, title) => {
    setSelectedAdvice({ advice, title });
    setShowModal(true);
  };

  const renderSectionButtons = () => (
    <div style={{
      display: 'flex',
      backgroundColor: 'white',
      margin: '15px',
      borderRadius: '25px',
      padding: '5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <button
        onClick={() => setActiveSection('pets')}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: activeSection === 'pets' ? Colors.PRIMARY : 'transparent',
          color: activeSection === 'pets' ? 'white' : Colors.PRIMARY,
          fontSize: '12px',
          fontWeight: '500',
          cursor: 'pointer',
          gap: '8px'
        }}
      >
        <span>🐾</span>
        Petlerim
      </button>

      <button
        onClick={() => setActiveSection('analysis')}
        disabled={!selectedPet}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: activeSection === 'analysis' ? Colors.PRIMARY : 'transparent',
          color: activeSection === 'analysis' ? 'white' : selectedPet ? Colors.PRIMARY : '#ccc',
          fontSize: '12px',
          fontWeight: '500',
          cursor: selectedPet ? 'pointer' : 'not-allowed',
          gap: '8px'
        }}
      >
        <span>📊</span>
        AI Analiz
      </button>

      <button
        onClick={() => setActiveSection('feeding')}
        disabled={!selectedPet}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: activeSection === 'feeding' ? Colors.PRIMARY : 'transparent',
          color: activeSection === 'feeding' ? 'white' : selectedPet ? Colors.PRIMARY : '#ccc',
          fontSize: '12px',
          fontWeight: '500',
          cursor: selectedPet ? 'pointer' : 'not-allowed',
          gap: '8px'
        }}
      >
        <span>🍽️</span>
        Beslenme
      </button>
    </div>
  );

  const renderPetsList = () => (
    <div style={{ paddingBottom: '20px' }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginBottom: '15px'
      }}>
        🐾 Petlerim
      </h2>

      {userPets.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '50px 20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🐾</div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>Henüz pet'iniz bulunmuyor</h3>
          <p style={{
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.5'
          }}>Pet ekleyerek akıllı bakım önerilerinden yararlanın</p>
        </div>
      ) : (
        <div>
          {userPets.map((pet) => (
            <div
              key={pet.docId}
              onClick={() => selectPet(pet)}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '15px',
                marginBottom: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: selectedPet?.docId === pet.docId ? `2px solid ${Colors.PRIMARY}` : '2px solid transparent',
                backgroundColor: selectedPet?.docId === pet.docId ? `${Colors.PRIMARY}20` : 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '30px',
                  overflow: 'hidden',
                  marginRight: '15px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {pet.imageUrl ? (
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '30px' }}>
                      {pet.category === 'Dogs' ? '🐕' :
                        pet.category === 'Cats' ? '🐱' : '🦅'}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: Colors.PRIMARY,
                    marginBottom: '5px',
                    margin: 0
                  }}>{pet.name}</h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '2px',
                    margin: 0
                  }}>{pet.breed} • {pet.age} yaş</p>
                  <p style={{
                    fontSize: '12px',
                    color: '#999',
                    margin: 0
                  }}>{pet.weight} kg • {pet.category}</p>
                </div>
              </div>
              <span style={{ fontSize: '20px', color: '#ccc' }}>→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAIAnalysis = () => {
    if (!selectedPet || !petAnalysis) {
      return (
        <div style={{ paddingBottom: '20px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: Colors.PRIMARY,
            marginBottom: '15px'
          }}>
            🤖 AI Analizi
          </h2>
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', marginTop: '50px' }}>
            Pet seçin veya analiz yükleniyor...
          </p>
        </div>
      );
    }

    return (
      <div style={{ paddingBottom: '20px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: Colors.PRIMARY,
          marginBottom: '15px'
        }}>
          🤖 AI Analizi - {selectedPet.name}
        </h2>

        {/* AI Skoru */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '15px',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>🏆</span>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: Colors.PRIMARY,
              margin: 0
            }}>Genel AI Skoru</h3>
          </div>
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: Colors.PRIMARY,
            marginBottom: '15px'
          }}>{petAnalysis.aiScore}/100</div>
          <div style={{
            width: '100%',
            height: '12px',
            backgroundColor: '#f0f0f0',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: Colors.PRIMARY,
              borderRadius: '6px',
              width: `${petAnalysis.aiScore}%`
            }} />
          </div>
        </div>

        {/* Analiz Detayları */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {[
            { icon: '⚡', label: 'Enerji', value: `${petAnalysis.energyLevel}%` },
            { icon: '👥', label: 'Sosyal', value: `${petAnalysis.socialNeed}%` },
            { icon: '🏥', label: 'Sağlık Riski', value: `${petAnalysis.healthRisk}%` },
            { icon: '🛠️', label: 'Bakım', value: `${petAnalysis.careComplexity}%` }
          ].map((item, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '15px',
              textAlign: 'center',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                marginBottom: '4px'
              }}>{item.label}</div>
              <div style={{
                fontSize: '16px',
                color: Colors.PRIMARY,
                fontWeight: 'bold'
              }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* AI Önerileri */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: Colors.PRIMARY,
          marginBottom: '15px'
        }}>🎯 AI Önerileri</h3>
        {smartRecommendations.map((recommendation, index) => (
          <div
            key={index}
            onClick={() => showAdviceDetail(recommendation.actions, recommendation.title)}
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '15px',
              marginBottom: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              borderLeft: recommendation.priority === 'critical' ? '4px solid #ff4444' :
                recommendation.priority === 'high' ? '4px solid #ff9800' : '4px solid #4caf50'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: Colors.PRIMARY,
                margin: 0,
                flex: 1
              }}>{recommendation.title}</h4>
              <span style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '10px',
                backgroundColor: recommendation.priority === 'critical' ? '#ff4444' :
                  recommendation.priority === 'high' ? '#ff9800' : Colors.PRIMARY
              }}>
                {recommendation.priority === 'critical' ? 'ACİL' :
                  recommendation.priority === 'high' ? 'ÖNEMLİ' : 'NORMAL'}
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.4',
              margin: 0
            }}>{recommendation.description}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderSmartFeeding = () => {
    if (!selectedPet || !feedingPlan) {
      return (
        <div style={{ paddingBottom: '20px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: Colors.PRIMARY,
            marginBottom: '15px'
          }}>
            🍽️ Akıllı Beslenme
          </h2>
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', marginTop: '50px' }}>
            Pet seçin veya plan yükleniyor...
          </p>
        </div>
      );
    }

    return (
      <div style={{ paddingBottom: '20px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: Colors.PRIMARY,
          marginBottom: '15px'
        }}>
          🍽️ Akıllı Beslenme - {selectedPet.name}
        </h2>

        {/* Kalori Bilgisi */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>🔥</span>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: Colors.PRIMARY,
              margin: 0
            }}>Günlük Kalori İhtiyacı</h3>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: Colors.PRIMARY,
            marginBottom: '10px'
          }}>{Math.round(feedingPlan.dailyCalories)} kalori</div>
          <p style={{
            fontSize: '12px',
            color: '#666',
            fontStyle: 'italic',
            margin: 0
          }}>{feedingPlan.note}</p>
        </div>

        {/* Besin Değerleri */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>🥗</span>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: Colors.PRIMARY,
              margin: 0
            }}>Besin Değerleri</h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px'
          }}>
            {[
              { label: 'Protein', value: `${feedingPlan.protein}%` },
              { label: 'Yağ', value: `${feedingPlan.fat}%` },
              { label: 'Lif', value: `${feedingPlan.fiber}%` },
              { label: 'Öğün', value: `${feedingPlan.frequency}/gün` }
            ].map((item, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '5px'
                }}>{item.label}</div>
                <div style={{
                  fontSize: '16px',
                  color: Colors.PRIMARY,
                  fontWeight: 'bold'
                }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplements */}
        {feedingPlan.supplements.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '15px',
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>💊</span>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: Colors.PRIMARY,
                margin: 0
              }}>AI Önerisi Supplements</h3>
            </div>
            {feedingPlan.supplements.map((supplement, index) => (
              <p key={index} style={{
                fontSize: '14px',
                color: '#666',
                margin: '5px 0'
              }}>• {supplement}</p>
            ))}
          </div>
        )}

        {/* Yasak Gıdalar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            gap: '10px'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ff4444',
              margin: 0
            }}>Yasak Gıdalar</h3>
          </div>
          {feedingPlan.restrictions.map((restriction, index) => (
            <p key={index} style={{
              fontSize: '14px',
              color: '#ff4444',
              margin: '5px 0'
            }}>❌ {restriction}</p>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🐾</div>
          <p style={{ fontSize: '16px', color: '#666' }}>Pet'leriniz yükleniyor...</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'pets':
        return renderPetsList();
      case 'analysis':
        return renderAIAnalysis();
      case 'feeding':
        return renderSmartFeeding();
      default:
        return renderPetsList();
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        backgroundColor: Colors.PRIMARY,
        padding: '20px',
        paddingTop: '50px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          marginBottom: '10px'
        }}>🤖 Akıllı Pet Bakım</h1>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.8)',
          margin: 0
        }}>
          {selectedPet ? `${selectedPet.name} için AI önerileri` : 'Pet seçin'}
        </p>
      </div>

      {/* Section Buttons */}
      {renderSectionButtons()}

      {/* Content */}
      <div style={{ padding: '0 15px' }}>
        {renderContent()}
      </div>

      {/* Detail Modal */}
      {showModal && selectedAdvice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '20px',
            margin: '20px',
            maxHeight: '80vh',
            width: '90%',
            maxWidth: '500px',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: Colors.PRIMARY,
                margin: 0
              }}>{selectedAdvice.title}</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#ccc',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {Array.isArray(selectedAdvice.advice) ? (
                selectedAdvice.advice.map((item, index) => (
                  <p key={index} style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '8px',
                    lineHeight: '1.5'
                  }}>• {item}</p>
                ))
              ) : (
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.5'
                }}>{selectedAdvice.advice}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Care;
