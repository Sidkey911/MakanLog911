# MakanLog v2 — offline calorie tracker + photo-assisted estimator

A private, installable **Progressive Web App (PWA)** for iPhone, Android and desktop. Default daily target: **1,777 kcal**. No subscriptions, accounts, analytics or cloud diary. The core app works offline after installation. Optional photo recognition uses TensorFlow.js downloaded online **once**, then cached for later offline recognition if the browser retains the cache.

## New in v2: Photo meal estimation (optional)

- Take a photo using your iPhone camera or choose a photo from your library.
- Tap **Analyse photo with AI** to get **on-device visual food suggestions** (limited to food categories a general-purpose ImageNet model recognizes; it may not recognize Malaysian or mixed dishes).
- The model/runtime download over the internet **on first use**. Later use can be offline as long as the service-worker cache is retained. If it cannot load, the photo is still usable with the manual search.
- Tap an AI suggestion or search for visible foods, e.g. **White rice + Chicken breast + Fried egg**; adjust individual gram weights to estimate the total kcal and macros. Save all foods to Breakfast/Lunch/Dinner/Snacks in one tap.
- **A photo cannot reliably measure gram weights, cooking oil, sauces, or concealed ingredients.** The app never claims the calorie amount is measured directly from the pixels. Use a kitchen scale or packaging when available. Photo images are **not uploaded or permanently stored**.
- No cloud AI, API key, registration or backend. Note that JS libraries and model are fetched from external public hosting once on first use; their availability is outside this repo.

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
3. Download and extract the provided `MakanLog-Photo-Offline-GitHub-Ready.zip` file. Upload **all the contents** of the `MakanLog-Offline` folder into the **root of your new repository** by selecting **Add file → Upload files**. Be sure `index.html`, `styles.css`, `app.js`, `photo.js`, `sw.js`, `manifest.webmanifest`, and the entire `icons/` folder are in the root; **do not upload only the ZIP file**. Commit the changes.
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
- The core offline install stores static source and food data; an optional TensorFlow.js model is cached separately when used. The app never infers accurate portion weight from photos.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Accessible mobile app screens and dialogs |
| `styles.css` | Mobile layout, light/dark appearance |
| `app.js` | Food library, tracking, totals, storage, backups |
| `sw.js` | Offline caching (core files and AI assets after first download) |
| `photo.js` | Camera/photo support, optional on-device image recognition and multi-food estimates |
| `manifest.webmanifest` | Home Screen installation metadata |
| `icons/` | App icons |
| `.nojekyll` | GitHub Pages static-file compatibility |

MIT licensed. Built for personal use, not medical advice.

## Updating an existing MakanLog GitHub repository (iPhone or laptop)

Keep the SAME GitHub repository and same published URL. On the `main` branch, upload the **contents** of the new ZIP, not the ZIP itself. When GitHub asks about existing files, replace `index.html`, `styles.css`, `app.js`, `sw.js`, `README.md`, then add `photo.js`. The `icons/` files and `manifest.webmanifest` can stay or be overwritten. Commit, wait for Pages deployment, then reload the site **once with internet** so the new v2 service worker caches the new files. Your existing food entries remain on the same installed app/browser storage, as v2 continues to use the `makanlog-data-v1` key. **Make a JSON backup first.**

If iPhone Safari's GitHub upload flow won't replace existing files, use a laptop, or open a file on GitHub.com → Edit (pencil) → paste the corresponding new file content → Commit. Uploading from a laptop is significantly easier. For public GitHub Pages on the free GitHub plan, make the repository Public before enabling Pages.

## Photo AI technical notes

- `photo.js` lazily loads `@tensorflow/tfjs@4.22.0` and `@tensorflow-models/mobilenet@2.1.1` from jsDelivr after the user chooses **Analyse photo with AI**. It then loads MobileNet V1 0.25 from the model's official TensorFlow Hub location. No third-party API processes the photo; local JavaScript runs classification.
- The service worker caches the runtime and image-model downloads **on first successful use while the app is controlled by its service worker**. For reliable offline AI, complete one AI scan online, then test again in airplane mode. Large caches can be evicted by iOS.
- MobileNet is a general ImageNet classifier and has a limited selection of direct food classes; **this is not Food-101 recognition**, and Malaysian mixed dishes are often not identified automatically. The app shows actual AI labels so you can judge the suggestion. The photo search/multi-food estimator always works offline using the included library, even without the AI model.
- The predicted class score is not a calorie confidence score. User-entered food portions and generic per-100g values determine the calorie estimate. For mixed meals, add every component separately; note cooking oil and sauces can materially change calories.
- On some iPhones, photo input inside an installed PWA may behave differently from Safari. Use **Choose photo** instead of **Take photo** if the camera picker doesn't work.

Dependencies: TensorFlow.js (Apache-2.0); MobileNet (Apache-2.0), downloaded from their publishers at first use; not included in this repository ZIP. Review the upstream notices/licensing before redistributing a copy of the model weights.

References: https://github.com/tensorflow/tfjs-models/tree/master/mobilenet and https://www.tensorflow.org/js/models
