module.exports = {
  mediaAssetsFolder: "media",
  defaultQuality: "best",
  defaultFormat: "ogg",

  qualitySettings: {
    best: {
      audio: "bestaudio",
      video: "bestvideo",
    },
    worst: {
      audio: "worstaudio",
      video: "worstvideo",
    },
  },

  ytDlpAudioFormats: [
    "best",
    "aac",
    "flac",
    "mp3",
    "m4a",
    "opus",
    "vorbis",
    "wav",
  ],

  formats: {
    mp4: { type: "video", ffmpegCodec: "libx264", ffmpegAudioCodec: "aac" },
    webm: {
      type: "video",
      ffmpegCodec: "libvpx-vp9",
      ffmpegAudioCodec: "libopus",
    },
    mp3: { type: "audio", ffmpegCodec: "libmp3lame" },
    ogg: { type: "audio", ffmpegCodec: "libopus" },
  },
}
