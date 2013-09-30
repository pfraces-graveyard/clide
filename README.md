# clide

CLI definitions

# Usage

Define your interface

**greet.js**

```js
#!/usr/bin/env node

var clide = require('clide');

clide({
    'name': 'Name to greet'
}, function (err, props) {
    console.log('Hello' + props.name + '!');
});
```

Use it with command line params

```sh
greet.js --name world
```

> Hello world!

Use it with a configuration file and by-pass prompts

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

Use it without params nor configuration for prompt fallbacks

```sh
# remember to remove configuration if any

greet.js
```

> **Name to greet:** pfraces  
  Hello pfraces!

Common CLI options added for free!

Get help

```sh
greet.js --help
```

Obtain `package.json` version

```sh
greet.js --version
```

> 0.1.0

Use specific config file

```sh
greet.js --config /path/to/config
```

# Installation

```sh
npm install clide
```

# Motivation

I've found myself integrating [optimist][1], [rc][2] and [prompt][3] in my
CLI scripts to define its needed properties and several ways to obtaining them

*  defaults from configuration files
*  override defaults with command line params
*  fallback to prompts

I find this pattern so useful for quick start with your CLI minimals, so let's
write the glue between them for improved laziness

[1]: https://github.com/substack/node-optimist
[2]: https://github.com/dominictarr/rc
[3]: https://github.com/flatiron/prompt
