const { exec } = require("child_process")

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr })
      } else {
        resolve(stdout)
      }
    })
  })
}

module.exports = execCommand
