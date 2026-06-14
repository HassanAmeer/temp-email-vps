import readline from "readline";
import { sendOutboundEmail } from "./smail/send-mail-from-generated-mail-from-local.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

async function main() {
  console.log("==========================================");
  console.log("🚀 Send Email From Local CLI 🚀");
  console.log("==========================================\n");

  const from = await askQuestion("1. Enter 'From' Email Address (e.g., yaar@llamerada.online): ");
  const to = await askQuestion("2. Enter 'To' Email Address (e.g., friend@gmail.com): ");
  const subject = await askQuestion("3. Enter Subject: ");
  const text = await askQuestion("4. Enter Message: ");
  
  rl.close();

  console.log("\n⏳ Sending email...\n");
  
  try {
    await sendOutboundEmail({
      from,
      to,
      subject,
      text,
      html: text.replace(/\n/g, '<br>'),
      logCallback: (msg) => console.log(msg)
    });
    console.log("\n✅ Email sent successfully from Local Machine!");
  } catch (error) {
    console.error("\n❌ Failed to send email:", error.message);
  }
}

main();
