const express = require("express");
const app = express();
//  const ObjectID = require('mongodb').ObjectID;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectId;
// const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();
const PORT = process.env.PORT || 5000;
app.use(cors());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktoki.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const memesCollection = client.db("meme").collection("memes");
  // const linkMemesCollection = client.db("meme").collection("linkMemes");

  app.post("/addMeme", (req, res) => {
    const newMeme = req.body;
    memesCollection.insertOne(newMeme).then((result) => {
      res.send(result.insertCount > 0);
    });
  });

  app.get("/memes", (req, res) => {
    memesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
    console.log("SUCCESSFULLY DONE");
  });
  app.delete("/deleteMemes/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    memesCollection.deleteOne({ _id: id }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("hello from db it's working");
});

app.listen(PORT);
