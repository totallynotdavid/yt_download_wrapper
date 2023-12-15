const config = require("../../config/production.config")
const path = require("path")
const { exec } = require("child_process")

function convertToFormat(inputPath, format) {
  const formatConfig =
    config.supportedFormats[format] ||
    config.supportedFormats[config.defaultFormat]
  const outputPath = inputPath.replace(
    path.extname(inputPath),
    `.${formatConfig.ext}`,
  )
  const command = `ffmpeg -i "${inputPath}" -c:a ${formatConfig.codec} "${outputPath}"`
  return execCommand(command).then(() => outputPath)
}

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

module.exports = { convertToFormat }
