# Stem Synergy

AI-powered housing blueprint platform with Claude Vision, 3D visualization, and real estate integration.

## 🌟 Features

- **Claude Vision AI Integration**: Advanced AI-powered blueprint analysis using Anthropic's Claude Vision API
- **3D Visualization**: Interactive 3D models of housing blueprints using Three.js and React Three Fiber
- **Real Estate Integration**: Seamlessly connect blueprints with real estate platforms and property data
- **Blueprint Management**: Upload, view, and manage housing blueprints
- **Intelligent Analysis**: Automatic extraction of dimensions, rooms, features, and recommendations
- **Modern UI**: Beautiful, responsive interface built with Next.js 14 and Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Anthropic API key (for Claude Vision integration)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jdrains110-beep/Stem-synergy.git
cd Stem-synergy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=https://stemsynergyaaffb7467.pinet.com
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **AI**: Anthropic Claude Vision API
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
Stem-synergy/
├── app/
│   ├── api/
│   │   ├── blueprints/upload/    # Blueprint upload endpoint
│   │   └── claude/analyze/       # Claude Vision analysis endpoint
│   ├── blueprints/
│   │   ├── [id]/                 # Blueprint detail page
│   │   ├── upload/               # Blueprint upload page
│   │   └── page.tsx              # Blueprints list page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── Blueprint3DViewer.tsx     # 3D visualization component
│   └── ClaudeAnalysis.tsx        # AI analysis display component
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Project dependencies
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🎨 Key Features

### 1. Blueprint Upload
- Drag-and-drop file upload
- Support for images (JPEG, PNG) and PDF files
- Automatic name extraction from filename
- File size validation (max 10MB)

### 2. AI Analysis with Claude Vision
- Automatic dimension extraction
- Room identification and sizing
- Feature detection
- Smart recommendations for improvements
- Integration with Anthropic's Claude API

### 3. 3D Visualization
- Interactive 3D models of housing structures
- Orbit controls (rotate, pan, zoom)
- Real-time rendering with shadows and lighting
- Visual representation of blueprint data

### 4. Blueprint Management
- List view and grid view options
- Search functionality
- Status tracking (analyzing, complete, error)
- Detailed blueprint information pages

## 🔑 API Integration

### Claude Vision API

The platform integrates with Anthropic's Claude Vision API to analyze blueprint images. To use this feature:

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Add the key to your `.env` file as `ANTHROPIC_API_KEY`
3. The API will automatically analyze uploaded blueprints

If no API key is configured, the application will use mock data for demonstration purposes.

### API Endpoints

- `POST /api/blueprints/upload` - Upload a new blueprint
- `POST /api/claude/analyze` - Analyze a blueprint with Claude Vision
- `GET /api/blueprints/upload` - Get all blueprints (mock endpoint)

## 🌐 Deployment

The application is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Alternatively, you can build and run the production version locally:

```bash
npm run build
npm start
```

## 📝 Development

### Running the development server
```bash
npm run dev
```

### Building for production
```bash
npm run build
```

### Running the production build
```bash
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 🔗 Links

- **Live Demo**: [https://stemsynergyaaffb7467.pinet.com](https://stemsynergyaaffb7467.pinet.com)
- **Anthropic Claude**: [https://www.anthropic.com/](https://www.anthropic.com/)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)

## 💡 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication and authorization
- Real estate API integrations (Zillow, Realtor.com)
- Export functionality (PDF, CAD formats)
- Collaboration features
- Mobile app (React Native)
- Advanced 3D editing capabilities
- AR/VR blueprint viewing

