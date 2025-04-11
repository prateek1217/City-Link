🚍 City‑Link – Real‑Time Bus Tracking & Booking Suite

City‑Link is a full‑stack application that delivers live city‑bus tracking, ETA prediction, schedule management, ticketing and parcel bookings in one place.
The driver shares location once; the backend keeps broadcasting updates via WebSockets while the frontend renders them on Google Maps in real time.

Scales in the wild: City‑Link already serves 1 000 + concurrent real‑time users without breaking a sweat!

✨ Features
Live Tracking – see moving buses on an interactive map

Shortest‑Route & ETA – computes nearest bus to the user and predicts arrival time/delay

Dynamic Schedule – real‑time timetable that adapts to traffic conditions

One‑Tap Ticket & Parcel Booking – reserve seats or send intra‑city parcels instantly

Socket‑Driven Updates – low‑latency location streaming with automatic reconnection

Driver‑Friendly – driver shares location once; system handles the rest

Battle‑Tested Scale – proven to handle 1 k+ simultaneous users and dozens of buses

Scalable Micro Split – separate backend (Node + Socket.io) and frontend (React + Vite)

🗂️ Folder Structure

city-link/
├── city-link-backend/
│   ├── Main-Tracker/          # socket helpers & trackers
│   ├── src/                   # Express controllers & services
│   ├── .env.sample.txt
│   ├── package.json
│   └── ...
└── city-link-frontend/
    ├── public/
    ├── src/                   # React pages, components & hooks
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── ...




🏗️ Tech Stack
Layer	Technology
Frontend	React 18, Vite, Socket.io‑client, Google Maps JS API
Backend	Node.js, Express, Socket.io, REST, JWT auth
Realtime DB*	Redis / in‑memory store for transient coords
Persistent DB	MongoDB / PostgreSQL (choose one)
Dev Tools	ESLint, Prettier, Husky, dotenv

⚙️ Getting Started
1. Clone & Install

git clone https://github.com/<your‑org>/city-link.git
cd city-link

# Backend
cd city-link-backend
cp .env.sample.txt .env            # fill in DB_URI, GOOGLE_API_KEY, JWT_SECRET, etc.
npm install
npm run dev

# In new terminal – Frontend
cd ../city-link-frontend
npm install
npm run dev                         # Vite defaults to http://localhost:5173




2. Expose Driver Socket (optional)
If buses connect from outside your network, forward the backend socket port (default 4000) using ngrok or a cloud load‑balancer:

ngrok http 4000


Update CLIENT_SOCKET_URL in city-link-frontend/.env with the HTTPS ngrok URL.

3. Seed Demo Data (optional)
bash
# inside backend
npm run seed


🚦 Usage
Driver app (or Postman) emits:

{
  "busId": "BUS‑42",
  "coords": { "lat": 28.6139, "lng": 77.2090 }
}


Backend broadcasts busLocation event to all connected clients.

Frontend listens and moves the marker; ETA widget auto‑updates.



🔌 API Reference (abridged)
Method	Endpoint	Purpose
GET	/api/buses	list all active buses
GET	/api/buses/:id/eta	ETA of given bus to user point
POST	/api/bookings	create ticket/parcel booking
WS	busLocation (emit)	push live GPS from driver


🙏 Acknowledgements
Google Maps JavaScript SDK

Socket.io for realtime goodness

Vite for lightning‑fast React builds

Made with ❤️ by Prateek Khandelwal to make daily commutes smarter.

Copyright (Jan 2025 - Present ) All rights are reserved.
