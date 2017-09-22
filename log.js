const _ = require('lodash');

const log = (...args) => {
  const fArgs = _.map(args, JSON.stringify).join(' ');
  require('fs').appendFileSync(
    `${__dirname}/log.txt`,
    `${new Date()}: ${fArgs}\n`
  );
};
const logFinished = () => {
  require('fs').appendFileSync(`${__dirname}/log.txt`, `${new Date()}: finished\n\n`)
}

// Prevents the program from closing instantly
process.stdin.resume();
process.on('exit', () => logFinished());
process.on('uncaughtException', function(e) {
  console.error(e);
  log('Uncaught Exception...', e.message);
  process.exit(99);
});
process.on('unhandledRejection', (reason) => {
  console.error(reason);
  log('unhandledRejection...', _.get(reason, 'message', reason));
  process.exit(99);
});

module.exports = log;