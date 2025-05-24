// 🎯 AI Pet Detection API Configuration
// Bu dosyada API anahtarlarınızı yönetin

const API_CONFIG = {
    // Google Vision API - En doğru sistem (%95+ başarı)
    GOOGLE_VISION: {
        API_KEY: 'AIzaSyA0oR5aDVQNyDU7xrnuVDKvzEk4ksvOTw8', // ✅ Google Vision API Key aktif
        ENDPOINT: 'https://vision.googleapis.com/v1/images:annotate',
        FEATURES: [
            { type: 'LABEL_DETECTION', maxResults: 50 },
            { type: 'OBJECT_LOCALIZATION', maxResults: 20 },
            { type: 'IMAGE_PROPERTIES' }
        ]
    },

    // Microsoft Azure Computer Vision - Yedek sistem
    AZURE_VISION: {
        API_KEY: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Buraya Azure API key'inizi girin
        ENDPOINT: 'https://your-resource-name.cognitiveservices.azure.com/', // Buraya Azure endpoint'inizi girin
        API_VERSION: 'v3.2',
        FEATURES: 'Categories,Tags,Objects,Color'
    },

    // Clarifai Pet Breed Model - Alternatif sistem
    CLARIFAI: {
        API_KEY: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Buraya Clarifai API key'inizi girin
        MODEL_ID: 'general-image-recognition',
        PET_MODEL_ID: 'bd367be194cf45149e75f01d59f77ba7' // Pet breed detection model
    },

    // DeepAI Animal Detection - Ek sistem
    DEEPAI: {
        API_KEY: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Buraya DeepAI API key'inizi girin
        ENDPOINT: 'https://api.deepai.org/api/animal-recognition'
    }
};

// API Key doğrulama fonksiyonu
export const validateApiKeys = () => {
    const validation = {
        google: API_CONFIG.GOOGLE_VISION.API_KEY !== 'AIzaSyA0oR5aDVQNyDU7xrnuVDKvzEk4ksvOTw8',
        azure: API_CONFIG.AZURE_VISION.API_KEY !== 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        clarifai: API_CONFIG.CLARIFAI.API_KEY !== 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        deepai: API_CONFIG.DEEPAI.API_KEY !== 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    };

    const validKeys = Object.values(validation).filter(Boolean).length;

    console.log('🔑 API Key Durumu:');
    console.log(`✅ Geçerli: ${validKeys}/4`);
    console.log(`❌ Eksik: ${4 - validKeys}/4`);

    if (validKeys === 0) {
        console.warn('⚠️ Hiç API key tanımlı değil! Local Intelligence kullanılacak.');
    }

    return validation;
};

// Hangi API'lerin kullanılabilir olduğunu kontrol et
export const getAvailableApis = () => {
    const validation = validateApiKeys();
    const available = [];

    if (validation.google) available.push('Google Vision');
    if (validation.azure) available.push('Azure Vision');
    if (validation.clarifai) available.push('Clarifai');
    if (validation.deepai) available.push('DeepAI');

    if (available.length === 0) {
        available.push('Advanced Local Intelligence');
    }

    return available;
};

export default API_CONFIG;

// ===========================================
// 📋 ADIM ADIM API KEY ALMA REHBERİ:
// ===========================================

/*
🔥 GOOGLE VISION API (ÖNERİLEN - EN DOĞRU):
1. https://console.cloud.google.com/ adresine gidin
2. Yeni proje oluşturun: "pet-detection-app" 
3. Sol menüden "APIs & Services" > "Library" seçin
4. "Cloud Vision API" arayın ve "ENABLE" yapın
5. "APIs & Services" > "Credentials" bölümüne gidin
6. "CREATE CREDENTIALS" > "API key" seçin
7. Oluşan API key'i kopyalayın (AIzaSy ile başlar)
8. Yukarıdaki GOOGLE_VISION.API_KEY kısmına yapıştırın
💰 Ücret: $1.50/1000 istek (aylık 1000 ücretsiz)

⚠️ ÖNEMLİ GÜVENLİK NOTU:
- API key'inizi GitHub'a yüklemeyin!
- .env dosyasını .gitignore'a ekleyin
- Production'da Environment Variables kullanın

📱 TESTiNG:
API key'inizi ekledikten sonra:
1. Uygulamayı yeniden başlatın: npx expo start
2. Add New Pet sayfasına gidin
3. Bir pet fotoğrafı seçin
4. "🎯 Pet AI" butonuna basın
5. Sonuçları kontrol edin

🎯 ÖRNEK BAŞARILI API KEY:
API_KEY: 'AIzaSyC7X3mY9kL2pN4qR8sT1uV6wF7gH0jI9kL'
(Gerçek key'iniz 39 karakter uzunluğunda olacak)

🔷 MICROSOFT AZURE VISION (İSTEĞE BAĞLI):
1. https://portal.azure.com/ adresine gidin
2. "Create a resource" > "Computer Vision" seçin
3. Resource oluşturduktan sonra "Keys and Endpoint" bölümüne gidin
4. Key1 ve Endpoint bilgilerini kopyalayın
5. Yukarıdaki AZURE_VISION kısmına yapıştırın
💰 Ücret: $1.00/1000 istek (aylık 5000 ücretsiz)

🎯 CLARIFAI PET BREEDS (İSTEĞE BAĞLI):
1. https://clarifai.com/ adresine gidin ve hesap oluşturun
2. "Create Application" yapın
3. "API Keys" bölümünden key alın
4. Pet breed modelini kullanın
💰 Ücret: $20/10000 istek (aylık 5000 ücretsiz)

🤖 DEEPAI ANIMAL DETECTION (İSTEĞE BAĞLI):
1. https://deepai.org/ adresine gidin
2. Hesap oluşturun ve email doğrulayın
3. Dashboard'dan API key alın
4. Animal Recognition API'yi kullanın
💰 Ücret: $5/1000 istek (günlük 5 ücretsiz)

⚡ HIZLI BAŞLANGÇ:
En az Google Vision API key'ini alarak başlayın.
Diğerleri yedek olarak çalışacak.
Hiçbiri yoksa Advanced Local Intelligence devreye girer.

🎮 TEST FOTOĞRAFI ÖNERİLERİ:
- Golden Retriever fotoğrafı -> Çok doğru sonuç
- Kedi fotoğrafı -> Persian/Siamese detection
- Karışık cins köpek -> Mixed Breed detection
*/ 