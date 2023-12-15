const ytDownloader = require("../src/index")

async function exampleFunction(youtubeId, startTime, endTime, format) {
  try {
    const results = await ytDownloader(youtubeId, startTime, endTime, format)
    console.log(results)
  } catch (error) {
    console.error(`An error occurred processing [${youtubeId}]:`, error)
  }
}

async function runExamples() {
  await exampleFunction("dQw4w9WgXcQ", 30, 120, "opus")
  await exampleFunction("XyAPmF8IeRQ", 10, 100, "ogg")
  await exampleFunction("el0N_MDcp0Y", 30, 120, "mp3")
  await exampleFunction("xg43lcItgKk", 30, 120, "mp4") // Gets an mp4 file without video (bug?)
  await exampleFunction("k9tgLnI0fFc", null, null, (format = "mp4")) // Gets the full video in best quality and mp4 format
  await exampleFunction("4lJfA6ANgNM")              // Gets the full file in an opus format
  await exampleFunction("BxqYUbNR-c0", 30, 120)     // Gets the full file in an opus format and trimmed
}

runExamples()
