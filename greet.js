var clide = require('./clide');

clide({
    syntax: 'greet [OPTIONS]',
    options: {
        'name': 'Name to greet'
    }
}, function (err, def) {
    console.log('Hello ' + def.name + '!');
});
