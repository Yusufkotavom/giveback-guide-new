# 📊 Products Table Schema & CSV Upload Guide

## 🗂️ Table Structure Overview

Tabel **Products** dirancang khusus untuk marketplace Indonesia dengan integrasi platform e-commerce lokal. Berikut adalah struktur lengkap tabel beserta penjelasan setiap kolom:

## 📋 Column Definitions

| Column Name | Data Type | Required | Description | Example |
|-------------|-----------|----------|-------------|---------|
| `pTitle` | String | ✅ | Judul/nama produk utama | "Batik Tulis Premium Jogja" |
| `pCountry` | Multi-Select | ✅ | Negara asal produk | "Indonesia" |
| `pLocale` | Multi-Select | ✅ | Kota/daerah asal produk | "Yogyakarta" |
| `pCategory` | Multi-Select | ✅ | Kategori produk | "Fashion;Kerajinan" |
| `pFeatures` | Multi-Select | ⚪ | Fitur/keunggulan produk | "Handmade;Motif Tradisional" |
| `pName` | Rich Text | ✅ | Nama toko/brand | "Batik Sari Indah" |
| `pType` | Multi-Select | ✅ | Jenis/tipe produk | "Pakaian Tradisional" |
| `pSlug` | Rich Text | ✅ | URL slug (unique identifier) | "batik-tulis-premium-jogja" |
| `pURL` | URL | ⚪ | Website resmi produk | "https://batiksariindah.com" |
| `pOtherURL` | URL | ⚪ | Link alternatif (sosmed, dll) | "https://instagram.com/batiksariindah" |
| `pTokopediaURL` | URL | ⚪ | Link produk di Tokopedia | "https://tokopedia.com/store/product" |
| `pShopeeURL` | URL | ⚪ | Link produk di Shopee | "https://shopee.co.id/product" |
| `pBlibliURL` | URL | ⚪ | Link produk di Blibli | "https://blibli.com/p/product" |
| `pBukalapakURL` | URL | ⚪ | Link produk di Bukalapak | "https://bukalapak.com/p/product" |
| `pLazadaURL` | URL | ⚪ | Link produk di Lazada | "https://lazada.co.id/products/product" |
| `pMapsURL` | URL | ⚪ | Link Google Maps lokasi toko | "https://goo.gl/maps/abc123" |
| `pVerify` | Select | ⚪ | Status verifikasi produk | "Terverifikasi" |
| `pImageURL1` | URL | ✅ | URL gambar utama produk | "https://images.unsplash.com/image1.jpg" |
| `pImageURL2` | URL | ⚪ | URL gambar kedua | "https://images.unsplash.com/image2.jpg" |
| `pImageURL3` | URL | ⚪ | URL gambar ketiga | "https://images.unsplash.com/image3.jpg" |
| `pPublished` | Date | ✅ | Tanggal publikasi | "15/01/2024" |
| `pReview` | Rich Text | ⚪ | Review/testimoni produk | "Produk berkualitas tinggi..." |

## 🎯 Indonesian Marketplace Integration

### Platform E-commerce yang Didukung:

| Platform | Color Theme | URL Format | Status |
|----------|-------------|------------|---------|
| **Tokopedia** | 🟢 Green | `tokopedia.com/store/product` | Primary |
| **Shopee** | 🟠 Orange | `shopee.co.id/product-i.itemid` | Primary |
| **Blibli** | 🔵 Blue | `blibli.com/p/product-name` | Secondary |
| **Bukalapak** | 🔴 Red | `bukalapak.com/p/category/product` | Secondary |
| **Lazada** | 🟣 Purple | `lazada.co.id/products/product-name` | Secondary |

## 📁 CSV Upload Format

### Header Row (Wajib):
```csv
pTitle,pCountry,pLocale,pCategory,pFeatures,pName,pType,pSlug,pURL,pOtherURL,pTokopediaURL,pShopeeURL,pBlibliURL,pBukalapakURL,pLazadaURL,pMapsURL,pVerify,pImageURL1,pImageURL2,pImageURL3,pPublished,pReview
```

### Multi-Select Fields Format:
Gunakan semicolon (`;`) untuk memisahkan multiple values:
- `pCategory`: "Fashion;Kerajinan;Tradisional"
- `pFeatures`: "Handmade;Eco-Friendly;Premium Quality"

### Date Format:
- Format: `DD/MM/YYYY`
- Contoh: `15/01/2024` untuk 15 Januari 2024

### Text Fields with Quotes:
Gunakan double quotes untuk text yang mengandung koma:
```csv
pReview,"Produk ini sangat berkualitas, cocok untuk hadiah, dan harga terjangkau."
```

## 🔍 Field Validation Rules

### Required Fields (Wajib Diisi):
- ✅ `pTitle` - Tidak boleh kosong
- ✅ `pCountry` - Minimal 1 negara
- ✅ `pLocale` - Minimal 1 lokasi
- ✅ `pCategory` - Minimal 1 kategori
- ✅ `pName` - Nama toko/brand
- ✅ `pType` - Jenis produk
- ✅ `pSlug` - Harus unique, lowercase, gunakan dash
- ✅ `pImageURL1` - URL gambar valid
- ✅ `pPublished` - Format tanggal valid

### URL Validation:
- Semua URL field harus menggunakan `https://`
- Domain harus valid dan accessible
- Marketplace URLs harus sesuai format masing-masing platform

### Slug Rules:
- Hanya lowercase letters, numbers, dan dash (-)
- Tidak boleh dimulai atau diakhiri dengan dash
- Harus unique untuk setiap produk
- Contoh: `batik-tulis-premium-jogja`

## 📊 Sample Data Categories

### Kategori Produk Populer:
- **Fashion**: Batik, Songket, Tas, Aksesoris
- **Makanan & Minuman**: Kopi, Sambal, Dodol, Rendang
- **Kerajinan**: Anyaman, Ukiran, Pottery, Tenun
- **Dekorasi**: Furniture, Art, Ornamen
- **Kesehatan & Kecantikan**: Jamu, Kosmetik Natural
- **Elektronik**: Gadget, Aksesoris Tech

### Contoh pFeatures:
- **Kualitas**: "Premium Quality", "Handmade", "Limited Edition"
- **Bahan**: "Organic", "Eco-Friendly", "Natural Materials"
- **Sertifikasi**: "Halal", "Fair Trade", "ISO Certified"
- **Kemasan**: "Gift Box", "Vacuum Sealed", "Eco Packaging"

## 🚀 Upload Process

### Langkah-langkah Upload CSV:

1. **Persiapan File**
   - Pastikan encoding UTF-8
   - Gunakan comma (,) sebagai delimiter
   - Header row harus sesuai format

2. **Validasi Data**
   - Cek required fields
   - Validasi format URL dan tanggal
   - Pastikan slug unique

3. **Upload ke Notion Database**
   - Gunakan Notion API atau import manual
   - Set status "Published" untuk produk aktif

4. **Verifikasi**
   - Cek tampilan di website
   - Test semua marketplace links
   - Validasi gambar loading correctly

## ⚠️ Common Issues & Solutions

### Masalah Umum:
1. **Slug Duplicate**: Gunakan suffix numerik (-1, -2, dst)
2. **URL Invalid**: Pastikan https:// dan domain valid
3. **Image Not Loading**: Cek URL accessibility dan format
4. **Date Format Error**: Gunakan DD/MM/YYYY format
5. **Multi-select Parse Error**: Gunakan semicolon separator

### Tips Optimasi:
- Gunakan gambar berkualitas tinggi (min 800px width)
- Optimasi slug untuk SEO
- Lengkapi semua marketplace links untuk visibility maksimal
- Tulis review yang engaging dan informatif

## 📈 Analytics & Tracking

Setiap produk akan otomatis mendapat:
- **Page Views Tracking**
- **Marketplace Click Tracking**
- **Search Performance Metrics**
- **Conversion Analytics**

Data ini berguna untuk mengoptimalkan performa produk dan meningkatkan penjualan di marketplace Indonesia.

---

**Note**: Schema ini dirancang khusus untuk marketplace Indonesia dengan fokus pada produk lokal dan UMKM. Semua integrasi marketplace menggunakan platform populer di Indonesia untuk memaksimalkan reach dan konversi.