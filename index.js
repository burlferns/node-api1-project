// implement your API here

const express = require("express"); // CommonJS Modules

const db = require("./data/db.js"); // import the database file

const server = express();

server.use(express.json()); // needed to parse JSON from the body

const port = 4000;
server.listen(port, () =>
  console.log(`\n ** API running on port ${port} **\n`)
);


// ***********************************************************************
//For GET "/api/users" 
//Returns an array of all the user objects contained in the database.
server.get("/api/users", (req, res) => {
  // get the list of users from the database
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log("error for find() on database", error);
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});


// ***********************************************************************
//For GET "/api/users/:id" 
//Returns the user object with the specified id.
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  // get the user from the database
  db.findById(id)
    .then(user => {
      // console.log("This is database response:",user);
      if(user) {
        res.status(200).json(user);
      }
      else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }      
    })
    .catch(error => {
      console.log("error for findById() on database", error);
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});


// ***********************************************************************
//For POST "/api/users" 
//Creates a user using the information sent inside the request body
server.post("/api/users", (req, res) => {
  // get the data the client sent
  const userData = req.body; // express does not know how to parse JSON

  //console.log("This is the information to POST from client:",userData);

  if(!userData.name||!userData.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } 
  else {
    //call the db and add the user
    db.insert(userData)
      .then(user => {

        //After the data is added to the database, retrieve it to make sure 
        //it was added to database properly
        db.findById(user.id)
          .then(userCheck => {
            // console.log("This is database response:",user);
            if(userCheck) {
              res.status(201).json(userCheck);
            }
            else {
              res
                .status(500)
                .json({ message: "The user was added to database but could not be retrieved afterwards." });
            }      
          })
          .catch(error => {
            console.log("error for findById() on database", error);
            res
              .status(500)
              .json({ error: "The user was added to database but could not be retrieved afterwards." });
          });
        
      })
      .catch(error => {
        console.log("error for insert() on database", error);
        res
          .status(500)
          .json({ error: "There was an error while saving the user to the database" });
      });
  }  
});


// ***********************************************************************
//For DELETE "/api/users/:id" 
//Removes the user with the specified id and returns the deleted user.
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  // get the user from the database
  db.findById(id)
    .then(user => {
      // console.log("This is database response:",user);
      if(user) {
        

        db.remove(user.id)
          .then(removed => {
            
            //console.log("This is the information from DELETE:",removed);
            if(removed===1) {
              res.status(200).json(user);
            }
            else {
              res
              .status(500)
              .json({ error: "The user could not be removed" });
            }

          })
          .catch(error => {
            console.log("error for remove() on database", error);
            res
              .status(500)
              .json({ error: "The user could not be removed" });
          });


      }
      else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }      
    })
    .catch(error => {
      console.log("error for findById() on database", error);
      res
        .status(500)
        .json({ error: "The user could not be removed" });
    });

});



