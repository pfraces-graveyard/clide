var optimist = require('optimist'),
    rc = require('rc'),
    prompt = require('prompt'),
    merge = require('lodash.merge'),
    fs = require('fs');

var clide = function (definition, callback) {
    var package = JSON.parse(fs.readFileSync(__dirname + '/package.json'));

    // get defaults from configuration file
    var config = rc(package.name);

    // add default options to the definition
    var options = defaultOptions(optimist);
    options = parseDefinition(definition, options);
    defaultBehaviors(options, package.version);

    // override defaults with command line params
    merge(config, options.argv);

    // fallback to prompts
    promptFallbacks(config, Object.keys(definition), callback);
};

/**
 * parseDefinition
 *
 * Return an optimist object with the user options
 */
var parseDefinition = function (definition, options) {
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
 * defaultOptions
 *
 * Common CLI options:
 *
 * * help
 * * version
 */
var defaultOptions = function (options) {
    return options
        .usage('$0 [OPTIONS]')
        .option('h', {
            alias: 'help',
            describe: 'Show this help'
        })
        .option('v', {
            alias: 'version',
            describe: 'Show version'
        });
};

/**
 * defaultBehaivors
 *
 * What to do when a common option is used
 */
var defaultBehaviors = function (options, version) {
    var argv = options.argv;

    if (argv.help) {
        options.showHelp();
        process.exit();
    }

    if (argv.version) {
        console.log(version);
        process.exit();
    }
};

/**
 * promptFallbacks
 *
 * Prompt for required but not passed params
 */
var promptFallbacks = function (override, prompts, callback) {
    prompt.message = '';
    prompt.delimiter = '';

    prompt.override = override;
    prompt.start();

    prompt.get(prompts, callback);
};

module.exports = clide;
