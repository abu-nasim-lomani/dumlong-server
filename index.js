const express = require('express')
const app = express()
const cors= require('cors');
const bodyParser=require('body-parser');
const objectId=require('mongodb').ObjectID;
require('dotenv').config();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qijdl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });






app.get('/', (req, res) => {
  res.send('Hello World!')
})




client.connect(err => {
  const productCollection = client.db("Dumlong").collection("products");
  const orderCollection = client.db("Dumlong").collection("orders");
  
  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, products) =>{
      res.send(products)
    })
  })

  app.post('/addOrders', (req, res)=>{
    const newOrder= req.body;
    orderCollection.insertOne(newOrder)
    .then(result =>{
      res.send(result.insertedCount>0)
    })
  })

  app.get('/orders', (req, res) => {
    orderCollection.find({email: req.query.email})
    .toArray((err, products) =>{
      res.send(products)
    })
  })

  app.get('/delete/:id', (req, res)=>{
    productCollection.deleteOne({_id: objectId(req.params.id)})
    .then(result=>{
      console.log(result.deletedCount>0)
    })
  })



//   app.delete('/delete/:id', (req, res) => {
//     const id = req.params.id

//     productCollection.findByIdAndDelete(id)
//         .then((result) => {
//             res.status(200).send(result);
//         })
//         .catch((error) => {
//             res.status(500).send(error);
//         })
// });


//  app.delete('/delete/:id', (req, res)=>{
//    const id=ObjectID(req.params.id);
//    console.log('delete this',id);
//    productCollection.findOneAndDelete({_id:id})
//    .then(document =>res.send(!!document.value))
//  })

  


  app.post('/addProducts', (req, res) => {
    const newProduct = req.body;
    console.log("adding new product", newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log("insertedCount: ",result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })
//   client.close();
});



app.listen(port)