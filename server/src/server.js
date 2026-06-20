import app  from "./app.js";
import configDotenv from "dotenv";
import connecDB from "./config/db.js";

configDotenv();
connecDB();

const PORT = process.env.PORT || 4500;

app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    }
    console.log(`Server running on http://localhost:${PORT}`);
});