const functions = require("firebase-functions");

const express=require('express');
const app=express();

const cors=require('cors');

/*
app.get('/hello-world', (req,res)=>{
    return res.status(200).json({message:'Hello world'});

})*/
//CORS
app.use(cors());

app.use(require('./routes/products.routes'));

exports.app=functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
