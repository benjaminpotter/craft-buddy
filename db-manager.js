var url = "mongodb://localhost:27017/mydb";
var mongoClient = require('mongodb').MongoClient;\

var pushDoc = function(guild=Guild('')) {   

    if(guild.id == undefined)
        return;
    
    mongoClient.connect(url, function(err, db) {
        var dbo = db.db("mydb");

        var query = { id: guild.id };
        dbo.collection('guilds').find(query).toArray(function(err, result) {
            if (err) throw err;

            if (result.length == 0) {
                dbo.collection('guilds').insertOne( guild, function(err, res) {
                    if (err) console.log(err);

                    console.log('inserted guild with id: ' + guild.servers);

                    db.close();
                });
            } else {

                // UPDATE THE INFORMATION

            }

            db.close();
        });
    });
};