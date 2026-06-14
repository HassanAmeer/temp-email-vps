# VPS Server Setup & Deployment Guide

This document records the exact steps and commands used to set up the **TempEmail** SMTP and Web API server on a clean DigitalOcean Ubuntu Droplet (VPS).

---

## Phase 1: Logging into your VPS (Droplet) via SSH

Open the Terminal on your local machine (Mac) and connect to the VPS.

### 1. Connection (Incorrect Parked IP) — *Failed*
When trying to connect to Hostinger's default parked domain IP, the connection times out because Hostinger does not allow SSH root access on their parked domain servers.
```bash
# This will TIMEOUT because 162.159.140.98 is Hostinger's parking IP, not your VPS IP
ssh root@162.159.140.98
```

### 2. Connection (Correct VPS IP) — *Succeeded*
Log in using your actual DigitalOcean Droplet IP address (`64.227.137.95`) as the `root` user:
```bash
# Connect to your actual Droplet IP
ssh root@64.227.137.95
```
* **Host IP**: `64.227.137.95`
* **Username**: `root`
* **Password**: HasanAmeer386@gmail.com 
--> `[Put your VPS root password here]`
* **Fingerprint Warning**: The first time you connect, type `yes` to add the VPS IP to your machine's known hosts.
* **Password**: Enter the root password you created during the Droplet setup.

--- 

## Phase 2: Installing Node.js (v22) and NPM on Ubuntu

Once logged in, you need to install Node.js and `npm` because a fresh Ubuntu Droplet does not come with them pre-installed.

```bash
# 1. Update the local package list to ensure you get the latest security updates
apt update

# 2. Install curl (utility to download scripts from the internet)
apt install -y curl

# 3. Add the NodeSource repository for Node.js v22 (LTS) to the system
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

# 4. Install Node.js (this command automatically installs Node.js and its package manager npm)
apt install -y nodejs

# 5. Verify the installation by checking their version numbers
node -v
npm -v
```

---

## Phase 3: Cloning code & Installing Project Dependencies

Clone the project repository from GitHub and prepare the package files.

```bash
# 1. Clone the project repository from GitHub to the VPS
git clone https://github.com/HassanAmeer/temp-email-vps.git

# 2. Navigate into the cloned repository folder (ZAROORI: Always enter the directory before running npm commands)
cd temp-email-vps

# 3. Install all npm packages and dependencies defined in package.json
npm i

# 4. (Optional) Update npm to the latest major version if prompted
npm install -g npm@11.17.0
```

---

## Phase 4: Setting up VPS Firewall (UFW)

Open the incoming network ports on the VPS firewall so that the browser can load the website and external SMTP servers can deliver emails.

```bash
# 1. Open HTTP Port 80 (Standard web traffic port)
sudo ufw allow 80/tcp

# 2. Open HTTP Port 8081 (Alternative web dashboard/API traffic port)
sudo ufw allow 8081/tcp

# 3. Open SMTP Port 25 (Universal standard mail server receipt port)
sudo ufw allow 25/tcp

# 4. Open SMTP Port 2525 (Alternative SMTP port used for local trapping & bypassing residential blocks)
sudo ufw allow 2525/tcp
```

---

## Phase 5: Building and Starting the Mail Platform

Build the Astro static assets and run the background server.

```bash
# 1. Compile the Astro frontend pages into static assets (saved inside /dist folder)
npm run build

# 2. Run the SMTP Server and Web Dashboard on default development ports (SMTP: 2525, Web: 8081)
npm run mail:start
```
*At this point, you can access the dashboard at: `http://64.227.137.95:8081/live`*

---

## Phase 6: Production Setup (Running on Standard Ports 80 & 25)

To make it fully ready to receive emails from public senders like Gmail, Outlook, or Yahoo, you must run the server on standard ports (Web: 80, SMTP: 25). Since the code automatically defaults to these ports in production (when `live` is not set to `false`), you can run it simply with:

```bash
# 1. Stop the current node process by pressing Ctrl + C in the terminal

# 2. Run the start command as root to bind to ports 80 and 25
sudo npm run mail:start
```
*Now you can access the dashboard directly without port numbers: `http://64.227.137.95/live`*

---

## Phase 7: Persistent Execution (Keeping server alive with PM2)

If you log out of the SSH terminal, your node script will stop running. To keep it active 24/7 in the background, configure PM2:

```bash
# 1. Install PM2 (Process Manager) globally on the system
npm install -g pm2

# 2. Start the mail receiver script in the background as root (which defaults to Ports 80 and 25)
sudo pm2 start backend/receive-mail/receive-mail.js --name "temp-email"

# 3. Save the running process list so it automatically restarts if the VPS rebooted
pm2 save

# 4. Enable PM2 to start on system boot
pm2 startup
```
