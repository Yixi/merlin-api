const exec = require('child_process').exec;

const httping = (url) => new Promise((resolve, reject) => {
  exec(
    `httping -c 3 ${url} | grep round-trip | awk -F'=' '{print $2}' | awk -F'/' '{print $2}'`,
    {timeout: 5 * 1000},
    (err, stdout, stderr) => {
      if (err) {
        resolve("0");
      } else {
        resolve(stdout.replace(/\n/g, ''))
      }
    })
})

const ping = (host) => new Promise(((resolve, reject) => {
  exec(
    `ping ${host} -c 1 -w 1 -q |awk -F'/' '{print $5}'`,
    {timeout: 3 * 1000},
    (err, stdout, stderr) => {
      if (err) {
        resolve("0");
      } else {
        const result = stdout.replace(/\n/mg, '');
        resolve(result || "0");
      }
    }
  )
}))

module.exports = {
  httping,
  ping
}