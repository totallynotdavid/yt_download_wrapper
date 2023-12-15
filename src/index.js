const { downloadVideo } = require('./utils/ytdlpHelper');
const { convertToFormat } = require('./utils/ffmpegHelper');
const { ensureDirectoryExists } = require('./utils/folderStructure');
const path = require('path');
const config = require('../config/production.config');

/**
 * Processes a YouTube video by downloading it, optionally trimming, and converting to the desired format.
 * @param {string} youtubeId - The YouTube video ID.
 * @param {number} [startTime] - The start time for video trimming (in seconds).
 * @param {number} [endTime] - The end time for video trimming (in seconds).
 * @param {string} [format] - The desired output video format.
 * @returns {Promise<string>} - The path to the processed video file.
 */
async function processYouTubeVideo(youtubeId, startTime, endTime, format = config.defaultFormat) {
  try {
    ensureDirectoryExists(path.resolve(config.mediaAssetsFolder));

    const downloadedFilePath = await downloadVideo(youtubeId, startTime, endTime);
    if (!downloadedFilePath) {
      throw new Error('Failed to download the video or parse the file name.');
    }
    const currentFormat = path.extname(downloadedFilePath).substring(1); // Extracts the extension without the dot
    console.log('currentFormat', currentFormat)

    if (currentFormat !== format) {
      return await convertToFormat(downloadedFilePath, format);
    }

    // Return the path of the downloaded (and possibly trimmed) audio
    return downloadedFilePath;
  } catch (error) {
    console.error('Error processing the YouTube video:', error);
    throw error;
  }
}

module.exports = processYouTubeVideo;
