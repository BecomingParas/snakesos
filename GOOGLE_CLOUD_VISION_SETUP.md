# Google Cloud Vision API Setup Guide

This guide reflects the security model for your organization: use keyless application authentication instead of JSON service-account keys, because `iam.disableServiceAccountKeyCreation` is enabled.

## Overview

The system automatically detects Google Cloud credentials and switches from the stub provider to real AI:
- ✅ Stub provider (default): No external dependencies, deterministic results
- 🚀 Google Cloud Vision (with Application Default Credentials or runtime identity): Real AI-powered snake detection

## Recommended authentication model

For a backend application that uploads a snake image and sends it to Google Cloud Vision, the correct Google Cloud wizard choice is:

- `Application data`
- Then create the service account if allowed
- Do not attempt to create/download a JSON private key if your organization policy blocks it

This is expected behavior when your org enforces `iam.disableServiceAccountKeyCreation`.

## Step-by-Step Setup

### 1. Install Google Cloud CLI

```bash
# macOS:
brew install --cask google-cloud-sdk

# Windows: Download from https://cloud.google.com/sdk/docs/install
# Linux:
curl https://sdk.cloud.google.com | bash
```

### 2. Initialize and authenticate locally

```bash
gcloud init
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

This gives your local Node.js backend access to Google Cloud without storing a `service-account.json` file in the repo.

### 3. Enable Vision API

```bash
gcloud services enable vision.googleapis.com
```

### 4. Create the service account (when allowed by policy)

If the project allows service account creation, do this:

```bash
# Create service account
gcloud iam service-accounts create snake-rescue-vision \
  --display-name="SnakeSOS Vision API Access"

# Grant Vision API access
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:snake-rescue-vision@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

> If the wizard or CLI blocks key creation, that is expected under your organization policy. Do not disable the policy just to create a JSON key.

### 5. Use Application Default Credentials instead of a key file

Local development:

```bash
gcloud auth application-default login
```

Then your backend can call Vision without a JSON key:

```ts
import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient();

const [result] = await client.labelDetection({
  image: { content: imageBuffer },
});
```

No `GOOGLE_APPLICATION_CREDENTIALS`/service-account JSON file is required locally when ADC is active.

### 6. Production identity model

For Cloud Run, Compute Engine, GKE, or another managed runtime, attach a Google identity that has the required permissions and let the platform provide credentials automatically.

Example pattern:

```text
Cloud Run
  └── Service Account
        └── Vision permissions
                └── Google Cloud Vision API
```

Do not rely on a committed private key file in production.

### 7. Install dependencies

```bash
cd snake-rescue
npm install @google-cloud/vision
# or
yarn add @google-cloud/vision
```

### 8. Verify installation

```bash
# Start backend server
npm run dev:backend

# Check logs for:
# "📷 Using Google Cloud Vision API for snake identification"
```

If you see this message, Google Cloud Vision is active! 🎉

## Important note for this project

The app is not a user-authenticated Google app. It is a server-side snake-rescue workflow. That means the right architecture is:

```text
Citizen uploads snake image
        ↓
Next.js frontend
        ↓
Backend API
        ↓
Google Cloud Vision API
        ↓
Backend decision + species safety classification
        ↓
Frontend result display
```

This is why `Application data` is the correct choice on the Google Cloud wizard.

## Important security policy note

If your organization has `iam.disableServiceAccountKeyCreation` enabled, then:

- creating a JSON service-account key is blocked
- you should not disable the policy just to obtain a key
- use ADC, workload identity, or attached runtime service accounts instead

## Configuration options

### Environment variables

For local ADC development, you do not need a JSON file in the repo:

```bash
# No JSON key needed for standard local ADC flow
# Example:
gcloud auth application-default login
```

Optional explicit override if your environment still uses a file-based credential path:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

This is only for environments where key files are permitted. In your org, that may not be allowed.

### Fallback behavior

If credentials are not found:
```
✅ System automatically falls back to stub provider
✅ App continues working with deterministic results
✅ No errors or crashes
```

## API pricing

**Google Cloud Vision Pricing (as of 2024):**
- First 1,000 requests/month: FREE
- Feature Detection: $1.50 per 1,000 images
- Web Detection: $3.50 per 1,000 images

**For SnakeSOS:**
- Estimate: ~100-500 identifications/month
- Monthly cost: $0.15 - $0.75 (minimal)

## Troubleshooting

### "Could not load the default credentials"

**Solution:**
```bash
# Authenticate locally with ADC
export GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
gcloud auth application-default login
```

### "Vision API not enabled"

**Solution:**
```bash
gcloud services enable vision.googleapis.com

# Check enabled services
gcloud services list --enabled
```

### "Insufficient permissions"

**Solution:**
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:snake-rescue-vision@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### "Image URL not accessible"

**Solution:**

# Windows (PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\snake-rescue-vision-key.json"

# Windows (Command Prompt)
set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\snake-rescue-vision-key.json
```

### 7. Install Dependencies

```bash
cd snake-rescue
npm install @google-cloud/vision
# or
yarn add @google-cloud/vision
```

### 8. Verify Installation

```bash
# Start backend server
npm run dev:backend

# Check logs for:
# "📷 Using Google Cloud Vision API for snake identification"
```

If you see this message, Google Cloud Vision is active! 🎉

## Features Provided by Google Cloud Vision

The integration uses these Vision API features:

1. **Label Detection**
   - Identifies objects in images (snakes, body parts, patterns)
   - Returns confidence scores
   - Detects ~10,000+ entity types

2. **Web Detection**
   - Finds similar images on the web
   - Identifies snake species from web search results
   - Provides additional context

3. **Object Localization**
   - Detects snake position in image
   - Provides bounding boxes
   - Helps with image quality assessment

## Nepali Snake Species Detection

The provider recognizes these Nepali snakes:

**Highly Venomous (HIGH_RISK):**
- Spectacled Cobra (Naja naja)
- Common Krait (Bungarus caeruleus)
- Russell's Viper (Daboia russelii)
- Monocled Cobra (Naja kaouthia)
- King Cobra (Ophiophagus hannah)
- Banded Krait (Bungarus fasciatus)
- Green Pit Viper (Trimeresurus albolabris)
- Bamboo Pit Viper (Trimeresurus gramineus)

**Non-Venomous (LOW_RISK):**
- Rat Snake (Ptyas mucosus)
- Elaphe hodgsoni

## Configuration Options

### Environment Variables

```bash
# Required for Google Cloud Vision
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json

# Optional: Alternative credential path
GOOGLE_CLOUD_VISION_CREDENTIALS=/path/to/key.json

# Logging
DEBUG=snake-rescue:* # Enable detailed logs
```

### Fallback Behavior

If credentials are not found:
```
✅ System automatically falls back to stub provider
✅ App continues working with deterministic results
✅ No errors or crashes
```

## API Pricing

**Google Cloud Vision Pricing (as of 2024):**
- First 1,000 requests/month: FREE
- Feature Detection: $1.50 per 1,000 images
- Web Detection: $3.50 per 1,000 images

**For SnakeSOS:**
- Estimate: ~100-500 identifications/month
- Monthly cost: $0.15 - $0.75 (minimal)

## Troubleshooting

### "Could not load the default credentials"

**Solution:**
```bash
# Verify file exists
ls -la snake-rescue-vision-key.json

# Check path is correct
echo $GOOGLE_APPLICATION_CREDENTIALS

# Ensure proper permissions
chmod 600 snake-rescue-vision-key.json
```

### "Vision API not enabled"

**Solution:**
```bash
# Re-enable the API
gcloud services enable vision.googleapis.com

# Check enabled services
gcloud services list --enabled
```

### "Insufficient permissions"

**Solution:**
```bash
# Re-grant role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:snake-rescue-vision@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/ml.admin"
```

### "Image URL not accessible"

**Solution:**
- Ensure image URL is publicly accessible
- Check firewall/CORS settings
- Test URL directly: `curl -I https://your-image-url.jpg`

## Testing the Integration

```bash
# Test with curl
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { identifySnake(input: { imageUrl: \"https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg\" }) { id species { name scientificName venomous } confidence dangerAssessment } }"
  }'
```

## Production Deployment

For Vercel/production:

1. **Create new service account for production**
   ```bash
   gcloud iam service-accounts create snake-rescue-prod \
     --display-name="SnakeSOS Production Vision API"
   ```

2. **Set secret in deployment platform**
   - Vercel: Add `GOOGLE_APPLICATION_CREDENTIALS` to Environment Variables
   - Upload JSON key content as secret

3. **Monitor usage**
   ```bash
   # View usage in Google Cloud Console
   # https://console.cloud.google.com/billing/overview
   ```

## Next Steps

1. ✅ Set up Google Cloud Project
2. ✅ Create Service Account and key
3. ✅ Install `@google-cloud/vision`
4. ✅ Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable
5. ✅ Restart backend server
6. ✅ Test with real snake images

For more details: https://cloud.google.com/vision/docs

---

**Status**: Google Cloud Vision integration ready for production! 🚀
