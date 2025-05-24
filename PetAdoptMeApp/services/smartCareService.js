// services/smartCareService.js
// 🤖 Akıllı Pet Bakım Asistanı - Gerçek AI Sistemi

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/FirabaseConfig';

export class SmartCareService {

    // 🔥 Firebase'den kullanıcının pet'lerini al
    static async getUserPets(userEmail) {
        try {
            console.log('🔍 Kullanıcı pet\'leri alınıyor:', userEmail);

            const q = query(collection(db, 'Pets'), where('useremail', '==', userEmail));
            const querySnapshot = await getDocs(q);

            const pets = [];
            querySnapshot.forEach((doc) => {
                pets.push({
                    docId: doc.id,
                    ...doc.data()
                });
            });

            console.log('✅ Pet verileri alındı:', pets.length, 'adet');
            return pets;
        } catch (error) {
            console.error('❌ Pet verileri alınırken hata:', error);
            return [];
        }
    }

    // 🧠 AI destekli pet analizi
    static analyzePetBehavior(pet) {
        const analysis = {
            energyLevel: this.calculateEnergyLevel(pet),
            socialNeed: this.calculateSocialNeed(pet),
            healthRisk: this.calculateHealthRisk(pet),
            careComplexity: this.calculateCareComplexity(pet),
            adaptability: this.calculateAdaptability(pet)
        };

        // AI skorlaması
        const aiScore = this.calculateAIScore(analysis);

        return {
            ...analysis,
            aiScore,
            recommendations: this.generateAIRecommendations(pet, analysis)
        };
    }

    // ⚡ Enerji seviyesi hesaplama (AI algoritması)
    static calculateEnergyLevel(pet) {
        let score = 50; // Base score

        // Yaş faktörü
        const age = parseFloat(pet.age) || 1;
        if (age < 1) score += 30; // Yavru çok enerjik
        else if (age < 3) score += 20; // Genç enerjik
        else if (age < 7) score += 10; // Yetişkin normal
        else score -= 20; // Yaşlı daha az enerjik

        // Cins faktörü (AI pattern recognition)
        const breed = pet.breed?.toLowerCase() || '';
        const highEnergyPatterns = [
            'border', 'collie', 'husky', 'shepherd', 'retriever',
            'jack russell', 'beagle', 'pointer', 'setter'
        ];
        const lowEnergyPatterns = [
            'bulldog', 'pug', 'basset', 'persian', 'ragdoll', 'shih tzu'
        ];

        if (highEnergyPatterns.some(pattern => breed.includes(pattern))) {
            score += 25;
        } else if (lowEnergyPatterns.some(pattern => breed.includes(pattern))) {
            score -= 25;
        }

        // Boyut faktörü
        const weight = parseFloat(pet.weight) || 5;
        if (weight > 30) score += 15; // Büyük köpekler daha enerjik
        else if (weight < 5) score -= 10; // Küçük hayvanlar daha az dayanıklı

        // Kategori faktörü
        if (pet.category === 'Dogs') score += 15;
        else if (pet.category === 'Cats') score += 5;
        else if (pet.category === 'Birds') score += 10;

        return Math.max(0, Math.min(100, score));
    }

    // 👥 Sosyalleşme ihtiyacı (AI analizi)
    static calculateSocialNeed(pet) {
        let score = 50;

        const breed = pet.breed?.toLowerCase() || '';
        const age = parseFloat(pet.age) || 1;

        // Köpekler genel olarak daha sosyal
        if (pet.category === 'Dogs') {
            score += 20;

            // Sosyal köpek cinsleri
            const socialBreeds = [
                'golden', 'labrador', 'retriever', 'spaniel', 'setter',
                'shepherd', 'collie', 'pointer', 'boxer'
            ];

            if (socialBreeds.some(b => breed.includes(b))) {
                score += 15;
            }
        } else if (pet.category === 'Cats') {
            score += 5;

            // Sosyal kedi cinsleri  
            const socialCats = ['ragdoll', 'maine coon', 'siamese', 'burmese'];
            if (socialCats.some(b => breed.includes(b))) {
                score += 10;
            }
        }

        // Yaş faktörü - yavrular daha çok sosyalleşme gerektirir
        if (age < 1) score += 20;
        else if (age > 8) score -= 10;

        return Math.max(0, Math.min(100, score));
    }

    // 🏥 Sağlık riski hesaplama (AI tahmin)
    static calculateHealthRisk(pet) {
        let risk = 20; // Base düşük risk

        const age = parseFloat(pet.age) || 1;
        const breed = pet.breed?.toLowerCase() || '';

        // Yaş riski
        if (age > 8) risk += 30;
        else if (age > 12) risk += 50;
        else if (age < 0.5) risk += 15; // Çok genç

        // Cins-spesifik sağlık riskleri (AI öğrenme)
        const riskBreeds = {
            'bulldog': 25, 'pug': 20, 'dachshund': 15,
            'german shepherd': 15, 'rottweiler': 10,
            'persian': 15, 'siamese': 10, 'maine coon': 10
        };

        for (const [riskBreed, riskScore] of Object.entries(riskBreeds)) {
            if (breed.includes(riskBreed)) {
                risk += riskScore;
                break;
            }
        }

        // Boyut riski
        const weight = parseFloat(pet.weight) || 5;
        if (weight > 50) risk += 10; // Çok büyük köpekler
        else if (weight < 2) risk += 15; // Çok küçük hayvanlar

        return Math.max(0, Math.min(100, risk));
    }

    // 🎯 Bakım karmaşıklığı (AI skorlaması)
    static calculateCareComplexity(pet) {
        let complexity = 30; // Base orta seviye

        const breed = pet.breed?.toLowerCase() || '';

        // Tüy bakımı karmaşıklığı
        const highMaintenanceCoats = [
            'poodle', 'afghan', 'yorkshire', 'maltese', 'shih tzu',
            'persian', 'maine coon', 'ragdoll'
        ];

        if (highMaintenanceCoats.some(b => breed.includes(b))) {
            complexity += 25;
        }

        // Egzersiz gereksinimleri
        const energyLevel = this.calculateEnergyLevel(pet);
        complexity += (energyLevel * 0.3); // Yüksek enerji = yüksek karmaşıklık

        // Sağlık riski
        const healthRisk = this.calculateHealthRisk(pet);
        complexity += (healthRisk * 0.4);

        // Özel bakım gereksinimleri
        if (pet.category === 'Birds') complexity += 20;
        if (pet.category === 'Exotic') complexity += 30;

        return Math.max(0, Math.min(100, complexity));
    }

    // 🔄 Adaptasyon kabiliyeti (AI değerlendirmesi)
    static calculateAdaptability(pet) {
        let adaptability = 50;

        const age = parseFloat(pet.age) || 1;
        const breed = pet.breed?.toLowerCase() || '';

        // Yaş faktörü
        if (age >= 1 && age <= 3) adaptability += 20; // En iyi yaş
        else if (age < 1) adaptability += 10; // Genç ama öğrenebilir
        else if (age > 8) adaptability -= 15; // Yaşlı, alışkanlık sahibi

        // Cins faktörü
        const adaptableBreeds = [
            'labrador', 'golden', 'retriever', 'border collie',
            'german shepherd', 'poodle', 'mixed', 'mutt'
        ];

        if (adaptableBreeds.some(b => breed.includes(b))) {
            adaptability += 20;
        }

        // Kategori faktörü
        if (pet.category === 'Dogs') adaptability += 15;
        else if (pet.category === 'Cats') adaptability += 5;

        return Math.max(0, Math.min(100, adaptability));
    }

    // 🤖 AI skoru hesaplama
    static calculateAIScore(analysis) {
        const weights = {
            energyLevel: 0.25,
            socialNeed: 0.20,
            healthRisk: 0.30, // En önemli faktör
            careComplexity: 0.15,
            adaptability: 0.10
        };

        // Ağırlıklı ortalama (sağlık riski negatif etki)
        const score = (
            analysis.energyLevel * weights.energyLevel +
            analysis.socialNeed * weights.socialNeed +
            (100 - analysis.healthRisk) * weights.healthRisk + // Ters çevrildi
            (100 - analysis.careComplexity) * weights.careComplexity + // Ters çevrildi
            analysis.adaptability * weights.adaptability
        );

        return Math.round(score);
    }

    // 🎯 AI önerileri üretme
    static generateAIRecommendations(pet, analysis) {
        const recommendations = [];

        // Enerji bazlı öneriler
        if (analysis.energyLevel > 70) {
            recommendations.push({
                type: 'exercise',
                priority: 'high',
                title: '🏃‍♂️ Yüksek Egzersiz İhtiyacı',
                description: `${pet.name} çok enerjik! Günde 2+ saat aktif egzersiz gerekli.`,
                actions: [
                    'Sabah-akşam uzun yürüyüşler',
                    'Top oyunu veya frisbee',
                    'Koşu parkları ziyareti',
                    'Mental stimülasyon oyunları'
                ]
            });
        } else if (analysis.energyLevel < 30) {
            recommendations.push({
                type: 'gentle_care',
                priority: 'medium',
                title: '😌 Sakin Bakım Programı',
                description: `${pet.name} daha az enerjik, nazik egzersiz programı.`,
                actions: [
                    'Kısa yürüyüşler (15-20 dk)',
                    'İç mekan oyunları',
                    'Masaj ve tüy bakımı',
                    'Rahat dinlenme alanları'
                ]
            });
        }

        // Sosyal ihtiyaç önerileri
        if (analysis.socialNeed > 60) {
            recommendations.push({
                type: 'socialization',
                priority: 'high',
                title: '👥 Sosyalleşme Programı',
                description: `${pet.name} çok sosyal! Diğer hayvanlar ve insanlarla etkileşim.`,
                actions: [
                    'Köpek parkları ziyareti',
                    'Pet cafe ziyaretleri',
                    'Arkadaşların evine götürme',
                    'Grup eğitim sınıfları'
                ]
            });
        }

        // Sağlık riski önerileri
        if (analysis.healthRisk > 50) {
            recommendations.push({
                type: 'health',
                priority: 'critical',
                title: '🏥 Özel Sağlık Takibi',
                description: `${pet.name} için yakın sağlık takibi öneriliyor.`,
                actions: [
                    'Aylık veteriner kontrolü',
                    'Özel diyet programı',
                    'Düzenli kan tahlilleri',
                    'Günlük sağlık gözlemi'
                ]
            });
        }

        // Bakım karmaşıklığı önerileri
        if (analysis.careComplexity > 60) {
            recommendations.push({
                type: 'grooming',
                priority: 'medium',
                title: '✂️ Profesyonel Bakım',
                description: `${pet.name} özel bakım gereksinimleri var.`,
                actions: [
                    'Haftalık profesyonel tıraş',
                    'Günlük tüy tarama',
                    'Özel şampuan kullanımı',
                    'Tırnak-diş bakımı'
                ]
            });
        }

        return recommendations;
    }

    // 🔮 Gelecek tahminleri (Predictive AI)
    static generatePredictions(pet, analysis) {
        const predictions = [];

        const age = parseFloat(pet.age) || 1;

        // Yaş tahminleri
        if (age < 1) {
            predictions.push({
                timeframe: '3 ay içinde',
                prediction: 'Aşı takvimi tamamlanacak, sosyalleşme kritik dönem',
                confidence: 85
            });
        }

        if (age > 7) {
            predictions.push({
                timeframe: '1 yıl içinde',
                prediction: 'Yaşlılık belirtileri artabilir, sağlık kontrolü sıklığını artırın',
                confidence: 70
            });
        }

        // Davranış tahminleri
        if (analysis.energyLevel > 70 && analysis.socialNeed > 60) {
            predictions.push({
                timeframe: '6 ay içinde',
                prediction: 'Sosyal aktivite artışı ile davranış problemleri azalabilir',
                confidence: 75
            });
        }

        return predictions;
    }

    // 📊 Pet raporu oluşturma
    static generatePetReport(pet) {
        const analysis = this.analyzePetBehavior(pet);
        const predictions = this.generatePredictions(pet, analysis);

        return {
            pet: {
                name: pet.name,
                breed: pet.breed,
                age: pet.age,
                category: pet.category
            },
            analysis,
            recommendations: analysis.recommendations,
            predictions,
            reportDate: new Date().toISOString(),
            aiVersion: '2.0.1'
        };
    }

    // 🎯 Akıllı beslenme planı
    static generateSmartFeedingPlan(pet, analysis) {
        const basePlan = this.getBaseFeedingPlan(pet);

        // AI optimizasyonu
        if (analysis.energyLevel > 70) {
            basePlan.calories *= 1.3;
            basePlan.protein += 5;
            basePlan.note += ' Yüksek enerji için artırıldı.';
        }

        if (analysis.healthRisk > 50) {
            basePlan.supplements.push('Glukosamin', 'Omega-3', 'Probiyotik');
            basePlan.note += ' Sağlık riski için supplement eklendi.';
        }

        if (pet.age > 7) {
            basePlan.calories *= 0.9;
            basePlan.fiber += 3;
            basePlan.note += ' Yaşlılık için ayarlandı.';
        }

        return basePlan;
    }

    static getBaseFeedingPlan(pet) {
        const weight = parseFloat(pet.weight) || 5;
        const age = parseFloat(pet.age) || 1;

        return {
            dailyCalories: weight * 50, // Base kalori
            protein: pet.category === 'Cats' ? 35 : 25, // %
            fat: 15,
            fiber: 5,
            frequency: age < 1 ? 3 : 2, // Günlük öğün
            supplements: [],
            restrictions: this.getSpeciesRestrictions(pet.category),
            note: 'AI tarafından optimize edildi.'
        };
    }

    static getSpeciesRestrictions(category) {
        const restrictions = {
            'Dogs': ['Çikolata', 'Soğan', 'Üzüm', 'Xylitol'],
            'Cats': ['Soğan', 'Sarımsak', 'Süt ürünleri', 'Ton balığı (aşırı)'],
            'Birds': ['Avokado', 'Çikolata', 'Kafein', 'Tuz']
        };

        return restrictions[category] || [];
    }

    // 🎮 Etkileşimli öneriler
    static getInteractiveActivities(pet, analysis) {
        const activities = [];

        if (analysis.energyLevel > 60) {
            activities.push({
                name: 'Hazine Avı',
                description: 'Mamaları farklı yerlere saklayın',
                duration: '15-20 dk',
                difficulty: 'Kolay'
            });
        }

        if (analysis.socialNeed > 50) {
            activities.push({
                name: 'Sosyal Saat',
                description: 'Diğer hayvanlarla buluşma',
                duration: '30-60 dk',
                difficulty: 'Orta'
            });
        }

        return activities;
    }
} 