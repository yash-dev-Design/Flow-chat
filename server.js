const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const path = require("path")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Serve static files
app.use(express.static(path.join(__dirname)))

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Store connected users
const users = new Map()
const typingUsers = new Set()

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Handle user joining
  socket.on("join", (data) => {
    const { username } = data

    // Store user info
    users.set(socket.id, {
      id: socket.id,
      username: username,
      joinedAt: new Date(),
    })

    // Join user to main room
    socket.join("main")

    // Notify user of successful connection
    socket.emit("connected", { username })

    // Broadcast user joined to others
    socket.to("main").emit("user-joined", {
      username,
      timestamp: new Date(),
      userCount: users.size,
    })

    // Send updated user list to all clients
    const userList = Array.from(users.values()).map((user) => ({
      username: user.username,
      id: user.id,
    }))

    io.to("main").emit("users-update", {
      users: userList,
      count: users.size,
    })

    console.log(`${username} joined the chat`)
  })

  // Handle new messages
  socket.on("message", (data) => {
    const user = users.get(socket.id)
    if (!user) return

    // Keep payload compact, but allow optional files array [{name,type,size,dataUrl}]
    const message = {
      id: data.messageId || Date.now() + Math.random(),
      username: user.username,
      text: data.text || "",
      files: Array.isArray(data.files) ? data.files.slice(0, 5) : [],
      timestamp: new Date(),
      messageId: data.messageId,
      threadId: data.threadId || null
    }

    // Broadcast message to all users in main room
    io.to("main").emit("message", message)

    console.log(`Message from ${user.username}: ${data.text}`)
  })

  // Handle message reactions
  socket.on("reaction", (data) => {
    const user = users.get(socket.id)
    if (!user) return

    // Broadcast reaction to all users
    io.to("main").emit("reaction", {
      messageId: data.messageId,
      emoji: data.emoji,
      username: user.username,
      timestamp: new Date()
    })

    console.log(`Reaction from ${user.username}: ${data.emoji} on message ${data.messageId}`)
  })

  // Handle typing indicators
  socket.on("typing", (data) => {
    const user = users.get(socket.id)
    if (!user) return

    typingUsers.add(user.username)

    // Broadcast typing indicator to others
    socket.to("main").emit("user-typing", {
      username: user.username,
      isTyping: true,
    })
  })

  socket.on("stop-typing", (data) => {
    const user = users.get(socket.id)
    if (!user) return

    typingUsers.delete(user.username)

    // Broadcast stop typing to others
    socket.to("main").emit("user-typing", {
      username: user.username,
      isTyping: false,
    })
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    const user = users.get(socket.id)

    if (user) {
      // Remove from typing users
      typingUsers.delete(user.username)

      // Remove user
      users.delete(socket.id)

      // Notify others user left
      socket.to("main").emit("user-left", {
        username: user.username,
        timestamp: new Date(),
        userCount: users.size,
      })

      // Send updated user list
      const userList = Array.from(users.values()).map((u) => ({
        username: u.username,
        id: u.id,
      }))

      io.to("main").emit("users-update", {
        users: userList,
        count: users.size,
      })

      console.log(`${user.username} left the chat`)
    }

    console.log("User disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`)
  console.log(`Open http://localhost:${PORT} in your browser`)
})
