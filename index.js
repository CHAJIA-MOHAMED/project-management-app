const express = require("express");

const app = express();
const PORT = 3333;

app.use(express.json());

// ---- Users Mock ----
const users = [
  { id: 1, email: "test@email.com", password: "123" },
  { id: 2, email: "user@site.com", password: "0000" }
];

// ---- Login Route ----
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Champs obligatoires
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      error: "Email et password obligé "
    });
  }

  // Vérifier utilisateur
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({
      status: 401,
      error: "Email incorrect"
    });
  }

  // Vérifier password
  if (user.password !== password) {
    return res.status(401).json({
      status: 401,
      error: "Password incorrect"
    });
  }

  // Succès Login
  return res.status(400).json({
    status: 400,
    message: "Connexion réussie ",
    user: {
      id: user.id,
      email: user.email
    }
  });
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});

