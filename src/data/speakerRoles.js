// Speaker roles mapping
export const speakerRoles = {
  'Martino Russi': 'Robotics Engineer & Open Source Advocate',
  'Jinwei Gu': 'AI Research Scientist, NVIDIA',
  '夏璇': '机器人数据平台架构师',
  '岑明': '感知与导航算法专家',
  '尹云鹏': '人形机器人创新中心研究员',
  '李涛': '深开鸿操作系统架构师',
  '王鹏伟': '智源研究院具身智能负责人',
  '岑汝平': 'Dora-rs框架核心开发者',
  'Edgar Riba': 'CTO & Co-founder, Farm-ng',
  'Jian Shi': 'Computer Vision Research Lead',
  'Xavier': 'AI & Robotics Integration Specialist'
};

export function getSpeakerRole(name) {
  return speakerRoles[name] || 'Speaker';
}