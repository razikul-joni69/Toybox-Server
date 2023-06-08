const express = require('express');
const cors = require('cors');
require("dotenv/config")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

        const toysCollection = client.db("toybox").collection("toys")

        app.listen(PORT, () => {
            console.log(`Application listening on port ${PORT}`)
        })

        // INFO: get all toys
        app.get("/api/v1/alltoys", async (req, res) => {
            const result = await toysCollection.find().toArray()
            res.send(result);
        });

        // INFO: get toy by id
        app.get("/api/v1/toy/:id", async (req, res) => {
            const { id } = req.params
            const result = await toysCollection.findOne({ _id: new ObjectId(id) })
            res.send(result);
        });

        // INFO: delete a toy by id
        app.get("/api/v1/deletetoy/:id", async (req, res) => {
            const { id } = req.params
            const result = await toysCollection.deleteOne({ _id: new ObjectId(id) })
            res.send(result);
        });

        // INFO: Add a new toy to the database
        app.post("/api/v1/add-toy", async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await toysCollection.insertOne(newToy)
            res.send(result);
        });


    } catch (err) {
        console.log('Failed to connect database ~ ', err.message)
    }

}

main()