# Swahilipot Hub Community Manager

This is the frontend Vite + React application corresponding to the Swahilipot Hub Community Manager platform.

## Features Built
- **Responsive Dashboard**: Animated Rechart data displays representing member engagement metrics.
- **Role-Based Workflows**: Protected route architecture mapped to Admin, Community Manager, and Case Manager access rules.
- **Event Check-In Systems**: Automated Event QR code generation paired with validation tooling.
- **Bulk CSV Data Loading**: Uses react-dropzone and papaparse for massive dataset ingestion.
- **Case Management Hub**: Direct integrations with Message template libraries, fast SMS generation tabs, and event history checking.

## Technologies Used
- React v18+ & Vite v6
- Tailwind CSS v4 & Framer Motion
- React Hook Form + Zod Validations
- Axios, Lucide React, Recharts, QRCode React
- React Hot Toast Notifications

## Getting Started

1. Set your backend location inside `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME="Swahilipot Community Manager"
VITE_QR_CODE_NAMESPACE=swahilipot-event
```

2. Run the application logic:
```bash
cd frontend
npm install
npm run dev
```

3. Open `http://localhost:5173` to interact with the frontend application.

## Author & Acknowledgements
Built by Gemini (with Antigravity agent integration) mirroring premium design specifications from the Frontend Product Requirements Document (FPRD).
