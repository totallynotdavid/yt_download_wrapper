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
  await exampleFunction("xg43lcItgKk", 30, 120, "mp4")
  await exampleFunction("k9tgLnI0fFc", null, null, (format = "mp4"))
}

runExamples()
