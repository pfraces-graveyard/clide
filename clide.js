var optimist = require('optimist'),
    rc = require('rc'),
    prompt = require('prompt'),
    merge = require('lodash.merge'),
    fs = require('fs');

var clide = function (definition, callback) {
    var package = JSON.parse(fs.readFileSync(__dirname + '/package.json'));

    // add builtin options to the definition
    var builtin = builtinOptions(optimist),
        options = definitionOptions(definition, builtin);

    var configFile = builtinBehaviors(options, package.version);

    // get defaults from configuration file
    var config;

    if (configFile) {
        config = JSON.parse(fs.readFileSync(configFile));
    } else {
        config = rc(package.name);
    }

    // override defaults with command line params
    merge(config, options.argv);

    // fallback to prompts
    promptFallbacks(config, definition, callback);
};

/**
 * definitionOptions
 *
 * Return an optimist object with the user options
 */
var definitionOptions = function (definition, options) {
    for (var key in definition) {
        if (definition.hasOwnProperty(key)) {
            options = options
                .option(key[0], {
                    alias: key,
                    describe: definition[key]
                });
        }
    }

    return options;
};

/**
 * builtinOptions
 *
 * Common CLI options:
 *
 * * help
 * * version
 */
var builtinOptions = function (options) {
    return options
        .usage('$0 [OPTIONS]')
        .option('h', {
            alias: 'help',
            describe: 'Show this help'
        })
        .option('v', {
            alias: 'version',
            describe: 'Show version'
        })
        .option('c', {
            alias: 'config',
            describe: 'Config file to use'
        });
};

/**
 * defaultBehaivors
 *
 * What to do when a common option is used
 */
var builtinBehaviors = function (options, version) {
    var argv = options.argv;

    if (argv.help) {
        options.showHelp();
        process.exit();
    }

    if (argv.version) {
        console.log(version);
        process.exit();
    }

    if (argv.config) {
        return argv.config;
    }
};

/**
 * promptFallbacks
 *
 * Prompt for required but not passed params
 */
var promptFallbacks = function (override, definition, callback) {
    var schema = { properties: {} };

    for (var key in definition) {
        if (definition.hasOwnProperty(key)) {
            schema.properties[key] = {
                description: definition[key] + ':'
            };
        }
    }
    
    prompt.message = '';
    prompt.delimiter = '';

    prompt.override = override;
    prompt.start();

    prompt.get(schema, callback);
};

module.exports = clide;
