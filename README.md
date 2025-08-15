# 💬 Real-Time Chat Application

A modern, fast, and responsive **real-time chat application** built with cutting-edge web technologies.  
Supports **private chats, group conversations, live typing indicators, message history, and media sharing** — all with a clean and minimal UI.

---

## 🚀 Features

- **Real-Time Messaging** – Instant send & receive using WebSockets / Socket.io  
- **Group Conversations** – Create, join, and manage multiple chat rooms  
- **Private Messaging** – Secure one-on-one communication  
- **Typing Indicators** – See when someone is typing in real-time  
- **Message Status** – Delivered / Seen indicators  
- **Media Support** – Send images, GIFs, and files  
- **User Authentication** – Sign up, log in, and manage your profile  
- **Responsive UI** – Works on desktop, tablet, and mobile  
- **Dark / Light Theme** – Switch between themes seamlessly  

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- React.js / Next.js (Optional)
- Tailwind CSS / SCSS for styling

**Backend:**
- Node.js with Express.js
- Socket.io for real-time communication
- MongoDB / Firebase for data storage

**Other Tools:**
- JWT Authentication
- Cloudinary / Firebase Storage for media

---

## 📂 Project Structure
chat-app/
│── client/ # Frontend code
│ ├── public/ # Static files
│ ├── src/ # Components, pages, hooks
│
│── server/ # Backend code
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ ├── sockets/ # Socket.io event handlers
│
│── .env.example # Environment variables template
│── package.json
│── README.md


---

## ⚡ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url

# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start

