import nodemailer from "nodemailer";
import dns from "dns";
import util from "util";

const resolveMx = util.promisify(dns.resolveMx);

/**
 * Sends an email directly to the recipient's MX server.
 * @param {Object} options - { from, to, subject, text, html }
 */
export async function sendOutboundEmail({ from, to, subject, text, html, logCallback }) {
  const log = (msg) => {
    console.log(msg);
    if (logCallback) logCallback(msg);
  };

  if (!from || !to) {
    throw new Error("Missing 'from' or 'to' addresses");
  }

  // Extract the domain of the recipient
  const toDomain = to.split("@")[1];
  if (!toDomain) {
    throw new Error("Invalid 'to' email address");
  }

  // Look up MX records for the recipient's domain
  let mxRecords;
  try {
    log(`[OUTBOUND] Resolving MX records for ${toDomain}...`);
    mxRecords = await resolveMx(toDomain);
  } catch (error) {
    throw new Error(`Failed to resolve MX records for domain ${toDomain}: ${error.message}`);
  }

  if (!mxRecords || mxRecords.length === 0) {
    throw new Error(`No MX records found for domain ${toDomain}`);
  }

  // Sort MX records by priority (lowest number = highest priority)
  mxRecords.sort((a, b) => a.priority - b.priority);

  const targetMx = mxRecords[0].exchange;
  log(`[OUTBOUND] Target MX server selected: ${targetMx} (Priority: ${mxRecords[0].priority})`);
  log(`[OUTBOUND] Connecting to ${targetMx} on Port 25...`);

  // Create a nodemailer transporter targeting the resolved MX server
  const transporter = nodemailer.createTransport({
    host: targetMx,
    port: 25,
    secure: false, // Port 25 usually uses STARTTLS rather than implicit TLS
    tls: {
      rejectUnauthorized: false // Allow self-signed certs (common when communicating server-to-server)
    },
    logger: {
      level: 'debug',
      trace: (msg, meta) => log(`[SMTP TRACE] ${msg} ${JSON.stringify(meta||{})}`),
      debug: (msg, meta) => log(`[SMTP DEBUG] ${msg} ${JSON.stringify(meta||{})}`),
      info: (msg, meta) => log(`[SMTP INFO] ${msg} ${JSON.stringify(meta||{})}`),
      warn: (msg, meta) => log(`[SMTP WARN] ${msg} ${JSON.stringify(meta||{})}`),
      error: (msg, meta) => log(`[SMTP ERROR] ${msg} ${JSON.stringify(meta||{})}`),
      fatal: (msg, meta) => log(`[SMTP FATAL] ${msg} ${JSON.stringify(meta||{})}`)
    },
    debug: true
  });

  const mailOptions = {
    from,
    to,
    subject: subject || "(No Subject)",
    text: text || "",
    html: html || ""
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    log(`[OUTBOUND] Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    log(`[OUTBOUND ERROR] Failed to send email to ${to}: ${error.message}`);
    throw error;
  }
}
