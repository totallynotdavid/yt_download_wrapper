const ytDownloader = require("../src/index")

async function exampleFunction({ youtubeId, startTime, endTime, format }) {
  try {
    const results = await ytDownloader(youtubeId, startTime, endTime, format)
    console.log(results)
  } catch (error) {
    console.error(`An error occurred processing [${youtubeId}]:`, error)
  }
}

async function runExamples() {
  await exampleFunction({
    youtubeId: "dQw4w9WgXcQ",
    startTime: 30,
    endTime: 120,
    format: "opus",
  })

  await exampleFunction({
    youtubeId: "el0N_MDcp0Y",
    startTime: 30,
    endTime: 120,
    format: "mp3",
  })

  // Gets the full file in an opus format
  await exampleFunction("4lJfA6ANgNM")

  // Gets the full file in an opus format and trimmed
  await exampleFunction("BxqYUbNR-c0", 30, 120)

  // Gets the full video in an mp4 format in the best quality
  await exampleFunction({
    youtubeId: "BxqYUbNR-c0",
    format: "mp4",
  })

  // Currently, there is known bug when using this:
  await exampleFunction("xg43lcItgKk", 30, 120, "mp4") // The result is an mp4 file without video, only audio
}

runExamples()
