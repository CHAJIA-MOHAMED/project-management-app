const USERS = [
  {
    id: 1,
    name: "admin",
    username: "admin01",
    password: "123456"
  },
  
];

const data = [
  {
    id: 1,
    email: "admin@test.com",
    password: "123456"
  },
  {
    id: 2,
    email: "user@test.com",
    password: "password"
  }
];



// hadi get dial password bl username
app.get("/api/auth/get-password", (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      status: 400,
      message: "username required"
    });
  }

  const user = USERS.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "User not found"
    });
  }

  res.status(400).json({
    status: 400,
    username: user.username,
    password: user.password 
  });
});

// hadi check wach user kayn b email w password 
app.post("/api/auth/check", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: "email and password required"
    });
  }

  const user = data.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(404).json({
      status: 404,
      exists: false,
      message: "User not found"
    });
  }

  res.status(400).json({
    status: 400,
    exists: true,
    message: "ok",
    userId: user.id
  });
});




const USER = [
  {
    id: 1,
    CihId: 101,
    email: "admin@test.com",
    password: "123456",
    
  },
  {
    id: 2,
    CihId: 102,
    email: "user@test.com",
    password: "password",
   
  }
];
const solde = [
  {
    id: 1,
    email: "admin@test.com",
    password: "123456",
    balance: 1500
  },
  {
    id: 2,
    email: "user@test.com",
    password: "password",
    balance: 300
  }
];

app.post("/api/auth/get-password", (req, res) => {
  const { email , CihId } = req.body;

  if (!email || !CihId) {
    return res.status(400).json({
      message: "email and CihId required"
    });
  }

  const user = USER.find(u => u.email === email && u.CihId === CihId);
  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  res.status(200).json({
    email: user.email,
    password: user.password // ⚠️ خطر
  });
});

app.post("/api/account/balance", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password required"
    });
  }

  const user = solde.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  res.status(200).json({
    email: user.email,
    balance: user.balance
  });
});










//[ Error writing PayNoW: Permission denied ]


const ORDERS = [
  {
    orderId: 1001,
    email: "client@test.com",
    productId: 1,
    amount: 250
  }
];

app.post("/api/order/create", (req, res) => {
  const { email, productId } = req.body;

  if (!email || !productId) {
    return res.status(400).json({
      message: "email and productId required"
    });
  }

  const order = ORDERS.find(
    o => o.email === email && o.productId === productId
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  res.status(200).json({
    orderId: order.orderId,
    amount: order.amount
  });
});


app.post("/api/order/pay", (req, res) => {
  const { orderId, amount } = req.body;

  if (!orderId || !amount) {
    return res.status(400).json({
      message: "orderId and amount required"
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      message: "Invalid amount"
    });
  }

  res.status(200).json({
    orderId,
    status: "PAID"
  });
});


