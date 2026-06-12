# TempEmail CLI Landing Page & Demo Project

This is a premium, developer-focused Astro.js landing page for the **TempEmail CLI** tool. It showcases system status, an interactive terminal mockup with copy-to-clipboard functionality, and key features.

---

## 🚀 Running Locally

To run this project on your local machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Dev Server**:
   ```bash
   npm run dev
   ```
   This will run the site locally at `http://localhost:4321/`.

3. **Build and Preview locally**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🚀 Simple VPS Deployment (Without Docker)

To run this project on your DigitalOcean VPS without Docker:

### Step 1: Upload Files to your VPS
Upload all the project files (except `node_modules` and `.git` folders) to a directory on your VPS. You can use **SFTP/SCP** or **git** to clone it:
```bash
# Example using SCP to copy the project to your VPS (run this from your local computer)
scp -r /path/to/temp-email user@your_vps_ip:/var/www/temp-email
```

### Step 2: Install Node.js on the VPS (If not installed)
Log in to your VPS via SSH and install Node.js (version 20 or newer recommended):
```bash
# For Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Run the Project
Navigate to the project folder on your VPS and run:
```bash
# 1. Install dependencies
npm install

# 2. Build the Astro project
npm run build

# 3. Start the server
npm run start
```

Your landing page will now be running on port `8080`. You can access it via:
`http://your_vps_ip:8080`

### 💡 Tips
* **Change the Port**: You can change the port `8080` to port `80` (or any other port) in [package.json](file:///Users/mac/Documents/react/temp-email/package.json) by editing the `"start": "serve dist -l 8080"` command.
* **Keep Server Running**: To keep the server running in the background after you close the SSH terminal, you can use `pm2` or `nohup`:
  ```bash
  # Install PM2 globally
  sudo npm install -g pm2
  
  # Start the server with PM2
  pm2 start npm --name "temp-email" -- run start
  ```
