const ytDownloader = require("../src/index")

async function exampleFunction(youtubeId, startTime, endTime, format) {
  try {
    const processedFilePath = await ytDownloader(
      youtubeId,
      startTime,
      endTime,
      format,
    )
    console.log(`Processed video [${youtubeId}] saved at:`, processedFilePath)
  } catch (error) {
    console.error(`An error occurred processing [${youtubeId}]:`, error)
  }
}

async function runExamples() {
  await exampleFunction("dQw4w9WgXcQ", 30, 120, "ogg")
  await exampleFunction("el0N_MDcp0Y", 30, 120, "mp3")
}

runExamples()
