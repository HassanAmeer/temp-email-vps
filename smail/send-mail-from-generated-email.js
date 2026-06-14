import nodemailer from "nodemailer";
import dns from "dns";
import util from "util";

const resolveMx = util.promisify(dns.resolveMx);

/**
 * Sends an email directly to the recipient's MX server.
 * @param {Object} options - { from, to, subject, text, html }
 */
export async function sendOutboundEmail({ from, to, subject, text, html }) {
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
  console.log(`[OUTBOUND] Sending email to ${to} via MX server: ${targetMx}`);

  // Create a nodemailer transporter targeting the resolved MX server
  const transporter = nodemailer.createTransport({
    host: targetMx,
    port: 25,
    secure: false, // Port 25 usually uses STARTTLS rather than implicit TLS
    tls: {
      rejectUnauthorized: false // Allow self-signed certs (common when communicating server-to-server)
    }
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
    console.log(`[OUTBOUND] Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[OUTBOUND] Failed to send email to ${to}:`, error);
    throw error;
  }
}
