import express from "express";
import session from "express-session";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(
  session({
    secret: "super-secret-key", // used to sign the session ID cookie
    resave: false, // don’t save session if nothing changed
    saveUninitialized: false, // don’t create empty sessions
    cookie: { secure: false }, // secure: true only works with https
  })
);

// Fake "database" (in-memory for demo)
const users = [{ id: 1, email: "test@example.com", password: "1234" }];

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Save user info in session
    req.session.userId = user.id;
    res.send("Logged in! Session created.");
  } else {
    res.status(401).send("Invalid email or password");
  }
});

// Protected route
app.get("/dashboard", (req, res) => {
  if (req.session.userId) {
    res.send(`Welcome user ${req.session.userId}, this is your dashboard.`);
  } else {
    res.status(401).send("Please log in first.");
  }
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("Logged out. Session ended.");
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
