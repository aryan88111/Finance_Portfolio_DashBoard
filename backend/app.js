const express = require("express");
const cors = require("cors");
const stockRoutes = require("./routes/stockRoutes");
const { getAllStockData } = require("../controllers/stockController");
const apicache = require("apicache");

const rateLimit = require('express-rate-limit');




let cache = apicache.middleware

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 10 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.

})



const app = express();
app.use(cors());
app.use(express.json());





app.use("/api/stocks", stockRoutes);
app.use("/", limiter, cache('15 seconds'), stockController);


const PORT =  5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
