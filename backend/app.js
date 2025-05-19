const express = require("express");
const cors = require("cors");
const stockRoutes = require("./routes/stockRoutes");
const { getAllStockData } = require("../controllers/stockController");




const app = express();
app.use(cors());
app.use(express.json());





app.use("/api/stocks", stockRoutes);
app.use("/", stockController);


const PORT =  5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
