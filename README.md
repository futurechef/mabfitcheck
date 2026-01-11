# MAB Virtual Atelier - Fit Check

<div align="center">

**AI-Powered Virtual Try-On for Michael Andrews Bespoke**

*Experience New York's finest bespoke tailoring through AI visualization*

[Live App](https://mabsuit-479703.web.app) • [Documentation](./DOCUMENTATION.md)

</div>

---

## 🌟 Features

- **📸 Photo Capture & Validation** - AI-powered photo quality assessment
- **👔 29 Bespoke Suits** - Complete catalog with Cloud Storage images
- **🧵 112 Fabric Swatches** - Organized by mill (Holland & Sherry, Scabal, Dormeuil, Loro Piana)
- **👕 Custom Shirt Configuration** - Style + fabric selection
- **🤖 Gemini 3 Pro Image** - Photorealistic AI visualization
- **💾 Firebase Wardrobe** - Save and manage your designs
- **📏 Measurements** - Optional body measurements for better fit visualization
- **⚡ Quick Demo Walkthrough** - Backend-free demo mode using full Cloud Storage URLs

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Firebase account (for deployment)
- Gemini API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/futurechef/mabfitcheck.git
cd mabfitcheck

# Install dependencies
npm install

# Set up environment variables
# Create .env.local file with:
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

---

## 📦 Project Structure

```
mabfitcheck/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── main.tsx               # Entry point
│   ├── types.ts               # TypeScript definitions
│   ├── constants.ts           # 29 suit products
│   ├── components/            # React components
│   │   ├── PhotoCapture.tsx
│   │   ├── ValidationFeedback.tsx
│   │   ├── MeasurementInput.tsx
│   │   ├── SuitSelector.tsx
│   │   ├── ShirtStyleSelector.tsx
│   │   ├── ShirtFabricSelector.tsx
│   │   ├── ResultView.tsx
│   │   └── ...
│   ├── constants/
│   │   ├── fabricSwatches.ts  # 112 fabric swatches
│   │   └── shirts.ts          # Shirt products
│   └── services/
│       ├── geminiService.ts   # Gemini 3 Pro Image integration
│       └── firebase.ts        # Firebase Auth + Firestore
├── public/                    # Static assets
├── firebase.json              # Firebase hosting config
└── package.json
```

---

## 🎯 User Flow

1. **Capture Photo** → Upload/capture full-body photo
2. **AI Validation** → Get feedback on photo quality
3. **Measurements** (Optional) → Enter body measurements
4. **Select Garment Type** → Suit, Shirt, or Both
5. **Choose Product** → Select from 29 suits or configure shirt
6. **AI Generation** → Gemini 3 Pro Image creates visualization
7. **Save to Wardrobe** → Store design in Firebase

---

## 🛠️ Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Gemini 3 Pro Image** - AI image generation
- **Firebase** - Auth, Firestore, Storage, Hosting
- **Framer Motion** - Animations

---

## 📊 Data Assets

### Suits (29 Products)
Located in `src/constants.ts`
- Full metadata (color, pattern, fabric, price, production time)
- Cloud Storage image URLs
- AI prompt descriptions
- Product URLs to michaelandrews.com

### Fabric Swatches (112 Fabrics)
Located in `src/constants/fabricSwatches.ts`
- Organized by mill:
  - **Holland & Sherry** (27 swatches)
  - **Scabal** (23 swatches)
  - **Dormeuil** (13 swatches)
  - **Loro Piana** (3 swatches)
  - **Other Mills** (46 swatches)
- Cloud Storage image URLs
- Pattern, color, mill metadata

### Shirts
Located in `src/constants/shirts.ts`
- Shirt product definitions
- Style configurations
- Fabric compatibility

---

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🚢 Deployment

### Firebase Hosting

```bash
# Build first
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

The app is configured to deploy to:
- **Project:** mabsuit-479703
- **URL:** https://mabsuit-479703.web.app

---

## 📝 Environment Variables

Create `.env.local` file:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

**Note:** Never commit `.env.local` to git. It's already in `.gitignore`.

---

## 🐛 Known Issues & Next Steps

See [BUG_FIX_AND_NEXT_STEPS.md](./BUG_FIX_AND_NEXT_STEPS.md) for:
- Recent bug fixes
- Known issues
- Prioritized feature roadmap

---

## 📄 License

Private repository - Michael Andrews Bespoke

---

## 🙏 Credits

- **Michael Andrews Bespoke** - New York's premier bespoke tailor
- **Google Gemini** - AI image generation
- **Firebase** - Backend infrastructure

---

**Built with ❤️ for Michael Andrews Bespoke**
