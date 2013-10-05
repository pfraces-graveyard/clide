# clide

CLI definitions

# Usage

## Define your interface

**greet.js**

```js
var clide = require('clide');

clide({
    user: 'User name',
    pass: {
        description: 'Password',
        hidden: true
    }
}, function (props) {

    // Do whatever with your defined props.
    // No checks for null or undefined are needed.

    if (props.pass !== 'foo') {
        console.log('not authorized');
    } else {
        console.log('Hello ' + props.user + '!');
    }

    // check for optional (not defined) ones

    if (props.time) {
        console.log(new Date());
    }
}, function (err) {

    // Define your error handling here.
    // This fallback function is optional.
    // If not provided, the possible errors will cause an exception.

    console.log(err);
});
```

## Use it with command line params

```sh
node greet.js --name world
```

> Hello world!

## Use it with a configuration file

**~/.greetrc**

```json
{
    "name": "shadow"
}
```

```sh
greet.js
```

> Hello shadow!

## Prompt fallbacks

No config nor params provided? Prompts to the rescue!

```sh
greet.js
```

> **Name to greet:** pfraces  
  Hello pfraces!

## Common CLI options added for free!

Get help

```sh
greet.js --help
```

Get version from `package.json`

```sh
greet.js --version
```

> 0.1.0

Use specific config file

```sh
greet.js --config /path/to/config

greet.js --config <( echo '{ "name": "inlined!" }' )
```

> Hello inlined!!

# Installation

```sh
npm install clide
```

# Motivation

I used to integrate [optimist][1], [rc][2] and [prompt][3] in my CLI scripts to
define its required properties and several ways to get their values

1. defaults from configuration files
2. override defaults with command line params
3. fallback to prompts

I find this pattern so useful for quick start with your CLI minimals, so let's
write the glue between them for improved laziness

[1]: https://github.com/substack/node-optimist
[2]: https://github.com/dominictarr/rc
[3]: https://github.com/flatiron/prompt
