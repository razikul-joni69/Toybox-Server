const express = require('express');
const cors = require('cors');
require("dotenv/config")
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

//Parse Data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function main() {
    try {
        await client.connect();
        console.log('Database connection established')

        const toys = client.db("toybox").collection("toys")

        app.listen(PORT, () => {
            console.log(`Application listening on port ${PORT}`)
        })

        app.get("/api/v1/alltoys", async (req, res) => {
            const result = await toys.find().toArray()
            res.send(result);
        });

    } catch (err) {
        console.log('Failed to connect database ~ ', err.message)
    }

}

main()