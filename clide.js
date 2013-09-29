var optimist = require('optimist'),
    rc = require('rc'),
    prompt = require('prompt'),
    fs = require('fs');

var clide = function (def, callback) {
    // defaults through configuration files
    var package = JSON.parse(fs.readFileSync(__dirname + '/package.json')),
        config = rc(package.name);

    // override defaults through command line params
    var usage = optimist.usage(def.syntax)
    parseDefinition(def, cliCommons(package.version, usage));

    // fallback to prompts
    promptFallbacks(config, Object.keys(def.options), callback);
};

/**
 * parseDefinition
 *
 * Augments the optimist definition from the clide definition
 */
var parseDefinition = function (clide, optimist) {
    var options = clide.options;
    optimist = optimist.usage(clide.syntax);

    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            optimist = optimist
                .option(key[0], {
                    alias: key,
                    describe: options[key]
                });
        }
    }
};

/**
 * cliCommons
 *
 * Common CLI options:
 *
 * * help
 * * version
 */
var cliCommons = function (version, usage) {
    var opts = usage
        .option('h', {
            alias: 'help',
            describe: 'Show this help'
        })
        .option('v', {
            alias: 'version',
            describe: 'Show version'
        });

    var args = opts.argv;

    if (args.version) {
        console.log(version);
    }

    if (args.help) {
        console.log(opts.showHelp());
    }

    return opts;
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
