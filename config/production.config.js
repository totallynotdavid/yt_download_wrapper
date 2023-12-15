module.exports = {
  /*
    Options for audio quality: 'bestaudio' or 'ba' and 'worstaudio' or 'wa'
  */
  mediaAssetsFolder: "media",
  preferredDownloadQuality: "bestaudio",
  supportedFormats: {
    mp3: { codec: "libmp3lame", ext: "mp3" },
    ogg: { codec: "libopus", ext: "ogg" },
  },
  defaultFormat: "ogg",
}
