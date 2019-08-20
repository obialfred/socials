var admin = require("firebase-admin");
const functions = require('firebase-functions');

var serviceAccount = require("./socials-3863a-firebase-adminsdk-bjcsy-a162345e7c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socials-3863a.firebaseio.com"
});

const express = require('express');
const app = express();



app.get('/posts',(req, res) => {
    admin.firestore().collection('posts').orderBy('createdAt', 'desc').get().then(data => {
        let posts = [];
        data.forEach((doc) => {
            posts.push({
                postId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            });
        });
        return res.json(posts);
    })
    .catch(err => console.error(error));
})

// exports.getPosts = functions.https.onRequest((req, res)=> {
  

// });

app.post('/posts',(req, res) => {
    const newPost = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    admin.firestore().collection('posts').add(newPost).then((doc) => {
        res.json({message: `document ${doc.id} created sucessfully`});
    }).catch((err) => {
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
    })

});

exports.api = functions.https.onRequest(app);