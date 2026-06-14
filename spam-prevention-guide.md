# Email Spam Prevention Guide

Agar aap apni custom domain se bheji gayi emails ko seedha **Inbox** mein pohanchana chahte hain aur chahte hain ke wo Spam ya Junk folder mein na jayein, toh apni domain ke DNS (maslan DigitalOcean) mein foran yeh 2 records add karein.

### Tariqa-e-Kaar (Quick Setup):
Apne DNS provider mein jayen aur yeh 2 naye TXT records shamil karein:

**1. SPF Record (Spam se bachne ke liye pehla record)**
* **Type:** `TXT`
* **Name / Host:** `@` 
* **Value / Text:** `v=spf1 a mx ip4:64.227.137.95 ~all`

**2. DMARC Record (Emails ko reject hone se bachane ke liye)**
* **Type:** `TXT`
* **Name / Host:** `_dmarc` *(shuru mein underscore _ lazmi lagayein)*
* **Value / Text:** `v=DMARC1; p=none;`

---

## Yeh Records Kya Hain Aur Kaise Kaam Karte Hain? (Wazahat)

Agar aap in records ki details samajhna chahte hain toh neechay parh sakte hain:

### 1. SPF (Sender Policy Framework)
**Mukhaffaf (Stands for):** Sender Policy Framework

**Iska Matlab Kya Hai?**
SPF ek aisi list hai jo aap apne domain ke DNS mein add karte hain. Is list mein un tamam servers (ya IP addresses) ke naam hote hain jinhein aapki domain ki taraf se email bhejne ki ijazat (permission) hoti hai.

**Kaam Kaise Karta Hai?**
Jab aapki email Gmail tak pohanchti hai, toh Gmail aapke domain ka SPF record check karta hai aur dekhta hai ke jis IP address se yeh email aayi hai, kya wo aapki ijazat-yafta list mein mojood hai? 
- **Agar IP list mein hai** (jaise aapke VPS ka IP `64.227.137.95`), toh email **Pass** ho jati hai aur Inbox mein jane ke chances barh jate hain.
- **Agar IP list mein nahi hai**, toh email **Fail** ho jati hai aur Gmail usay Spam mein daal deta hai ya block kar deta hai.

### 2. DMARC (Domain-based Message Authentication, Reporting, and Conformance)
**Mukhaffaf (Stands for):** Domain-based Message Authentication, Reporting, and Conformance

**Iska Matlab Kya Hai?**
DMARC SPF aur DKIM ke oopar ek security ka policy pehredar (guard) hai. Yeh receiving server (jaise Gmail) ko saaf lafzon mein batata hai ke agar koi email SPF test fail kar de (yani kisi un-authorized server se aaye), toh us email ke sath **kya sulook kiya jaye**.

**Kaam Kaise Karta Hai?**
DMARC mein 3 policies (rules) hoti hain:
1. `p=none`: Agar SPF fail ho toh bhi email ko aane do (Reject mat karo, shayad Spam mein daal do lakin block na karo). *Yeh hum log shuruati testing ke liye lagate hain.*
2. `p=quarantine`: Agar SPF fail ho toh email ko seedha Spam/Junk folder mein phenk do.
3. `p=reject`: Agar SPF fail ho toh email ko dakhil hi mat hone do (seedha reject kar do).

---

## Khulasa (Summary)
Agar aap chahte hain ke aapki custom domain se bheji gayi emails Google, Yahoo, aur Microsoft par block na hon aur unka trust barhe, toh aapke DNS mein **SPF aur DMARC** ka theek se set hona lazmi hai. Yeh dono records duniya ko batate hain ke aapki emails 100% asli aur safe hain.
