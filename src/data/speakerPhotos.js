// Mapping of speaker names to their photo filenames
export const speakerPhotos = {
  'Martino Russi': 'martino-russi.jpeg',
  'Jinwei Gu': 'jinwei-gu.jpg',
  '夏璇': 'xuan-xia.jpg',
  '岑明': 'cen-ming.jpg',
  '尹云鹏': 'yin-yun-peng.jpg',
  '李涛': 'tao-li.jpg',
  '王鹏伟': 'wang-peng-wei.jpg',
  '岑汝平': 'ruping-cen.jpg',
  'Edgar Riba': 'edgar-riba.jpeg',
  'Jian Shi': 'jian-shi.jpg',
  'Xavier': 'xavier.jpg'
};

export function getSpeakerPhoto(name) {
  return speakerPhotos[name] || null;
}