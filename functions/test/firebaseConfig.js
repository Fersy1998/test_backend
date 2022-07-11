const admin= require('firebase-admin');

var serviceAccount = require("./credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:'https://appland-e-commerce-ec53d.firebaseio.com'
});

const db=admin.firestore();

// exports.handler is required by netlify to process.
exports.handler = async (event, context, callback) => {
  // wait for the record to be added
  await db.collection('COLLECTION').add({
    name: 'Test'
  })

  // Return a callback witha 200 response and a message.
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: `Test data added successfully`
    })
  })
}

module.exports={db}