var mongoose = require('mongoose');
var db = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/', {
    authSource: 'admin',
    user: 'logs404',
    pass: 'logs#404',
    dbName: 'EvuaMusic'
}).then(() => {
    console.log('connected to mongodb');
}).catch(err => {
    console.log(err);
})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log(2333);
    var kittySchema = mongoose.Schema({
        name: String
    });
    kittySchema.methods.speak = function () {
        var greeting = this.name
            ? "Meow name is " + this.name
            : "I don't have a name";
        console.log(greeting);
    }
    var Kitten = mongoose.model('Kitten', kittySchema);
    var felyne = new Kitten({ name: 'Felyne' });
    felyne.save(function (err, fluffy) {
        if (err) return console.error(err);
        fluffy.speak();
      });
});

export default mongoose;