const { Dummy } = require('rabbitmq-common');
const { green } = require('chalk');

const log = console.log;
const dummy = new Dummy();

dummy.print();

log(green('Hello from index.js!'));

