# TouchGrass AI 🌿

**Plan less. Explore more.**

TouchGrass AI is a privacy-first, offline-first outdoor adventure companion that uses open-weight/open-source AI to get people away from their screens and into the real world. 

The screen is the shortest part of the experience.

## The Problem
We spend too much time staring at screens, mindlessly scrolling, or struggling to come up with ideas for outdoor activities. When we do go outside, we often look down at our phones instead of observing the world. Gamified apps keep us hooked to notifications and metrics.

## The Solution
TouchGrass AI generates a highly personalized, local outdoor adventure based on your time constraints, interests, and fitness level. It creates a map route and a set of "missions" (e.g., "Find a leaf with an unusual texture"). You download the adventure pack, go offline, touch grass, optionally record observations, and return to an AI-generated journal of your excursion.

## Features
- **Local AI Powered**: Supports local LLMs via Ollama for generating personalized missions and journals without sending data to the cloud.
- **Offline First**: Adventures are saved to local storage. You can go completely offline while doing the adventure.
- **Privacy Focus**: Your GPS location is only used to generate the route. It is never permanently stored on servers.
- **Outdoor Mode**: A minimal interface designed to be glanced at and put away.
- **AI Journal Generation**: Synthesizes your journey into a beautiful narrative upon completion.

## Architecture

**Frontend**: React, React Router, Vite, Vanilla CSS. Stores data locally using `localStorage` and `IndexedDB` strategies for offline capabilities.
**Backend**: FastAPI, SQLAlchemy (SQLite), Pydantic. 
**AI Abstraction**: The `AIProvider` interface allows swapping between `OllamaProvider` (local models) and `MockAIProvider` (for demo/hackathon environments without heavy compute).
**Map & Routing**: OpenStreetMap data.

### Why Open-Source AI?
Open-source AI ensures user privacy. An outdoor companion shouldn't upload your precise location, photos, and personal reflections to a closed ecosystem. By using local/open-weight models, TouchGrass AI proves that we can build deeply personalized, magical experiences entirely on the edge, empowering users with data ownership and offline resilience.

## Getting Started

### 1. Backend Setup
Requires Python 3.9+
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
# Run on port 8001 to avoid conflicts with other common services on port 8000
uvicorn main:app --reload --port 8001
```

### 2. Frontend Setup
Requires Node.js 18+
```bash
cd frontend
npm install
npm run dev
```

### 3. Local AI Setup (Ollama)
To run fully offline AI:
1. Install [Ollama](https://ollama.ai/)
2. Run `ollama run llama3` (or `gemma`, `qwen`)
3. In `backend/config.py`, change `AI_PROVIDER = "ollama"` and set your `MODEL_NAME`.

### Demo Mode
If you do not have a local AI or are presenting at a hackathon without internet, leave `AI_PROVIDER = "mock"` in `backend/config.py`. The app will use the `MockAIProvider` to instantly return realistic, formatted adventure data.

## Pitch / Story
*Input*: "I have 30 minutes, I like photography and nature."
*Open AI*: Creates a "Suburban Nature Hunt" with missions to find geometric patterns in plants.
*Routing*: Calculates a 2.5km loop using OpenStreetMap.
*Offline Pack*: Downloaded to device.
*Touch Grass*: User leaves phone in pocket, observes the world.
*Observations*: User takes a photo of an unusual flower.
*Output*: AI generates a journal reflecting on the peaceful 30 minutes spent away from the screen.
