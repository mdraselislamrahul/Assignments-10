const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qij3z3x.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const productCallection = client.db("productDB").collection("product");
        const brandCallection = client.db("brandDB").collection("brand");


        app.get('/product', async(req, res) => {
            const cursor = productCallection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.get('/brand', async(req, res) => {
            const cursor = brandCallection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/brand/:_id', async(req, res) => {
            const _id = req.params._id;
            const query = { _id: new ObjectId(_id) };
            const result = await brandCallection.findOne(query);
            res.send(result)
        })


        app.get('/product/:_id', async(req, res) => {
            const _id = req.params._id;
            const query = { _id: new ObjectId(_id) };
            const result = await productCallection.findOne(query);
            res.send(result)
        })

        app.put('/product/:_id', async(req, res) => {
            const _id = req.params._id;
            const filter = { _id: new ObjectId(_id) }
            const option = { upsert: true };
            const updateProduct = req.body
            const Product = {
                $set: {
                    name: updateProduct.name,
                    brand: updateProduct.brand,
                    type: updateProduct.type,
                    price: updateProduct.price,
                    description: updateProduct.description,
                    Rating: updateProduct.Rating,
                    img: updateProduct.img
                }
            }
            const result = await productCallection.updateOne(filter, Product, option);
            res.send(result)
        })


        app.post('/product', async(req, res) => {
            const nweProduct = req.body;
            console.log(nweProduct);
            const result = await productCallection.insertOne(nweProduct);
            res.send(result)
        })

        app.delete('/product/:_id', async(req, res) => {
            const _id = req.params._id;
            const query = { _id: new ObjectId(_id) }
            const result = await productCallection.deleteOne(query);
            res.send(result)

        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})