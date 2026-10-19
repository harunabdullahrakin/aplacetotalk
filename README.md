# 🌱 Therapist Harun / Harun Consulting Website

A safe, soothing, modern, and confidential website designed for individuals struggling with depression, loneliness, heavy secrets, guilt, and critical life decisions.

---

## 🇧🇩 Auto Geolocation & Bilingual Feature (Bangla & English)

The website automatically detects where the visitor is located:
- **Visitors from Bangladesh** (detected via Dhaka timezone, Bengali browser language, or IP lookup) see the website in **heartfelt, natural Bangla (বাংলা)**.
- **Visitors from abroad / foreign countries** see the website in **English**.
- **Manual Switcher:** A prominent toggle button (**`🇧🇩 বাংলা` / `🇬🇧 English`**) is on the navbar so anyone can switch back and forth with a single tap!

---

## 🌟 Key Features

1. **Soothing & Empathetic Safe Haven:**
   - Soft, comforting dark aesthetic with warm candlelight amber and emerald accents.
   - Built to feel like a safe sanctuary rather than a cold clinical office.

2. **The 3 Unbreakable Rules:**
   - **Rule 1: Absolute Secrecy Vault (শতভাগ আমানতদারিতা ও গোপনীয়তা)** — No leaks to family, friends, or anyone.
   - **Rule 2: Zero Judgment (কোনো পাপ বা ভুলের বিচার নয়)** — No matter what sin or mistake was committed.
   - **Rule 3: Preventing Wrong Decisions (অপূরণীয় ভুল সিদ্ধান্ত নেওয়ার আগেই কথা বলুন)** — Giving someone a safe listening ear before taking an irreversible choice.

3. **Interactive Safe Vent & Release Box (বেনামী ভেন্ট বক্স):**
   - Visitors can type whatever is heavy on their chest right now.
   - They can choose **"Release & Let Go" (মুছে ফেলে ভারমুক্ত হোন)** (a soothing animation dissolves the text into dust) or **"Send Privately to Harun" (হারুনের কাছে গোপনে পাঠান)**.

4. **1-Click WhatsApp Topic Selector:**
   - Quick pills that let visitors pick how they feel (e.g., *"I made a mistake and guilt is eating me"*, *"I feel completely alone"*) and automatically generate a warm, pre-filled WhatsApp message ready to send.

5. **Integrated Ambient Calming Rain Player:**
   - Built-in sound generator on the navbar playing gentle ambient rain sound to soothe anxiety.

6. **Full Contact Suite:**
   - Direct WhatsApp tap-to-chat.
   - Direct Phone Call tap.
   - Direct Email link.
   - Confidential Booking / Consultation Request form with Anonymous Alias option.
   - Emergency Crisis Lifeline notice (999 Bangladesh / Kaan Pete Roi & international).

---

## ⚙️ How to Update Your Phone Number & Email (In 10 Seconds!)

Open **`config.js`** in any text editor and change these values:

```javascript
window.SITE_CONFIG = {
  name: "Therapist Harun",
  
  // Put your real phone/WhatsApp number here (with country code):
  whatsappNumber: "+88017XXXXXXXX", // e.g., +8801712345678
  displayPhone: "+880 17XX-XXXXXX",

  // Put your real email here:
  email: "your_real_email@gmail.com",

  // Your stats:
  totalPeopleHelped: "4+",
};
```

Whenever you save `config.js`, all contact links and numbers across the website will instantly update!

---

## 🚀 How to Deploy on GitHub Pages (Step-by-Step)

### Step 1: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new) and log in.
2. Enter a repository name (for example: `harun-consulting` or `therapist-harun`).
3. Make sure it is set to **Public**.
4. Click **Create repository**.

### Step 2: Upload Your Files

#### Method A: Using Git (Command Line)
In PowerShell inside this `harun-consulting` folder:
```bash
git init
git add .
git commit -m "Launch Therapist Harun website"
git branch -M main
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/harun-consulting.git
git push -u origin main
```

#### Method B: Direct Web Upload (No Git needed!)
1. On your new GitHub repository page, click **"uploading an existing file"**.
2. Drag and drop all the files from this folder (`index.html`, `style.css`, `translations.js`, `app.js`, `config.js`, `.nojekyll`, `README.md`).
3. Click **Commit changes**.

### Step 3: Turn on GitHub Pages
1. In your GitHub repository, click on the **Settings** tab (gear icon at the top).
2. On the left sidebar, click on **Pages**.
3. Under **Branch**, select `main` (and folder `/root`).
4. Click **Save**.

🎉 Within 1-2 minutes, GitHub will give you your live URL:
`https://<YOUR-GITHUB-USERNAME>.github.io/harun-consulting/`
