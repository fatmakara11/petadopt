# PetAdoptMe Web

Bu proje, PetAdoptMeApp mobil uygulamasının React'ta geliştirilmiş web versiyonudur. Mobil uygulama ile aynı Firebase veritabanı ve Clerk kullanıcı yönetim sistemini kullanır, böylece her iki platformda yapılan değişiklikler anlık olarak diğerine yansır.

## Özellikler

- Clerk ile kullanıcı kimlik doğrulama sistemi (kayıt, giriş, profil)
- Firebase Firestore ile veritabanı entegrasyonu
- Firebase Storage ile dosya depolama
- Evcil hayvan görüntüleme, arama ve filtreleme
- Favorilere ekleme/çıkarma
- Yeni evcil hayvan ekleme
- Mobil uygulamayla tam uyumlu çalışma

## Teknolojiler

- React
- Firebase (Firestore, Storage)
- Clerk (Kullanıcı Yönetimi)
- React Router DOM
- CSS

## Kurulum

1. Repo'yu klonlayın:
```
git clone https://github.com/yourusername/petadopt.git
cd petadopt/PetAdoptMeweb
```

2. Bağımlılıkları yükleyin:
```
npm install
```

3. `.env` dosyası oluşturun ve gerekli bilgileri ekleyin:
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

4. Projeyi başlatın:
```
npm start
```

## Mobil ve Web Senkronizasyonu

PetAdoptMe Web ve PetAdoptMeApp mobil uygulaması aynı Firebase veritabanını kullanır. Bu sayede:

- Bir platformda eklenen evcil hayvanlar diğer platformda da görüntülenebilir
- Favorilere eklenen hayvanlar her iki platformda da senkronize kalır
- Kullanıcı bilgileri ve oturum durumu ortak olarak yönetilir

## Lisans

MIT 