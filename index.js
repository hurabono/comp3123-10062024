const express = require('express');

const fs = require('fs');
const path = require('path');


const app = express();
const router = express.Router();
app.use(express.json()); 

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client

[study note]
The current code simply sends the text "This is home router" to the client, so it does not act to provide HTML files.

router.get('/home', (req,res) => {
  res.send('This is home router');
});
*/


router.get('/home', (req,res) => {
  // res.send('This is home router');
  res.sendFile(path.join(__dirname, 'home.html'));
});




/*
- Return all details from user.json file to client as JSON format

[study note]
This /profile route is simply returning a string but we have to read the data 
from the user.json file and return it to the client in JSON format.

router.get('/profile', (req,res) => {
  res.send('This is profile router');
});

*/


router.get('/profile', (req,res) => {
  const jsonPath = path.join(__dirname, 'user.json');

  fs.readFile(jsonPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error500' });
    }
    
    try {
      const jsonData = JSON.parse(data); 
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ message: 'Error500' });
    }
  });

});


/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }


[study note]
I have to receive username and password in JSON format, compare it with the user.json file, and validate it.

router.post('/login', (req,res) => {
  res.send('This is login router');
});

*/

router.post('/login', (req,res) => {
  const { username, password } = req.body;
  const jsonPath = path.join(__dirname, 'user.json');


  fs.readFile(jsonPath, 'utf8', (data) => {

    const users = JSON.parse(data).users;
    const user = users.find(u => u.username === username);
    if (err) {
      return res.status(500).json({ status: false, message: 'Server error 500' });
    }

    if (!user) {

      return res.json({ status: false, message: "User Name is invalid" });

    } else if (user.password !== password) {

      return res.json({ status: false, message: "Password is invalid" });

    } else {

      return res.json({ status: true, message: "User Is valid" });
    }

  });
});

router.get('/login', (req, res) => {
  res.send(`<h1>Login Page</h1>`);
});


/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>


  [study note]
    The current code only returns a simple text response, so it needs to be modified.

    router.get('/logout', (req,res) => {
    res.send('This is logout router');
    });
*/


router.get('/logout', (req,res) => {
  const { username } = req.params;
  res.send(`<b>${username} successfully logout.</b>`);
});




/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"

[study note]
In the this code, the error-handling middleware is simply returning the message "This is error router", 
we have to make returning the 500 error page and the message should be "Server Error".

app.use((err,req,res,next) => {
  res.send('This is error router');
});

app.use('/', router);

app.listen(process.env.port || 8081);

console.log('Web Server is listening at port '+ (process.env.port || 8081));

*/

app.use((err,req,res,next) => {

  console.error(err.stack);
  res.status(500).send('<h1>500 - Server Error</h1>');

});

app.use('/', router);

app.listen(process.env.port || 8080);

console.log('Web Server is listening at port '+ (process.env.port || 8080));