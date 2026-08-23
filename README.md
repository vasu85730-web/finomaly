# Finomaly 
**Finomaly** is a next-generation Continuous Authentication Engine built to eliminate the multi-billion dollar Mule Account crisis. Developed by **Team Hackflux** for **Prasunethon 2.0**, it fingerprints how a verified user types, moves the cursor, and navigates a
form at onboarding, then checks that fingerprint against future sessions —flagging the moment an account changes hands, not just when a transaction looks suspicious. Most fraud detection watches *what* an account does; this watches *who* is operating it. 
Our proprietary Vector Fingerprinting Engine silently monitors user interaction telemetry—such as keystroke flight time, dwell time, and pointer trajectories—to cryptographically lock sessions to the true owner's biological rhythm.
---
##  Team Hackflux
- **Charvi Naresh** (B.Tech BPIT, New Delhi)
- **Dolsi Bajaj** (B.Tech MAIT, New Delhi)
- **Vasu Sharma** (Dual Degree DTU B.Tech & IIT Madras BS)
---
## The problem
Mule accounts pass every transaction-pattern check because the transactions themselves look normal — it's a different person behind the keyboard, not a different kind of transaction. Behavioral biometrics (typing rhythm, cursor dynamics, form navigation) catch that handoff even when the money movement looks clean.
---
##  Key Features
- **Invisible Authentication:** Frictionless security that operates entirely in the background without interrupting the user experience.
- **5-Dimensional Telemetry Capture:** Records and evaluates Dwell Time, Flight Time, Backspace Frequency, Typing Speed, and Pointer Jerkiness.
- **Cosine Similarity Engine:** Normalizes live telemetry into multi-dimensional vectors and uses geometric cosine distance to calculate biometric similarity.
- **Dynamic Tolerance Algorithm:** Accommodates human variances—like rushing or having a "bad day"—to eliminate false positives.
- **Real-Time Mule Detection:** Instantly flags unauthorized operators if their biometric signature significantly deviates from the stored baseline.
---
##  Tech Stack
- **Framework:** Next.js 15 (React)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Logic:** Custom Vector Fingerprinting & Telemetry Collector (TypeScript)
---
##  How It Works (System Architecture)
1. **Phase 1: Telemetry Capture**
   Silent background recording of 45+ interaction variables via JS Event Listeners.
2. **Phase 2: Vector Normalization**
   Mathematical mapping of raw interaction data into a normalized N-dimensional biometric vector.
3. **Phase 3: Cosine Engine**
   Our algorithm computes the Cosine Distance against the baseline to detect structural anomalies in real-time.
---
##  Running the Project Locally
To run the Finomaly prototype on your local machine:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/vasu85730-web/finomaly.git
   cd finomaly
Install dependencies:
bash


npm install
Run the development server:
bash


npm run dev
View the application: Open http://localhost:3000 in your web browser.
 Post-Hackathon Vision (Our Aim)
Finomaly is built to scale. Our post-hackathon roadmap includes subjecting the algorithm to expert reviews, identifying edge-case loopholes, and developing a deployable SDK. Our ultimate goal is to elevate this solution to a national level, protecting banking infrastructure and significantly reducing cybercrimes driven by mule accounts.

3:48 PM
