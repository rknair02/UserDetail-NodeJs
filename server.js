// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")

//to parse incoming requests
var bodyParser = require("body-parser");

//app using the body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 3000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
//get all users
app.get("/api/users", (req, res, next) => {
    var sql = "select * from users"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

//get single user by id
app.get("/api/user/:id", (req, res, next) => {
    var sql = "select * from users where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});


//post request to create a user
app.post("/api/user/", (req, res, next) => {
    var errors=[]
    if (!req.body.first_name){
        errors.push("No first_name found specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (!req.body.last_name){
        errors.push("No last_name specified");

    }
    if (!req.body.birthDate){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        first_name: req.body.first_name,
        email: req.body.email,
        last_name : req.body.last_name,
        birthDate : req.body.birthDate,
        gender : req.body.gender,
        hobbies : req.body.hobbies
    }
    var sql ='INSERT INTO users (first_name, last_name, gender,birth_date,email,hobbies) VALUES (?,?,?,?,?,?)'
    var params =[data.first_name, data.last_name, data.gender,data.birthDate,data.email,data.hobbies]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

app.patch("/api/user/update/:id", (req, res, next) => {
    var data = {
        first_name: req.body.first_name,
        last_name : req.body.last_name,
        email: req.body.email,
       
        birth_date : req.body.birthDate,
        gender : req.body.gender,
        hobbies : req.body.hobbies
    }
    var sql = `UPDATE users SET 
    first_name= COALESCE(?,first_name),
    last_name= COALESCE(?,last_name),
    gender= COALESCE(?,gender),
    birth_date= COALESCE(?,birth_date),
    email= COALESCE(?,email),
    hobbies= COALESCE(?,hobbies)
     WHERE id = ?`
     var params =[data.first_name, data.last_name, data.gender,data.birth_date,data.email,data.hobbies,req.params.id]
    db.run(sql,params,function (err, result) {
            if (err){
                console.log(data.first_name, data.last_name, data.gender,data.birthDate,data.email,data.hobbies,req.params.id)
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})


app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM users WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})
// Default response for any other request
app.use(function(req, res){
    res.status(404);
});
