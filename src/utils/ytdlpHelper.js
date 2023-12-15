const config = require("../../config/production.config")
const path = require("path")
const execCommand = require("./exec")

function downloadVideo(
  youtubeId,
  startTime,
  endTime,
  format = config.defaultFormat,
  quality = config.defaultQuality,
) {
  const qualitySetting =
    config.qualitySettings[quality][config.formats[format].type]
  const filenameTemplate = `${youtubeId}.%(ext)s`
  let command = `yt-dlp -v -f ${qualitySetting} https://www.youtube.com/watch?v=${youtubeId}`

  if (
    config.formats[format].type === "audio" &&
    config.ytDlpAudioFormats.includes(format)
  ) {
    command += ` --extract-audio --audio-format ${format}`
  }

  command += ` -P "${config.mediaAssetsFolder}"`

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
  const destinationRegex =
    /Destination: ([\w/\\]+.{11}\.(webm|m4a|mp3|mp4|flv|avi|mkv|opus))/

  const match =
    stdout.match(alreadyDownloadedRegex) || stdout.match(destinationRegex)
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
