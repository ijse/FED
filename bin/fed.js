#!/usr/bin/env node

var program = require('commander');

var vers = [
  'fed version:\t' + require('../package').version + '\n',
  'serve2 version:\t' +  require('../node_modules/serve2/package').version +  '\n'
];

program
  .version(vers[0])
  .option('-v, --versions', 'output current fed version', function() {
    console.log(vers.join(''));
  })
  .command('server', 'Launch local http service with serve2')

// start parse process.argv
if(process.argv.length <=2 ) {
  program.parse([, 'fed', '-h']);
}

program.parse(process.argv);

