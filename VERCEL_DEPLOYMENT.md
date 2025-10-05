# Panduan Deployment FHEScore ke Vercel

## Persiapan Sebelum Deployment

### 1. Pastikan Proyek Siap
```bash
# Pastikan dependencies terinstall
cd frontend
npm install

# Test build lokal
npm run build
```

### 2. Push ke Git Repository
```bash
# Pastikan semua perubahan sudah di-commit
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Langkah-langkah Deployment

### 1. Setup Akun Vercel
1. Kunjungi [vercel.com](https://vercel.com)
2. Sign up/login dengan GitHub account
3. Connect repository GitHub Anda

### 2. Import Project ke Vercel
1. Klik "New Project" di dashboard Vercel
2. Pilih repository FHEScore dari GitHub
3. Vercel akan otomatis mendeteksi framework React

### 3. Konfigurasi Project Settings
```
Framework Preset: Other
Build Command: cd frontend && npm run build
Output Directory: frontend/build
Install Command: cd frontend && npm install
Root Directory: ./
```

### 4. Setup Environment Variables
Di Vercel dashboard, tambahkan environment variables berikut:

**Required Variables:**
```
REACT_APP_CONTRACT_ADDRESS=0x2AD6b1239184aB5132A5A1EcB7EBDE3f111F4019
REACT_APP_NETWORK_ID=11155111
REACT_APP_APP_NAME=FHEScore
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
```

**Optional Variables (jika diperlukan):**
```
REACT_APP_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
REACT_APP_FHEVM_NETWORK_URL=https://devnet.zama.ai
```

### 5. Deploy
1. Klik "Deploy" button
2. Tunggu proses build selesai (biasanya 2-5 menit)
3. Vercel akan memberikan URL production

## Konfigurasi Domain (Opsional)

### Custom Domain
1. Beli domain dari provider (Namecheap, GoDaddy, dll)
2. Di Vercel dashboard → Settings → Domains
3. Tambahkan custom domain
4. Update DNS records sesuai instruksi Vercel

## Troubleshooting

### Build Errors
```bash
# Jika ada error Node.js version
# Pastikan menggunakan Node.js 18.x di vercel.json

# Jika ada error dependencies
# Hapus node_modules dan package-lock.json, lalu install ulang
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install
```

### Environment Variables Issues
- Pastikan semua REACT_APP_ variables sudah diset
- Restart deployment setelah menambah env vars
- Check browser console untuk error

### Routing Issues (SPA)
File `vercel.json` sudah dikonfigurasi untuk handle SPA routing.
Jika masih ada masalah, pastikan routes configuration benar.

## Monitoring dan Maintenance

### Analytics
- Enable Vercel Analytics di dashboard
- Monitor performance dan usage

### Automatic Deployments
- Setiap push ke branch main akan trigger deployment otomatis
- Preview deployments untuk pull requests

### Rollback
- Jika ada masalah, bisa rollback ke deployment sebelumnya
- Di dashboard Vercel → Deployments → pilih versi sebelumnya

## Security Best Practices

1. **Environment Variables:**
   - Jangan commit file .env ke repository
   - Gunakan Vercel dashboard untuk sensitive data

2. **Dependencies:**
   - Regularly update dependencies
   - Run `npm audit` untuk check vulnerabilities

3. **HTTPS:**
   - Vercel otomatis provide HTTPS
   - Pastikan semua API calls menggunakan HTTPS

## Performance Optimization

1. **Build Optimization:**
   - `GENERATE_SOURCEMAP=false` untuk production
   - Enable compression di Vercel

2. **Caching:**
   - Vercel otomatis handle static asset caching
   - Configure cache headers jika diperlukan

## Support dan Resources

- [Vercel Documentation](https://vercel.com/docs)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [CRACO Documentation](https://craco.js.org/)

---

**Note:** Pastikan contract sudah di-deploy ke network yang benar sebelum deployment frontend.