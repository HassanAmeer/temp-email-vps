# TempEmail Static Landing Page & Hidden Consoles

This project is a secure temporary email dashboard utility built with Astro.js (Tailwind CSS v4 + custom SVG vector icons) and a backend Node.js SMTP server. 

---

## 🔒 Hidden Routes / Backdoor Testing

The default landing page (`/`) is designed as a simple static online check page. It contains **no buttons, links, or navigation options** to the dashboards, making it safe to show to clients.

To access the consoles, you must type the URLs manually:
* **Local Test Console:** `http://localhost:8081/local`
* **Live VPS Console:** `http://localhost:8081/live`

---

## 🚀 Running Locally

To test everything on your local computer:

1. **Build the assets**:
   ```bash
   npm run build
   ```

2. **Start the SMTP and HTTP Server**:
   ```bash
   npm run mail:start
   ```
   * SMTP Server listens on: `2525`
   * HTTP Web Server listens on: `8081`

3. **Access via browser**:
   * Open `http://localhost:8081/local` in your browser.
   * Click the **Send Test Email (Nodemailer)** button at the bottom of the local page to test immediately.

---

## 📂 Project Structure

* **`src/pages/index.astro`**: Clean static landing page (no links to consoles).
* **`src/pages/local.astro`**: Local SMTP dashboard page.
* **`src/pages/live.astro`**: Live SMTP dashboard page.
* **`rmail/rmail.js`**: Backend SMTP receiver (Port 2525) & HTTP API (Port 8081) server.
* **`rmail/mails-data/local/`**: Local test emails saved here.
* **`rmail/mails-data/live/`**: Live SMTP emails from public networks saved here.
