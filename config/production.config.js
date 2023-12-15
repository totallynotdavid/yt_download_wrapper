module.exports = {
  /*
    Options for audio quality: 'bestaudio' or 'ba' and 'worstaudio' or 'wa'
  */
  mediaAssetsFolder: "media",
  preferredDownloadQuality: "bestaudio",
  supportedFormats: {
    mp4: { codec: "libx264", ext: "mp4" },
    ogg: { codec: "libopus", ext: "ogg" },
  },
  defaultFormat: "ogg",
}
