# Next.js VoIP UI Starter

Starter UI untuk project Integrasi Aplikasi Web dengan VoIP Kamailio.

## Fitur
- Login page
- Dashboard
- Dial Pad
- Mock realtime call status: Idle, Calling, Ringing, In Call, Call Ended
- Call Log table
- About page
- Global CSS dengan palette:
  - Navy `#091F58`
  - Blue `#6F96D1`
  - Light `#EDF0F5`
  - White `#FFFFFF`

## Cara jalanin

```bash
npm install
npm run dev
```

Buka:

```txt
http://localhost:3000/login
```

## Next step
- Setup Supabase schema
- Connect login ke tabel users
- Connect call log ke tabel call_logs
- Integrasi SIP.js / JsSIP ke Kamailio
