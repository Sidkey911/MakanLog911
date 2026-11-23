# MakanLog — offline calorie tracker

A private, installable **Progressive Web App (PWA)** for iPhone, Android and desktop. Default daily target: **1,777 kcal**. No subscriptions, accounts, analytics, cloud storage, external APIs, frameworks or internet connection needed **after the app has installed and cached its files**.

## What it can do

- Log **Breakfast, Lunch, Dinner and Snacks** separately for any day.
- Calculate calories and approximate protein/carbs/fat **from the food's per-100g values and your entered portion**.
- Search an included offline library of **60+ foods**, including Malaysian meals (rice, nasi lemak, roti canai, nasi goreng, teh tarik, chicken, eggs and more).
- **Quick Add** for foods with a known calorie amount.
- Create reusable **custom foods** from package labels, including calories/macros per 100g.
- **Favourite foods** for faster entry; repeat, edit or delete a meal.
- View remaining calories, goal progress and 7-day trends.
- Customize your calorie goal (default **1,777 kcal**), use light/dark theme.
- **Back up and restore** all data via JSON, or export meal history as CSV.
- Install to Home Screen as a standalone PWA. Works offline via a service worker.

**Important:** The included food estimates are illustrative, NOT official verified nutrition labels or personal health recommendations. Homemade meals and regional recipes can vary substantially. Double-check packaged food labels and adjust custom foods where needed. Macronutrient bars are visual, illustrative guides rather than personalised targets.

## Publish on GitHub Pages (easiest, no coding)

1. Sign in at [github.com](https://github.com) and click **New repository**.
2. Name it `makanlog` (or any name). Choose **Public** for a typical free Pages setup. Click **Create repository**.
3. Download and extract the provided `MakanLog-Offline.zip` file. Upload **all the contents** of the `MakanLog-Offline` folder into the **root of your new repository** by selecting **Add file → Upload files**. Be sure `index.html`, `styles.css`, `app.js`, `sw.js`, `manifest.webmanifest`, and the entire `icons/` folder are in the root; **do not upload only the ZIP file**. Commit the changes.
4. Open **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
5. Select **Branch: `main`** and **Folder: `/ (root)`**, then click **Save**.
6. Once GitHub publishes the site, open its address. For example:
   `https://YOUR-USERNAME.github.io/makanlog/`
7. Wait for the first page to load fully while you have internet, then install it on your phone as below.

GitHub Pages needs internet to host and **download the initial app once**; after installation, the PWA works without any network connection because its UI and food library are cached. It does not sync your personal entries to GitHub.

GitHub Docs: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Install on iPhone (Safari)

1. Open your GitHub Pages app link in **Safari** on the iPhone.
2. Wait until the app says **Offline ready** in the header (first launch with internet).
3. Tap **Share** (square and upward arrow), then **Add to Home Screen**.
4. If offered, enable **Open as Web App**. Tap **Add**.
5. Open **MakanLog from the new Home Screen icon**. You can log food even in airplane mode.

**iPhone storage note:** Safari tab data and an installed Home Screen web app may use different local storage. **Start logging from the installed app**, and use the JSON backup in Settings when changing devices or reinstalling.

Apple instructions: https://support.apple.com/en-gb/guide/iphone/iphea86e5236/27/ios/27

## Install on Android (Chrome)

Open the published URL in **Chrome** → browser menu **⋮** → **Install app** or **Add to Home screen** → confirm. Wait for the first successful online load before going offline.

## Daily use

1. From **Today**, tap **+ Add food**, or use the **+** beside a meal.
2. Under **Food library**, search a food; tap it; enter the portion in grams (approximate mL for drinks) and choose the meal. The app calculates the calories.
3. For a known calorie total, switch to **Quick add** and enter the amount from the label. Optional macro values can also be entered.
4. Under **My foods**, enter the nutrition per **100g** once for your usual meal. You'll then find it under **Foods → My foods**.
5. Tap the **star** next to favourites, or tap **↻** on a previous entry to add it again.
6. Check remaining calories on **Today** and 7-day results on **History**.
7. Use **Settings → Backup (JSON)** regularly. Restore the JSON on your new phone; CSV is for spreadsheets and cannot be imported into the app.

## Test locally (optional)

Do NOT open `index.html` by double-clicking (`file://` does not support the service worker). Use a local server:

```bash
cd MakanLog-Offline
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Service workers run on `localhost` or HTTPS.

## Update your deployed app

Upload updated files to the same GitHub repository. When changing app code in a future release, change the `CACHE` version string in `sw.js` (e.g. `makanlog-offline-v2`) to refresh cached assets. Internet is needed for updating the app, but not for day-to-day use.

## Data and privacy

- **Meal entries are saved only inside this browser/web app on this device** using `localStorage`. No data is uploaded anywhere, including GitHub Pages.
- Public GitHub repository visitors can see the **app's source code**, but **not your local diary data**.
- If phone/browser data is cleared, the app is deleted, or the device is lost, local data may be lost. Keep JSON backups outside the app.
- There is **no automatic multi-device sync**. Use JSON export/import to transfer data.
- The offline install only stores static source files and the food library; it does not remotely fetch calories or infer portions from photos.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Accessible mobile app screens and dialogs |
| `styles.css` | Mobile layout, light/dark appearance |
| `app.js` | Food library, tracking, totals, storage, backups |
| `sw.js` | Offline caching |
| `manifest.webmanifest` | Home Screen installation metadata |
| `icons/` | App icons |
| `.nojekyll` | GitHub Pages static-file compatibility |

MIT licensed. Built for personal use, not medical advice.
