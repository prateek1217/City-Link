🚍 City‑Link – Real‑Time Bus Tracking & Booking Suite

City‑Link is a full‑stack application that delivers live city‑bus tracking, ETA prediction, schedule management, ticketing and parcel bookings in one place.
The driver shares location once; the backend keeps broadcasting updates via WebSockets while the frontend renders them on Google Maps in real time.


![image](https://github.com/user-attachments/assets/584703f9-62ec-4b27-bd16-bdf4cdc28339)




✨ Features
Live Tracking – see moving buses on an interactive map

![image](https://github.com/user-attachments/assets/f6fd62d7-bcba-437a-a310-622b6118544a)



Shortest‑Route & ETA – computes nearest bus to the user and predicts arrival time/delay

Dynamic Schedule – real‑time timetable that adapts to traffic conditions

One‑Tap Ticket & Parcel Booking – reserve seats or send intra‑city parcels instantly

Socket‑Driven Updates – low‑latency location streaming with automatic reconnection

Driver‑Friendly – driver shares location once; system handles the rest




![image](https://github.com/user-attachments/assets/428c6188-9508-4be4-918c-e0eb92c3b8b5)


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
Persistent DB	MongoDB 


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




2. Expose Driver Socket 
If buses connect from outside the network, forward the backend socket port (default 4000) using ngrok or a cloud load‑balancer:

ngrok http 4000


Update CLIENT_SOCKET_URL in city-link-frontend/.env with the HTTPS ngrok URL.

3. Seed Demo Data 
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
