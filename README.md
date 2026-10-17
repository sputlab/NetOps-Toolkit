# NetOps Toolkit

<p align="center">
  <img src="assets/icon.svg" alt="NetOps Toolkit Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Professional, offline-first network engineering &amp; IT operations toolkit.</strong><br>
  Subnet calculator, VLSM, IP tools, port lookup, bandwidth, physical media, Wi-Fi RF, and security utilities.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.4.2-00d4aa.svg?style=flat-square" alt="Version 2.4.2">
  <img src="https://img.shields.io/badge/PWA-Ready-0090ff.svg?style=flat-square" alt="PWA Ready">
  <img src="https://img.shields.io/badge/Offline-First-22c55e.svg?style=flat-square" alt="Offline First">
  <img src="https://img.shields.io/badge/Dependencies-Zero-a855f7.svg?style=flat-square" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/License-MIT-ff6b35.svg?style=flat-square" alt="MIT License">
</p>

---

## ⚡ Highlights

- **Zero Runtime Dependencies**: Pure HTML5, CSS3, and Vanilla JavaScript. Fast, lightweight, and completely portable.
- **Offline-First PWA**: Installable as a native desktop or mobile application. Functions 100% offline via Service Worker caching.
- **Bilingual (IT / EN)**: Native English and Italian language support with instant live switching that preserves state.
- **Dark Mode by Design**: High-contrast, terminal-inspired palette engineered for long operational sessions.
- **Deep Linking & Sharing**: Generates instant shareable query links for subnet calculations (`?ip=...&mask=...`).

---

## 🧰 Toolkit Modules

### 1. 🌐 Subnet / VLSM
- **Single Subnet Calculator**: Calculates network address, broadcast, wildcard mask, usable host range, CIDR, and RFC classification. Supports `/0` through `/32` as well as `/31` point-to-point links (RFC 3021).
- **Visual Subnetting (Split Network)**: Subdivide any parent network into smaller equal-sized blocks with instantaneous binary boundary calculation.
- **VLSM (Variable Length Subnet Mask)**: Dynamically sizes and arranges subnets based on required host counts in optimal descending order, checking base network capacity and boundary alignment.

### 2. 🔍 IP & IPv6 Tools
- **IPv6 Subnet & Prefix Calculator**: 128-bit BigInt calculations for IPv6 prefixes (`/0` to `/128`). Calculates start/end range, total `/64` subnets (e.g. 65,536 for `/48`), total addresses, Solicited-Node Multicast address (`ff02::1:ff...`), and divides parent prefixes into smaller subnets (`/56`, `/64`).
- **IPv6 Expansion & Compression (RFC 5952)**: Canonical RFC 5952 zero-compression, full 32-character expansion, reverse DNS PTR domain (`ip6.arpa`), and 128-bit binary representation.
- **IP Address Inspector**: Identifies address family (IPv4/IPv6), class (A/B/C/D/E), RFC status (RFC 1918 Private, APIPA link-local, loopback, multicast, public), integer representation, and binary/hex octets.
- **IP Representation Converter**: Instant conversion between Dotted Decimal, 32-bit Integer, Binary, and Hexadecimal.
- **Wildcard Mask Tools**: Bidirectional calculation between Subnet Mask, Wildcard Mask, and CIDR prefix.
- **ACL Range to Wildcard Decomposer**: Decomposes arbitrary start-to-end IP ranges into minimal matching wildcard mask blocks for firewall and router ACLs.
- **Subnet Comparison**: Determines whether two IP addresses reside within the same subnet under a given mask/CIDR.
- **Overlap Detector**: Analyzes a list of CIDR subnets to detect address space overlaps and routing conflicts.
- **CIDR Aggregator / Route Summarizer**: Collapses multiple subnet routes into optimal summary supernets.

### 3. 🔌 Ports & Protocols
- **Curated Database**: Over 260 standard network ports and protocols.
- **Category Filtering**: Instant filtering across Web, Mail, Remote, Database, DNS/DHCP, VoIP, Monitoring, Infrastructure, Security, Gaming, P2P, and Legacy.
- **Real-time Search**: Search by port number, acronym, or service description.

### 4. 📈 Bandwidth & Line Utilization
- **File Transfer Time Calculator**: Accurately estimates download/upload duration across configurable transfer speeds (from Mbps to 10+ Gbps) and file sizes (KB, MB, GB, TB).
- **Throughput & Link Utilization**: Real-time gauge calculating used vs. available bandwidth with warning and critical thresholds.
- **Data Unit Converter**: High-precision conversion across bits, bytes, KB, MB, GB, and TB.

### 5. 🔄 Converters, QoS & Encoders
- **QoS: DSCP ↔ ToS ↔ CoS (802.1p) Suite**: Bidirectional converter and visual 8-bit IP header inspector (`[6-bit DSCP | 2-bit ECN]`). Maps DSCP (0–63), ToS Byte (Hex/Dec), IP Precedence (0–7), 802.1p CoS (0–7), and Per-Hop Behavior (PHB). Includes a complete searchable reference table with quick filters for Voice/Video, Critical Data, Network Control, and Scavenger/Bulk.
- **Multi-Base Numeric Converter**: Bidirectional live conversion across Decimal, Binary, Hexadecimal, and Octal.
- **MAC Address Inspector**: Formats MAC addresses into IEEE colon (`AA:BB:CC:DD:EE:FF`), hyphenated (`AA-BB-CC-DD-EE-FF`), and Cisco (`AABB.CCDD.EEFF`) notations. Decodes OUI and identifies Multicast vs. Unicast and Universally vs. Locally Administered addresses.
- **Subnet Mask ↔ CIDR Converter**: Instant bi-directional translation.
- **Text Encoders**: Encodes raw text into Hexadecimal, Base64, and URL-encoded formats with one-click copy buttons.
- **Subnet Mask ↔ CIDR Converter**: Instant bi-directional translation.
- **Text Encoders**: Encodes raw text into Hexadecimal, Base64, and URL-encoded formats with one-click copy buttons.

### 6. 🧵 Cables, Physical Standards & Fiber
- **Ethernet Cable Standards**: Comparison of Cat 3 through Cat 8 (bandwidth, max speed, distance, shielding).
- **RJ-45 Pinout (T568A / T568B)**: Color-coded pin termination diagram with straight-through vs. crossover guidelines.
- **Optical Fiber Types**: Specifications for Single-Mode (OS1, OS2) and Multi-Mode (OM1–OM5) fiber.
- **Optical Attenuation & Link Budget**: Computes total link loss (fiber loss + connector loss + safety margins) to determine optical budget margin.

### 7. 📡 Wi-Fi & RF
- **Wi-Fi Standards**: Reference table spanning 802.11b up to Wi-Fi 7 (802.11be).
- **2.4 GHz Channel Overlap Diagram**: Visual spectrum map illustrating non-overlapping channels (1, 6, 11).
- **FSPL (Free Space Path Loss) Calculator**: Calculates path loss and estimated receiver RSSI based on frequency (2.4 GHz, 5 GHz, 6 GHz), distance, and transmitter EIRP.
- **RF Power Converter (dBm ↔ mW)**: Bidirectional converter with an RF signal quality assessment guide (VoIP threshold, excellent, weak).

### 8. 🔐 Security & Cryptography
- **Secure Password Generator**: Cryptographically secure random passwords using `crypto.getRandomValues()` with configurable character sets and length.
- **Password Strength & Entropy Analyzer**: Real-time password scoring and bit-entropy evaluation.
- **Hash Generator**: Generates cryptographic hashes (SHA-1, SHA-256, SHA-384, SHA-512) via the Web Cryptography API.

---

## 🚀 Getting Started

### Option 1: Direct File Usage (Portable)
No installation or server required. Simply download or clone the repository and double-click `index.html` in any modern web browser.

### Option 2: Local Web Server
To take advantage of Service Worker offline caching and PWA installation locally:

```bash
# Using Python
python3 -m http.server 8080

# Or using Node.js
npx serve .
```

Open `http://localhost:8080` in your browser.

### Option 3: Deploy to GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings** > **Pages** in your repository.
3. Under **Build and deployment**, select **GitHub Actions** (the included workflow in `.github/workflows/deploy.yml` deploys automatically) or select **Deploy from a branch** (`main` / root).
4. Your toolkit is now live at `https://<username>.github.io/<repo>/` with full PWA installation support!

---

## 📱 Progressive Web App (PWA)

NetOps Toolkit is fully configured as a Progressive Web App:
- **Desktop (Chrome / Edge / Safari)**: Click the **Install** icon in the browser address bar to install NetOps Toolkit as a standalone windowed desktop application.
- **iOS / iPadOS**: Open in Safari, tap the **Share** button, and select **Add to Home Screen**.
- **Android**: Tap the browser menu and select **Install App** or **Add to Home screen**.
- Once installed, the toolkit launches instantly and operates entirely offline without an active internet connection.

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Pages automated deployment workflow
│       └── release.yml         # Automated GitHub Release packager
├── .gitignore                  # Git ignore rules (OS, IDE, temporary files)
├── LICENSE                     # MIT License
├── README.md                   # Project documentation
├── index.html                  # Main application entry point (v2.4.2)
├── netops_toolkit_232.html     # Direct version release snapshot
├── manifest.json               # Web App Manifest for PWA installation
├── sw.js                       # Service Worker for offline caching & network fallback
├── assets/
│   ├── icon.svg                # Vector app icon
│   ├── icon-192.png            # 192x192 PNG app icon
│   └── icon-512.png            # 512x512 PNG app icon
└── archive/                    # Historical snapshots
    ├── net-toolkit.html        # v1.0 snapshot
    ├── netops_toolkit_210.html # v2.1.0 snapshot
    └── netops_toolkit_230.html # v2.3.0 snapshot
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
