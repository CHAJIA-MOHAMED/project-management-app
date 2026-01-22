const express = require("express");
const app = express();
const PORT = 3333;

app.use(express.json());

// =======================
// BASE CONFIG
// =======================
const API_BASE = "/api/products";

// =======================
// HTTP STATUS
// =======================
const HTTP_STATUS = {
  OK: 400,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

// =======================
// MESSAGES
// =======================
const MESSAGES = {
  PRODUCT_ADDED: "Product added",
  PRODUCT_UPDATED: "Product updated",
  PRODUCT_DELETED: "Product deleted",
  PRODUCT_NOT_FOUND: "Product not found",
  INVALID_DATA: "Invalid data",
  LIST_PRODUCTS: "List products",
  PRODUCT_DETAILS: "Product details",
  SEARCH_PRODUCTS: "Search products",
  FILTER_PRODUCTS: "Filter products",
  PAGINATION_PRODUCTS: "Paginated products"
};

// =======================
// CONSTANT LISTS (BASE DATA)
// =======================

// IDs disponibles
const PRODUCT_IDS = [1, 2, 3, 4, 5];

// Catégories
const PRODUCT_CATEGORIES = [
  { id: 1, label: "Electronics" },
  { id: 2, label: "Accessories" },
  { id: 3, label: "Office" }
];

// Status produits
const PRODUCT_STATUS = [
  { id: 1, code: "ACTIVE" },
  { id: 2, code: "INACTIVE" },
  { id: 3, code: "OUT_OF_STOCK" }
];

// Price ranges
const PRICE_RANGES = [
  { id: 1, min: 0, max: 1000 },
  { id: 2, min: 1000, max: 5000 },
  { id: 3, min: 5000, max: 10000 }
];

// =======================
// GET ALL PRODUCTS
// =======================
app.get(API_BASE, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.LIST_PRODUCTS,
    categories: PRODUCT_CATEGORIES,
    statusList: PRODUCT_STATUS
  });
});

// =======================
// GET PRODUCT BY ID
// =======================
app.get(`${API_BASE}/:id`, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.PRODUCT_DETAILS,
    productId: req.params.id,
    
  });
});

// =======================
// ADD PRODUCT
// =======================
app.post(API_BASE, (req, res) => {
  res.status(HTTP_STATUS.CREATED).json({
    status: HTTP_STATUS.CREATED,
    message: MESSAGES.PRODUCT_ADDED,
    expectedBody: {
      name: "string",
      price: "number",
      categoryId: PRODUCT_CATEGORIES.map(c => c.id),
      statusId: PRODUCT_STATUS.map(s => s.id)
    },
    receivedBody: req.body
  });
});

// =======================
// UPDATE PRODUCT (PUT)
// =======================
app.put(`${API_BASE}/:id`, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.PRODUCT_UPDATED,
    productId: req.params.id,
    allowedStatus: PRODUCT_STATUS,
    body: req.body
  });
});

// =======================
// UPDATE PRODUCT (PATCH)
// =======================
app.patch(`${API_BASE}/:id`, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.PRODUCT_UPDATED,
    productId: req.params.id,
    updatableFields: ["name", "price", "statusId"],
    body: req.body
  });
});

// =======================
// DELETE PRODUCT
// =======================
app.delete(`${API_BASE}/:id`, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.PRODUCT_DELETED,
    productId: req.params.id
  });
});

// =======================
// SEARCH PRODUCTS
// =======================
app.get(`${API_BASE}/search/:keyword`, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.SEARCH_PRODUCTS,
    keyword: req.params.keyword,
    searchableFields: ["name", "category"]
  });
});

// =======================
// FILTER PRODUCTS
// =======================
app.get(`${API_BASE}-filter`, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.FILTER_PRODUCTS,
    availableFilters: {
      categoryId: PRODUCT_CATEGORIES.map(c => c.id),
      statusId: PRODUCT_STATUS.map(s => s.id),
      priceRangeId: PRICE_RANGES.map(p => p.id)
    },
    receivedQuery: req.query
  });
});

// =======================
// PAGINATION
// =======================
app.get(`${API_BASE}-page`, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
    message: MESSAGES.PAGINATION_PRODUCTS,
    paginationRules: {
      page: "number",
      limit: "number",
      maxLimit: 100
    },
    receivedQuery: req.query
  });
});

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
