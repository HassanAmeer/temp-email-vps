# Email Spam Prevention Guide

### Quick Setup (Spam se bachne ka tariqa)
Apne DNS provider mein yeh 2 naye **TXT Records** lazmi add karein:

**1. SPF Record:**
* **Type:** `TXT`
* **Name:** `@` 
* **Value:** `v=spf1 a mx ip4:64.227.137.95 ~all`

**2. DMARC Record:**
* **Type:** `TXT`
* **Name:** `_dmarc`
* **Value:** `v=DMARC1; p=none;`

*(Note: Inhe save karne ke baad update hone mein 10 se 15 minute lag sakte hain. Uske baad test karein!)*

---
---

### Detailed Explanation (Wazahat)

Agar aap in records ki details samajhna chahte hain:

**1. SPF (Sender Policy Framework)**
SPF ek aisi list hai jisme un IP addresses ke naam hote hain jinhein aapki domain se email bhejne ki ijazat hoti hai. Agar IP is list mein na ho toh email Spam mein chali jati hai ya block ho jati hai.

**2. DMARC (Domain-based Message Authentication, Reporting, and Conformance)**
DMARC receiving server (jaise Gmail) ko batata hai ke agar koi email SPF test fail kar de toh us email ke sath kya karna hai. `p=none` ka matlab hai ke abhi block na karo, jabke `p=reject` ka matlab hai ke block kar do.
