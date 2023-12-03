const { exec } = require('child_process')

// Function to execute a shell command and return a promise
const execPromise = command => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`exec error: ${error}`))
        return
      }
      resolve(stdout)
    })
  })
}

module.exports = {
  execPromise
}