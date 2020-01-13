const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db_name = path.join(__dirname, "data", "apptest2.db");

let db = new sqlite3.Database(db_name, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log("Successful connection to the database 'apptest.db'");
        db.run(`CREATE TABLE users (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            gender VARCHAR(100) ,
            birth_date VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            hobbies VARCHAR(100),
            creation_datetime datetime DEFAULT CURRENT_TIMESTAMP
          )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO users (first_name, last_name, gender,birth_date,email,hobbies) VALUES (?,?,?,?,?,?)'
                db.run(insert, ['Radhakrishnan', 'Nair', 'Male','01/07/1988','rk@gmail.com','cooking,reading'])
                db.run(insert, ['Anupama', 'Nair', 'Female','01/07/1988','rk@gmail.com','cooking'])
                db.run(insert, ['Syamala', 'Nair', 'Female','01/07/1988','rk@gmail.com','cooking'])
            }
        });  
    }
});




module.exports = db
