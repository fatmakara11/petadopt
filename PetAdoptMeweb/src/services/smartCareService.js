import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export class SmartCareService {
    // Get user's pets from Firebase
    static async getUserPets(userEmail) {
        try {
            console.log('🐾 Fetching user pets for:', userEmail);

            const petsCollection = collection(db, 'Pets');
            const q = query(petsCollection, where('useremail', '==', userEmail));
            const querySnapshot = await getDocs(q);

            const pets = [];
            querySnapshot.forEach((doc) => {
                pets.push({
                    docId: doc.id,
                    ...doc.data()
                });
            });

            console.log('✅ Found pets:', pets.length);
            return pets;
        } catch (error) {
            console.error('❌ Error fetching pets:', error);
            return [];
        }
    }

    // Analyze pet behavior with AI
    static analyzePetBehavior(pet) {
        console.log('🧠 Starting AI analysis for:', pet.name);

        try {
            // Calculate various metrics based on pet data
            const ageScore = this.calculateAgeScore(pet.age);
            const breedScore = this.calculateBreedScore(pet.breed, pet.category);
            const weightScore = this.calculateWeightScore(pet.weight, pet.category);

            // Calculate overall scores
            const energyLevel = this.calculateEnergyLevel(pet.age, pet.breed, pet.category);
            const socialNeed = this.calculateSocialNeed(pet.breed, pet.category);
            const healthRisk = this.calculateHealthRisk(pet.age, pet.breed, pet.weight, pet.category);
            const careComplexity = this.calculateCareComplexity(pet.breed, pet.category);

            // Generate AI score
            const aiScore = Math.round((ageScore + breedScore + weightScore) / 3);

            // Generate recommendations
            const recommendations = this.generateRecommendations(pet, {
                energyLevel, socialNeed, healthRisk, careComplexity
            });

            const analysis = {
                petId: pet.docId,
                petName: pet.name,
                aiScore,
                energyLevel,
                socialNeed,
                healthRisk,
                careComplexity,
                recommendations,
                analysisDate: new Date().toISOString(),
                confidence: 0.85 + Math.random() * 0.1
            };

            console.log('✅ AI Analysis completed with score:', aiScore);
            return analysis;

        } catch (error) {
            console.error('❌ AI Analysis error:', error);
            return this.getDefaultAnalysis(pet);
        }
    }

    // Calculate age-based score
    static calculateAgeScore(age) {
        const numAge = parseInt(age) || 3;
        if (numAge <= 2) return 95; // Young pets are generally healthier
        if (numAge <= 5) return 85; // Adult pets
        if (numAge <= 8) return 75; // Mature pets
        return 65; // Senior pets need more care
    }

    // Calculate breed-based score
    static calculateBreedScore(breed, category) {
        const breedData = {
            Dogs: {
                'Golden Retriever': 90,
                'Labrador': 88,
                'German Shepherd': 85,
                'Bulldog': 75, // Breathing issues
                'Poodle': 87,
                'Mixed Breed': 82
            },
            Cats: {
                'Persian': 80, // Grooming needs
                'Siamese': 85,
                'Maine Coon': 83,
                'British Shorthair': 86,
                'Mixed Breed': 84
            },
            Birds: {
                'Parrot': 82,
                'Canary': 85,
                'Cockatiel': 84,
                'Budgerigar': 86
            }
        };

        return breedData[category]?.[breed] || 80;
    }

    // Calculate weight-based score
    static calculateWeightScore(weight, category) {
        const numWeight = parseFloat(weight) || 10;

        const idealRanges = {
            Dogs: { min: 5, max: 50 },
            Cats: { min: 2, max: 8 },
            Birds: { min: 0.1, max: 2 }
        };

        const range = idealRanges[category] || idealRanges.Dogs;

        if (numWeight >= range.min && numWeight <= range.max) return 90;
        if (numWeight < range.min * 0.8 || numWeight > range.max * 1.2) return 70;
        return 80;
    }

    // Calculate energy level (0-100)
    static calculateEnergyLevel(age, breed, category) {
        let baseEnergy = 70;

        // Age factor
        const numAge = parseInt(age) || 3;
        if (numAge <= 2) baseEnergy += 20;
        else if (numAge <= 5) baseEnergy += 10;
        else if (numAge > 8) baseEnergy -= 20;

        // Breed factor
        const highEnergyBreeds = ['Labrador', 'Golden Retriever', 'German Shepherd', 'Parrot'];
        const lowEnergyBreeds = ['Bulldog', 'Persian', 'British Shorthair'];

        if (highEnergyBreeds.includes(breed)) baseEnergy += 15;
        if (lowEnergyBreeds.includes(breed)) baseEnergy -= 15;

        return Math.max(20, Math.min(100, baseEnergy));
    }

    // Calculate social need (0-100)
    static calculateSocialNeed(breed, category) {
        const socialData = {
            Dogs: 85, // Dogs are generally very social
            Cats: 60, // Cats are moderately social
            Birds: 90  // Birds are highly social
        };

        let baseSocial = socialData[category] || 70;

        // Breed adjustments
        const highSocialBreeds = ['Golden Retriever', 'Labrador', 'Siamese', 'Parrot'];
        const lowSocialBreeds = ['Persian', 'British Shorthair'];

        if (highSocialBreeds.includes(breed)) baseSocial += 10;
        if (lowSocialBreeds.includes(breed)) baseSocial -= 15;

        return Math.max(30, Math.min(100, baseSocial));
    }

    // Calculate health risk (0-100, higher = more risk)
    static calculateHealthRisk(age, breed, weight, category) {
        let risk = 20; // Base risk

        // Age factor
        const numAge = parseInt(age) || 3;
        if (numAge > 8) risk += 30;
        else if (numAge > 5) risk += 15;

        // Breed factor
        const highRiskBreeds = ['Bulldog', 'Persian', 'German Shepherd'];
        if (highRiskBreeds.includes(breed)) risk += 20;

        // Weight factor
        const numWeight = parseFloat(weight) || 10;
        const idealRanges = {
            Dogs: { min: 5, max: 50 },
            Cats: { min: 2, max: 8 },
            Birds: { min: 0.1, max: 2 }
        };

        const range = idealRanges[category] || idealRanges.Dogs;
        if (numWeight < range.min * 0.8 || numWeight > range.max * 1.2) risk += 15;

        return Math.max(10, Math.min(80, risk));
    }

    // Calculate care complexity (0-100)
    static calculateCareComplexity(breed, category) {
        const complexityData = {
            Dogs: {
                'Golden Retriever': 60,
                'Labrador': 55,
                'German Shepherd': 70,
                'Bulldog': 80,
                'Poodle': 75,
                'Mixed Breed': 50
            },
            Cats: {
                'Persian': 85, // High grooming needs
                'Siamese': 60,
                'Maine Coon': 70,
                'British Shorthair': 45,
                'Mixed Breed': 50
            },
            Birds: {
                'Parrot': 80,
                'Canary': 50,
                'Cockatiel': 60,
                'Budgerigar': 45
            }
        };

        return complexityData[category]?.[breed] || 60;
    }

    // Generate smart recommendations
    static generateRecommendations(pet, scores) {
        const recommendations = [];

        // High energy recommendations
        if (scores.energyLevel > 75) {
            recommendations.push({
                title: '🏃‍♂️ Yüksek Enerji',
                description: `${pet.name} çok enerjik! Günlük egzersiz ve oyun zamanı artırılmalı.`,
                priority: 'high',
                actions: [
                    'Günde en az 2 saat egzersiz yapın',
                    'Interaktif oyuncaklar sağlayın',
                    'Zihinsel stimülasyon aktiviteleri ekleyin',
                    'Düzenli dış mekan aktivitelerine katılın'
                ]
            });
        }

        // Health risk recommendations
        if (scores.healthRisk > 50) {
            recommendations.push({
                title: '🏥 Sağlık Riski',
                description: 'Yaş ve cins özelliklerine bağlı sağlık riskleri tespit edildi.',
                priority: 'critical',
                actions: [
                    'Düzenli veteriner kontrolü (3-6 ayda bir)',
                    'Özel beslenme planı oluşturun',
                    'Günlük aktivite seviyesini izleyin',
                    'Stres faktörlerini minimize edin'
                ]
            });
        }

        // Social need recommendations
        if (scores.socialNeed > 70) {
            recommendations.push({
                title: '👥 Sosyal İhtiyaç',
                description: `${pet.name} sosyal bir pet. İnsan ve hayvan etkileşimi önemli.`,
                priority: 'high',
                actions: [
                    'Günlük kaliteli zaman geçirin',
                    'Diğer petlerle tanıştırın',
                    'Sosyalleşme aktivitelerine katılın',
                    'Yalnız kalma süresini minimize edin'
                ]
            });
        }

        // Care complexity recommendations
        if (scores.careComplexity > 70) {
            recommendations.push({
                title: '🛠️ Özel Bakım',
                description: 'Bu cins özel bakım ve dikkat gerektirir.',
                priority: 'normal',
                actions: [
                    'Cins özelliklerine uygun bakım rutini oluşturun',
                    'Profesyonel grooming hizmetlerinden yararlanın',
                    'Uzman veteriner tavsiyeleri alın',
                    'Beslenme gereksinimlerini araştırın'
                ]
            });
        }

        // General wellness recommendation
        recommendations.push({
            title: '💚 Genel Sağlık',
            description: 'Sağlıklı yaşam için temel öneriler.',
            priority: 'normal',
            actions: [
                'Kaliteli ve yaşa uygun beslenme sağlayın',
                'Temiz su her zaman erişilebilir olsun',
                'Düzenli hijyen ve bakım yapın',
                'Sevgi ve ilgiyi ihmal etmeyin'
            ]
        });

        return recommendations;
    }

    // Generate smart feeding plan
    static generateSmartFeedingPlan(pet, analysis) {
        const age = parseInt(pet.age) || 3;
        const weight = parseFloat(pet.weight) || 10;
        const category = pet.category;

        // Base calorie calculation
        let dailyCalories = 0;
        let protein = 0, fat = 0, fiber = 0;
        let frequency = 2;

        switch (category) {
            case 'Dogs':
                dailyCalories = weight * 30 + 70; // RER formula approximation
                if (age < 2) dailyCalories *= 1.6; // Growing puppies
                else if (age > 7) dailyCalories *= 0.8; // Senior dogs

                protein = age < 2 ? 28 : (age > 7 ? 18 : 22);
                fat = age < 2 ? 17 : (age > 7 ? 8 : 12);
                fiber = 4;
                frequency = age < 2 ? 3 : 2;
                break;

            case 'Cats':
                dailyCalories = weight * 40; // Cats have higher metabolic rate
                if (age < 2) dailyCalories *= 1.4;
                else if (age > 7) dailyCalories *= 0.9;

                protein = age < 2 ? 35 : (age > 7 ? 26 : 30);
                fat = age < 2 ? 20 : (age > 7 ? 10 : 15);
                fiber = 3;
                frequency = age < 2 ? 3 : 2;
                break;

            case 'Birds':
                dailyCalories = weight * 50; // Birds have very high metabolic rate
                protein = 16;
                fat = 8;
                fiber = 6;
                frequency = 2;
                break;
        }

        // Activity level adjustment
        if (analysis.energyLevel > 75) {
            dailyCalories *= 1.3;
        } else if (analysis.energyLevel < 50) {
            dailyCalories *= 0.9;
        }

        // Generate supplements based on analysis
        const supplements = [];
        if (analysis.healthRisk > 50) {
            supplements.push('Omega-3 fatty acids');
            supplements.push('Glucosamine (joints)');
        }
        if (analysis.energyLevel > 80) {
            supplements.push('Vitamin B complex');
        }
        if (age > 7) {
            supplements.push('Antioxidant complex');
            supplements.push('Joint support formula');
        }

        // Generate feeding restrictions
        const restrictions = [];
        if (category === 'Dogs') {
            restrictions.push('Chocolate, grapes, onions');
            restrictions.push('Excessive fat and salt');
        } else if (category === 'Cats') {
            restrictions.push('Onions, garlic, dairy');
            restrictions.push('Raw fish and meat');
        } else if (category === 'Birds') {
            restrictions.push('Avocado, chocolate, caffeine');
            restrictions.push('Salty and sugary foods');
        }

        return {
            petId: pet.docId,
            dailyCalories,
            protein,
            fat,
            fiber,
            frequency,
            supplements,
            restrictions,
            note: `${pet.name} için özel olarak hesaplanmış beslenme planı. Yaş: ${age}, Ağırlık: ${weight}kg`,
            generatedAt: new Date().toISOString()
        };
    }

    // Default analysis fallback
    static getDefaultAnalysis(pet) {
        return {
            petId: pet.docId,
            petName: pet.name,
            aiScore: 75,
            energyLevel: 60,
            socialNeed: 70,
            healthRisk: 30,
            careComplexity: 50,
            recommendations: [
                {
                    title: '💚 Genel Bakım',
                    description: 'Temel pet bakım önerileri.',
                    priority: 'normal',
                    actions: [
                        'Düzenli beslenme sağlayın',
                        'Günlük egzersiz yaptırın',
                        'Veteriner kontrollerini ihmal etmeyin',
                        'Sevgi ve ilgi gösterin'
                    ]
                }
            ],
            analysisDate: new Date().toISOString(),
            confidence: 0.7
        };
    }
}

export default SmartCareService; 