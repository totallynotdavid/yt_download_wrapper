const config = require("../../config/production.config")
const path = require("path")
const { exec } = require("child_process")

function downloadVideo(youtubeId, startTime, endTime) {
  const filenameTemplate = `${youtubeId}.%(ext)s`
  let command = `yt-dlp -v --extract-audio --audio-format opus -f ${config.preferredDownloadQuality} https://www.youtube.com/watch?v=${youtubeId}`
  command += ` -P "${config.mediaAssetsFolder}"`

  // Download only the specified time range
  if (startTime !== undefined || endTime !== undefined) {
    const timeRange = `*${startTime || ""}-${endTime || "inf"}` // 'inf' to denote the end of the video
    command += ` --download-sections "${timeRange}"`
  }

  command += ` -o "${filenameTemplate}"`
  return execCommand(command)
    .then((stdout) => getVideoFilename(stdout))
    .catch(handleDownloadError)
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
