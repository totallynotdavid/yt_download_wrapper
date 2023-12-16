const config = require("../../config/production.config")
const path = require("path")
const execCommand = require("./exec")

/**
 * Downloads a video from YouTube using the yt-dlp command line utility.
 *
 * This function builds and executes a yt-dlp command to download a video (or audio) from YouTube,
 * optionally trimming it to a specified time range and converting it to a specified format and quality.
 *
 * @param {string} youtubeId    - The YouTube video ID.
 * @param {number} [startTime]  - The start time for video trimming (in seconds). Optional.
 * @param {number} [endTime]    - The end time for video trimming (in seconds). Optional.
 * @param {string} [format]     - The desired output video format. Optional.
 * @param {string} [quality]    - The desired quality for downloading (e.g., 'best', 'worst'). Optional.
 * @returns {Promise<string>}     A promise that resolves with the file path of the downloaded video.
 *                                In case of an error, the promise is rejected with the error details.
 */
function downloadVideo(youtubeId, startTime, endTime, format, quality) {
  const formatType = config.formats[format]
    ? config.formats[format].type
    : "audio"
  // const formatConfig =
  //  config.formats[format] || config.formats[config.defaultFormat[formatType]]

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

/**
 * Extracts the filename of the downloaded video from the standard output of yt-dlp.
 *
 * @param {string} stdout   - The standard output from executing the yt-dlp command.
 * @returns {string|null}     The file path of the downloaded video, or null if not found.
 */
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

/**
 * Handles errors that occur during video download.
 *
 * @param {Object} error  - The error object containing details about the failure.
 * @throws {Error}          Throws a new error with a more specific message if the video is unavailable.
 */
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
