const config = require("../../config/production.config")
const path = require("path")
const execCommand = require("./exec")

function convertToFormat(inputPath, format) {
  const formatConfig =
    config.formats[format] || config.formats[config.defaultFormat]

  const outputPath = inputPath.replace(path.extname(inputPath), `.${format}`)

  let command = `ffmpeg -y -i "${inputPath}"`
  if (formatConfig.type === "audio") {
    command += ` -c:a ${formatConfig.ffmpegCodec} "${outputPath}"`
  } else {
    command += ` -c:v ${formatConfig.ffmpegCodec} -c:a ${formatConfig.ffmpegAudioCodec} "${outputPath}"`
  }

  return execCommand(command).then(() => outputPath)
}

module.exports = { convertToFormat }
