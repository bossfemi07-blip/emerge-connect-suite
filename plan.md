# FemsChat Super App - Master Prototype Phase 2

## Objective
Finalize the FemsChat Super App prototype with full technical alignment to the "Master Architecture & Blueprint". This includes simulating WebRTC calling, enhancing social "Shorts", and providing architectural reference files (Docker, Monorepo structure).

## Technical Additions

### 1. WebRTC & Calling Simulation
- Create `src/pages/Calling.tsx`: A simulation of LiveKit SFU calls.
- Features: Low-bandwidth mode toggle (auto-degrade video), audio-only optimization, and "Connecting..." states.
- Integration: Add call buttons in the Chat list and Chat room.

### 2. Enhanced Social "Shorts"
- Update `src/pages/Feed.tsx` to handle a more immersive "Shorts" experience.
- Implement a simulated vertical swipe (using Framer Motion).
- Add creator metadata and social actions (Like, Share, Music info).

### 3. In-Chat Command Parsing
- Update `src/pages/Chat.tsx` to support the `/pay @user amount` command.
- Trigger a wallet biometric simulation when the command is typed and sent.

### 4. Architectural Reference Files
- Add `docker-compose.yml`: Representing the backend services (NestJS, Kafka, Redis, Postgres).
- Add `README.md`: Explaining the Monorepo strategy and Tech Stack as requested.

### 5. Global State Updates
- Update `useStore.ts` to handle:
  - Active call state (incoming/outgoing).
  - Calling history.
  - Better simulation of "Offline Sync" (batch processing).

### 6. Mobile Optimization Polish
- Refine the `AppShell` with a "Notch" and "Safe Area" feel.
- Improve the "Low Bandwidth" visuals across all pages.
