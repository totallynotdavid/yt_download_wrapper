const config = require("../../config/production.config")
const path = require("path")
const execCommand = require("./exec")

function downloadVideo(youtubeId, startTime, endTime, format, quality) {
  const formatType = config.formats[format]
    ? config.formats[format].type
    : "audio"
  const formatConfig =
    config.formats[format] || config.formats[config.defaultFormat[formatType]]

  const qualitySetting =
    config.qualitySettings[quality || config.defaultQuality[formatType]][
      formatType
    ]
  const filenameTemplate = `${youtubeId}.%(ext)s`

  let command = `yt-dlp -v `

  if (formatType === "video") {
    command += `-f "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4] / bv*+ba/b" `
  } else if (formatType === "audio") {
    if (config.ytDlpAudioFormats.includes(format)) {
      command += `-f ${qualitySetting} --extract-audio --audio-format ${format} `
    } else {
      command += `-f ${qualitySetting} --extract-audio `
    }
  }

  command += `https://www.youtube.com/watch?v=${youtubeId} -P "${config.mediaAssetsFolder}"`

  if (startTime !== undefined || endTime !== undefined) {
    const timeRange = `*${startTime || ""}-${endTime || "inf"}` // inf is the end of the video
    command += ` --download-sections "${timeRange}"`
  }

  command += ` -o "${filenameTemplate}"`
  return execCommand(command)
    .then((stdout) => getVideoFilename(stdout))
    .catch(handleDownloadError)
}

function getVideoFilename(stdout) {
  const alreadyDownloadedRegex =
    /\[download\] ([\w/\\]+.{11}\.(webm|m4a|mp3|mp4|flv|avi|mkv|opus)) has already been downloaded/
  const extractAudioRegex =
    /\[ExtractAudio\] Destination: ([\w/\\]+.{11}\.(webm|m4a|mp3|mp4|flv|avi|mkv|opus))/
  const destinationRegex =
    /Destination: ([\w/\\]+.{11}\.(webm|m4a|mp3|mp4|flv|avi|mkv|opus))/

  const match =
    stdout.match(extractAudioRegex) ||
    stdout.match(alreadyDownloadedRegex) ||
    stdout.match(destinationRegex)
  if (match) {
    const filePath = path.join(match[1])
    return filePath
  }

  return null
}

function handleDownloadError(error) {
  if (
    error.stderr &&
    error.stderr.includes("Video unavailable. This video contains content")
  ) {
    throw new Error("This video is unavailable due to content restrictions.")
  }
  throw error
}

module.exports = { downloadVideo }
