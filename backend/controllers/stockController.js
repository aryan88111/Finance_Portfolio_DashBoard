const { fetchCMP } = require("../services/yahooService");
const { fetchPERatio, fetchLatestEarnings } = require("../services/yahooService");



// .............................// this function gets all stock data     \\.....
exports.getAllStockData = async(req, res) => {
    // ................................static mock data for purchase price and quantity ...........

    const stockMap = {
        "HDFCBANK.NS": { name: "HDFC Bank", purchasePrice: 1600, quantity: 58, sector: "Financials" },
        "BAJFINANCE.NS": { name: "Bajaj Finance", purchasePrice: 6466, quantity: 15, sector: "Financials" },
        "ICICIBANK.NS": { name: "ICICI Bank", purchasePrice: 780, quantity: 84, sector: "Financials" },
        "AFFLE.NS": { name: "Affle India", purchasePrice: 1151, quantity: 50, sector: "Technology" },
        "KPITTECH.NS": { name: "KPIT Tech", purchasePrice: 672, quantity: 61, sector: "Technology" },
        "TATATECH.NS": { name: "Tata Tech", purchasePrice: 1072, quantity: 63, sector: "Technology" },
        "TANLA.NS": { name: "Tanla", purchasePrice: 1134, quantity: 45, sector: "Technology" },
        "DMART.NS": { name: "Dmart", purchasePrice: 3777, quantity: 27, sector: "Consumer Goods" },
        "TATAPOWER.NS": { name: "Tata Power", purchasePrice: 224, quantity: 225, sector: "Energy" },
        "KPIGREEN.NS": { name: "KPI Green", purchasePrice: 875, quantity: 50, sector: "Energy" },
        "SUZLON.NS": { name: "Suzlon", purchasePrice: 44, quantity: 450, sector: "Energy" },
        "GENSOL.NS": { name: "Gensol", purchasePrice: 998, quantity: 45, sector: "Energy" },
        "ASTRAL.NS": { name: "Astral", purchasePrice: 1517, quantity: 56, sector: "Industrial" },
        "POLYCAB.NS": { name: "Polycab", purchasePrice: 2818, quantity: 28, sector: "Industrial" },
        "GRAVITA.NS": { name: "Gravita", purchasePrice: 2037, quantity: 8, sector: "Materials" },
        "SBILIFE.NS": { name: "SBI Life", purchasePrice: 1197, quantity: 49, sector: "Financials" },
        "INFY.NS": { name: "Infosys", purchasePrice: 1400, quantity: 46, sector: "Technology" },
        "EASEMYTRIP.NS": { name: "Easemytrip", purchasePrice: 20, quantity: 1332, sector: "Technology" },
        "TCS.NS": { name: "TCS", purchasePrice: 3200, quantity: 5, sector: "Technology" },
        "LTIM.NS": { name: "LTI Mindtree", purchasePrice: 4775, quantity: 16, sector: "Technology" }
    };

    const stockDataPromises = Object.entries(stockMap).map(async([symbol, stock]) => {
        try {
            /// symbol ==NSE/BSE code


            const cmp = await fetchCMP(symbol); //curr market price <- yahooServices 


            const peRatio = await fetchPERatio(symbol); //peRatio <- googleServices 


            const latestEarnings = await fetchLatestEarnings(symbol); //lstEarning <- googleServices 


            const investment = stock.purchasePrice * stock.quantity;
            const presentValue = cmp * stock.quantity;
            const gainLoss = (presentValue - investment);

            return {
                name: stock.name,
                symbol,
                purchasePrice: stock.purchasePrice,
                quantity: stock.quantity,
                investment,
                cmp,
                presentValue,
                gainLoss,
                peRatio,
                latestEarnings,
                sector: stock.sector,
                portfolioPercentage: 0,
            };
        } catch (error) {
            return {
                name: stock.name,
                symbol,
                error: error.message || "Failed to fetch stock data"
            };
        }
    });

    try {
        const allStockData = await Promise.all(stockDataPromises); // promise for promising to get all the data

        // Calculate total investment for portfolio percentage
        const totalInvestment = allStockData.reduce((total, stock) => {
            return total + (stock.investment || 0);
        }, 0);

        // update portfolio percentage for each stock
        allStockData.forEach(stock => {
            if (totalInvestment > 0) {
                stock.portfolioPercentage = ((stock.investment || 0) / totalInvestment * 100).toFixed(2) + '%';
            } else {
                stock.portfolioPercentage = "0%"; // Handle case where total investment is 0
            }
        });

        res.json(allStockData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch stocks data" });
    }
};