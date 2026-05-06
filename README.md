# Kamailio WebRTC SIP Server with Azure VM

## 📌 Project Name

**Kamailio WebRTC SIP Server on Azure VM**

---

# 📖 Project Description

Project ini adalah implementasi **SIP Server berbasis Kamailio** yang berjalan pada **Microsoft Azure Virtual Machine** dan mendukung komunikasi **VoIP/WebRTC** melalui protokol:

- SIP UDP
- SIP TCP
- WebSocket (WS)

Server digunakan untuk:

- Registrasi user SIP
- Login/authentication SIP
- Routing panggilan VoIP
- Koneksi WebRTC dari browser/web application
- Integrasi dengan frontend SIP client seperti:
  - SIP.js
  - JsSIP
  - WebRTC Browser App

---

# 🎯 Main Features

## ✅ SIP Registration

User dapat login/register ke server SIP menggunakan username & password.

---

## ✅ SIP Call Routing

Server mampu melakukan routing panggilan antar user SIP.

---

## ✅ WebSocket Support

Kamailio mendukung komunikasi WebRTC melalui:

```text
ws://IP_SERVER:8080/ws
```

---

## ✅ MySQL Authentication

Autentikasi user menggunakan database MySQL/MariaDB.

---

## ✅ Azure Cloud Deployment

Server berjalan secara online menggunakan Azure VM sehingga dapat diakses dari internet.

---

# 🧱 System Architecture

```text
Frontend WebRTC Client
        │
        │  WebSocket (WS)
        ▼
Kamailio SIP Server (Azure VM)
        │
        │ SIP UDP/TCP
        ▼
   SIP Users / Softphone
```

---

# ⚙️ Technologies Used

| Component | Technology |
|---|---|
| SIP Server | Kamailio |
| Database | MySQL / MariaDB |
| Cloud Server | Microsoft Azure VM |
| OS | Ubuntu Server 24.04 |
| WebRTC | WebSocket |
| SIP Client | SIP.js / JsSIP |
| SSH Access | OpenSSH |

---

# 🌐 Network Ports

| Port | Protocol | Function |
|---|---|---|
| 22 | TCP | SSH Remote Access |
| 5060 | UDP | SIP Signaling |
| 5060 | TCP | SIP TCP |
| 8080 | TCP | WebSocket SIP |

---

# 📂 Project Structure

```text
project/
│
├── kamailio.cfg
├── README.md
├── database/
│   └── kamailio.sql
│
├── frontend/
│   └── sip-client/
│
└── docs/
```

---

# 🔐 Azure VM Configuration

## VM Specification

| Setting | Value |
|---|---|
| VM Provider | Microsoft Azure |
| OS | Ubuntu Server 24.04 |
| VM Size | Standard D2s v3 |
| Public IP | Dynamic |
| Authentication | SSH Key |

---

# 🛠️ Installation Guide

## 1. Create Azure VM

Buat VM Ubuntu di Azure:

- Ubuntu Server 24.04
- Open port:
  - 22
  - 5060 UDP
  - 8080 TCP

---

## 2. Connect to Azure VM

```bash
ssh -i kamailio-key.pem azureuser@YOUR_PUBLIC_IP
```

---

## 3. Update Ubuntu

```bash
sudo apt update
sudo apt upgrade -y
```

---

## 4. Install Kamailio

```bash
sudo apt install kamailio \
kamailio-mysql-modules \
kamailio-websocket-modules \
kamailio-extra-modules -y
```

---

## 5. Install MySQL / MariaDB

```bash
sudo apt install mariadb-server -y
```

---

## 6. Create Kamailio Database

Login MySQL:

```bash
sudo mysql
```

Create database:

```sql
CREATE DATABASE kamailio;

CREATE USER 'kamailio'@'localhost'
IDENTIFIED BY 'KamailioPass123!';

GRANT ALL PRIVILEGES ON kamailio.* TO 'kamailio'@'localhost';

FLUSH PRIVILEGES;
```

---

## 7. Configure Kamailio

Edit config:

```bash
sudo nano /etc/kamailio/kamailio.cfg
```

---

### Important Listen Ports

```cfg
listen=udp:0.0.0.0:5060
listen=tcp:0.0.0.0:5060
listen=tcp:0.0.0.0:8080
```

---

### Load Required Modules

```cfg
loadmodule "xhttp.so"
loadmodule "websocket.so"
loadmodule "db_mysql.so"
loadmodule "auth.so"
loadmodule "auth_db.so"
```

---

## 8. WebSocket Event Route

```cfg
event_route[xhttp:request] {

    if ($hdr(Upgrade)=~"websocket" && $rm=="GET") {
        if (ws_handle_handshake()) {
            exit;
        }
    }

    xhttp_reply("404", "Not Found", "text/plain", "Not Found");
}
```

---

## 9. Check Configuration

```bash
sudo kamailio -c -f /etc/kamailio/kamailio.cfg
```

Expected output:

```text
config file ok
```

---

## 10. Restart Kamailio

```bash
sudo systemctl restart kamailio
sudo systemctl status kamailio
```

---

## 11. Verify Listening Ports

```bash
sudo ss -tulnp | grep -E "5060|8080"
```

Expected:

```text
0.0.0.0:5060
0.0.0.0:8080
```

---

# 🌍 WebSocket Connection

Frontend configuration:

```javascript
server: "ws://YOUR_PUBLIC_IP:8080/ws"
```

Example:

```javascript
server: "ws://104.208.67.198:8080/ws"
```

---

# 🧪 Testing

## SIP Registration Test

Gunakan:

- Linphone
- Zoiper
- SIP.js
- JsSIP

---

## WebSocket Test

Coba akses:

```text
ws://YOUR_PUBLIC_IP:8080/ws
```

---

# 🔒 Security Notes

## Recommended

- Gunakan WSS (WebSocket Secure) untuk production
- Gunakan domain + SSL
- Batasi akses SSH
- Gunakan firewall/UFW
- Gunakan fail2ban

---

# 🚀 Future Improvements

- TLS/WSS Support
- TURN/STUN Server
- RTPProxy Integration
- SIP over TLS
- Docker Deployment
- Kubernetes Deployment
- Load Balancer
- Monitoring Dashboard

---

# 👨‍💻 Author

**Muhammad Rifki Widya Ramadhan**
**M Farras Mumtas**
**Naura Syawal Athallah Putri**
**Rayhan**

Project Kamailio VoIP WebRTC Deployment on Microsoft Azure VM.