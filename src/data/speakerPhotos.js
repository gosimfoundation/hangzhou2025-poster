// Mapping of speaker names to their photo filenames (using Ghibli-style images)
export const speakerPhotos = {
  'Martino Russi': 'ghibli_martino-russi.png',
  'Jinwei Gu': 'ghibli_jinwei-gu.png',
  '夏璇': 'ghibli_xuan-xia.png',
  '岑明': 'ghibli_cen-ming.png',
  '尹云鹏': 'ghibli_yin-yun-peng.png',
  '李涛': 'ghibli_tao-li.png',
  '王鹏伟': 'ghibli_wang-peng-wei.png',
  '岑汝平': 'ghibli_ruping-cen.png',
  'Edgar Riba': 'ghibli_edgar-riba.png',
  'Jian Shi': 'ghibli_jian-shi.png',
  'Xavier': 'ghibli_xavier.png'
};

export function getSpeakerPhoto(name) {
  return speakerPhotos[name] || null;
}