const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

app.use(bodyParser.json());
app.use(cors());

////////// connecting with mongo //////////////

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@volunteercluster-shard-00-00.7aoxs.mongodb.net:27017,volunteercluster-shard-00-01.7aoxs.mongodb.net:27017,volunteercluster-shard-00-02.7aoxs.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-qdvpgl-shard-0&authSource=admin&retryWrites=true&w=majority`;
//////////// Add to Database /////////////////////
MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
  const fieldsCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECTION2);

  app.post("/addToDatabase", (req, res) => {
    const fields = req.body;
    fieldsCollection.insertMany(fields).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });
  app.post("/createNewEvent", (req, res) => {
    const field = req.body;
    fieldsCollection.insertOne(field).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  app.get("/eventFields", (req, res) => {
    fieldsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

////////// events add to mongo //////////////

MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, client) {
  const productsCollection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLLECTION);

  app.post("/addEvents", (req, res) => {
    const events = req.body;
    productsCollection.insertOne(events).then(result => {
      res.send(result);
      console.log(result.insertedCount);
    });
  });

  app.get("/getEvents", (req, res) => {
    productsCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/allEvents", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    productsCollection
      .deleteOne({
        _id: ObjectId(req.params.id),
      })
      .then(result => {
        res.send(result);
        console.log(result.deletedCount);
      });
  });
});

////////// connecting with mongo  end //////////////

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(process.env.PORT || 8080, () =>
  console.log("I am listening from 8080")
);

////////////////////////////////////////////
