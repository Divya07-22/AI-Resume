# AI Resume Builder — Build Track (Project 3)

A premium, high-fidelity resume building substrate built within the **KodNest Premium Build System**. This project focuses on a strict, minimalist design philosophy ("Calm, Intentional, Coherent") and a sequential, artifact-driven build process.

## 🎨 Design Philosophy
- **Oxblood Palette**: Minimalist aesthetic using `#8B0000` accents on a `#F7F6F3` background.
- **Typography**: Sophisticated pairing of `'Playfair Display'` (Serif) for headings and `'Inter'` (Sans-serif) for body text.
- **Geometry**: Strict adherence to an 8px spacing scale (8/16/24/40/64px).

## 🛠️ System Architecture
The project is implemented as an 8-step build track with a mandatory sequential gating system:

1.  **01 Problem**: Identifying the core challenges in resume building.
2.  **02 Market**: Analyzing the competitive landscape.
3.  **03 Architecture**: Designing the system components.
4.  **04 HLD**: High-Level Design of the engine.
5.  **05 LLD**: Low-Level Design and data modeling.
6.  **06 Build**: Implementation phase.
7.  **07 Test**: Quality assurance and validation.
8.  **08 Ship**: Final preparation for deployment.
9.  **Proof Hub**: Final validation and artifact aggregation.

## 🚀 Key Features
- **Sequential Gating**: Users cannot skip steps; each step requires an artifact "upload" (simulated via local storage) to unlock the next.
- **Dynamic Build Panel**: Integrated workspace for Lovable prompt generation and quick-copy utilities.
- **Verification Engine**: Built-in 5-point design verification checklist to ensure high-quality UI/UX standards.
- **Proof of Authenticity**: Generates a formatted submission report with Lovable, GitHub, and Deployment links.

## 💻 Tech Stack
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM (Gated Routes)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with CSS Variables (Design Tokens)

## 🏗️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Divya07-22/AI-Resume.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---
*Created within the KodNest Premium Build System.*
