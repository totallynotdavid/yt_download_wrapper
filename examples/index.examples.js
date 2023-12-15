const yt_downloader = require("../src/index")

async function run() {
  try {
    const youtubeId = "dQw4w9WgXcQ" // Replace with the desired YouTube video ID
    const startTime = 30 // Optional: Start time in seconds
    const endTime = 120 // Optional: End time in seconds
    const format = "ogg" // Desired output format

    const processedFilePath = await yt_downloader(
      youtubeId,
      startTime,
      endTime,
      format,
    )
    console.log("Processed video saved at:", processedFilePath)
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

run()
