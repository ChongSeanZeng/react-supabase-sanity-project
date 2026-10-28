export const fscCocVideoAssets = [
  {
    videoAssetId: "70fb87a4c7b171f1b6055017e1f90102",
    durationMinutes: 6.39,
    playUrl: "https://video.inflink.cn/70fb87a4c7b171f1b6055017e1f90102/18039b25444c9774b4e2d2c8076af3dc-ld.m3u8",
  },
  {
    videoAssetId: "308348ecc7b171f1a4405017f0f90102",
    durationMinutes: 9.7,
    playUrl: "https://video.inflink.cn/308348ecc7b171f1a4405017f0f90102/494f00192837fb56c399577f7d339e5f-ld.m3u8",
  },
  {
    videoAssetId: "60c33cecc7b171f1b3c2e7e6d5680102",
    durationMinutes: 7.84,
    playUrl: "https://video.inflink.cn/60c33cecc7b171f1b3c2e7e6d5680102/6ae86cb8e34a9618d293a5c72f4b8ecf-ld.m3u8",
  },
  {
    videoAssetId: "301246ecc7b171f1bfc05017f0f80102",
    durationMinutes: 4.39,
    playUrl: "https://video.inflink.cn/301246ecc7b171f1bfc05017f0f80102/291daf6c6a82bdb3025cd81d6dd68713-ld.m3u8",
  },
  {
    videoAssetId: "004a3eecc7b171f18516f6e6e55b0102",
    durationMinutes: 3.53,
    playUrl: "https://video.inflink.cn/004a3eecc7b171f18516f6e6e55b0102/dac50e36365e16668b0347ee517f126c-ld.m3u8",
  },
  {
    videoAssetId: "60a8baf7c7b171f18d9b4531958d0102",
    durationMinutes: 3.73,
    playUrl: "https://video.inflink.cn/60a8baf7c7b171f18d9b4531958d0102/ccb8cc768907207de7c3255f74e0187d-ld.m3u8",
  },
]

export function getFscCocVideoUrl(videoAssetId: string | undefined) {
  return fscCocVideoAssets.find((video) => video.videoAssetId === videoAssetId)?.playUrl
}
