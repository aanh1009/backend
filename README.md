Project summary: ocrItemExtraction is a lightweight Node/Express back‑end that turns receipt photos into structured “items + price” rows. It marries Tesseract.js OCR with a simple REST API, stores results per‑user in MongoDB via Mongoose, and keeps stateful sessions in MongoDB using express‑session + connect‑mongo. While the repo is still work‑in‑progress (no front‑end yet and rough edges such as a small schema typo), it already lets you: ➊ create a throw‑away username, ➋ upload an image, ➌ extract every text line that contains a dollar sign, ➍ list or delete your extracted lines—all in <50 LOC of routing code. Below is a drop‑in README.md you can paste at the repo root and evolve as the project grows.

✨ Features
OCR with Tesseract.js – runs entirely in Node, recognises 100+ languages; English trained‑data bundled. 
Tesseract
GitHub

File uploads via Multer – handles multipart/form‑data in memory for speed. 
npm

Express REST API – minimal, fast HTTP layer. 
Express

Session‑aware multi‑user flow – express‑session stores session IDs, connect‑mongo persists them in the same Atlas/cluster. 
Express
GitHub

MongoDB + Mongoose models – User and Task collections with lean schemas. 
Mongoose

Five ready‑made endpoints (see API Reference). 
GitHub

One‑command dev startup with nodemon. 
GitHub

🏗️ Architecture at a glance
arduino
Copy
Edit
┌────────────┐  POST /extract-text  ┌──────────────┐     ┌──────────────┐
│  Frontend  │ ───────────────────▶ │  Express API │ ──▶ │  Tesseract.js │
└────────────┘       image          └──────────────┘     └──────────────┘
        ▲                                  │ save items
        └──────────── GET /… ──────────────┘
                                         MongoDB Atlas
                                    (Users, Tasks, Sessions)
server.js boots Express, CORS, sessions and mounts routes/ocrRoutes.js. 
GitHub

routes/ocrRoutes.js contains login + CRUD/OCR logic in ~90 LOC. 
GitHub

database/ defines user.js, task.js; both simple Mongoose schemas. 
GitHub
GitHub

🚀 Quick start
1. Prerequisites

Tool	Tested version
Node.js	≥ 18
npm / yarn	latest
MongoDB	local or Atlas cluster
eng.traineddata	already in repo (English)
2. Clone + install
bash
Copy
Edit
git clone https://github.com/aanh1009/ocrItemExtraction.git
cd ocrItemExtraction
npm install       # pulls express, multer, tesseract.js, etc.
Note: if you add deps (express, tesseract.js…) remember to save them in package.json.

3. Environment vars
Create .env:

env
Copy
Edit
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.abcde.mongodb.net/ocr?retryWrites=true&w=majority
SECRET_KEY=super‑secret‑string
See MongoDB’s URI format docs for details. 
MongoDB

4. Run
bash
Copy
Edit
npm run dev       # nodemon auto‑reloads
# server on http://localhost:5000
🔌 API Reference

Method	Endpoint	Body / Params	Purpose
POST	/api/login	{ "username": "alice" }	Creates (or fetches) a user, starts session.
POST	/api/extract-text	multipart/form-data with image field	OCR the image, return lines containing “$”.
GET	/api/get-extracted	–	List items saved under current session.
DELETE	/api/delete-item/:id	–	Delete one item by Mongo _id.
DELETE	/api/delete-all	–	Purge all items for current user.
Returned JSON formats can be found directly in the route handlers. 
GitHub

🗂️ Folder structure
pgsql
Copy
Edit
.
├─ database/
│  ├─ task.js        # Item schema
│  └─ user.js        # User schema
├─ routes/
│  └─ ocrRoutes.js   # All endpoints
├─ eng.traineddata   # OCR language data
├─ server.js         # App entry point
└─ package.json
🛣️ Roadmap
 Fix typo moongoose → mongoose in user.js.

 Add proper authentication (JWT or Clerk) instead of throw‑away username.

 Front‑end React demo (drag‑and‑drop, list view).

 Better item parsing (regex for currency symbols, totals).

 Dockerfile + GitHub Actions CI.

🤝 Contributing
Fork → create feature branch (git checkout -b feature/foo)

Commit with conventional commits.

Open PR; ensure linter passes.

🔒 License
MIT – see LICENSE (to be added).

