const { downloadVideo } = require("./utils/ytdlpHelper")
const { convertToFormat } = require("./utils/ffmpegHelper")
const { ensureDirectoryExists } = require("./utils/folderStructure")
const path = require("path")
const config = require("../config/production.config")

/**
 * Processes a YouTube video by downloading it, optionally trimming, and converting to the desired format.
 * @param {string} youtubeId - The YouTube video ID.
 * @param {number} [startTime] - The start time for video trimming (in seconds).
 * @param {number} [endTime] - The end time for video trimming (in seconds).
 * @param {string} [format] - The desired output video format.
 * @param {string} [quality] - The desired quality for downloading (e.g., 'best', 'worst').
 * @returns {Promise<string>} - The path to the processed video file.
 */
async function processYouTubeVideo(
  youtubeId,
  startTime,
  endTime,
  format = config.defaultFormat,
  quality = config.defaultQuality,
) {
  try {
    ensureDirectoryExists(path.resolve(config.mediaAssetsFolder))

    let downloadedFilePath = await downloadVideo(
      youtubeId,
      startTime,
      endTime,
      format,
      quality,
    )
    if (!downloadedFilePath) {
      throw new Error("Failed to download the video or parse the file name.")
    }

    downloadedFilePath = path.resolve(downloadedFilePath) // Convert to absolute path

    const currentFormat = path.extname(downloadedFilePath).substring(1) // Extracts the extension without the dot

    if (currentFormat !== format) {
      const convertedFilePath = await convertToFormat(
        downloadedFilePath,
        format,
      )
      return path.resolve(convertedFilePath)
    }

    // Return the path of the downloaded (and possibly trimmed) video or audio file
    return downloadedFilePath
  } catch (error) {
    console.error("Error processing the YouTube video:", error)
    throw error
  }
}

module.exports = processYouTubeVideo
