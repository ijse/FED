#!/usr/bin/env node

var program = require('commander');

var serve2 = require('../lib/serve2.js');

var vers = [
  'fed version:\t', require('../package').version, '\n',
  'serve2 version:\t', require('../node_modules/serve2/package').version, '\n'
].join('');

program
  .version(vers);

// fed server
program
  .command('server')
  .description('Launch local http service with serve2')
  .allowUnknownOption()
  .option('-h, --help', 'show help', serve2.showHelp)
  .option('    --view-root <viewRoot>', 'freemarker templates root folder')
  .action(serve2.start.bind(null, function() {
    console.log('Server start at port %s in dir %s. ', this.port, this.path)
  }));

program
  .command('version', 'show current fed version')

// Provide a more friendly help command
program
  .command('help [cmd]')
  .description('output usage information')
  .action(function(cmd) {
    if(typeof cmd === 'string') {
      program.parse([, 'fed', cmd, '-h']);
    } else {
      program.parse([, 'fed', '-h']);
    }
  });


// start parse process.argv
if(process.argv.length <=2 ) {
  program.parse([, 'fed', '-h']);
}

program.parse(process.argv);

