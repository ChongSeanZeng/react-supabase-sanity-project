export interface ShowImage {
  id: number
  image: string
  alt: string
  caption?: string
  fit?: "cover" | "contain"
}

export const heroShowcaseImages: ShowImage[] = [
  {
    id: 1,
    image: "/assets/hero-team-overseas.png",
    alt: "团队海外项目合影",
    caption: "FSC COC审核员培训",
    fit: "contain",
  },
  {
    id: 2,
    image: "/assets/hero-green-supply-chain.jpg",
    alt: "FSC 中国绿色供应链对接会合影",
    caption: "FSC 中国绿色供应链对接会",
    fit: "contain",
  },
  {
    id: 4,
    image: "/assets/showcase-4.png",
    alt: "林地核查与采伐地坐标绘制工作照",
    caption: "EUDR验证现场",
    fit: "contain",
  },
]

export const forestryShowcaseImages: ShowImage[] = [
  {
    id: 1,
    image: "/assets/forestry-1.jpg",
    alt: "行业大会现场演示认证材料交易码系统",
    caption: "现场嘉宾演讲",
    fit: "contain",
  },
  {
    id: 2,
    image: "/assets/forestry-2.png",
    alt: "项目团队在大会舞台合影",
    caption: "项目团队大会合影",
    fit: "contain",
  },
  {
    id: 3,
    image: "/assets/forestry-talk.png",
    alt: "可持续木制家具项目主题分享",
    caption: "可持续木制家具项目分享",
    fit: "contain",
  },
  {
    id: 4,
    image: "/assets/forestry-4.jpg",
    alt: "DDS追溯体系构建主题演讲",
    caption: "DDS追溯体系构建分享",
    fit: "contain",
  },
  {
    id: 5,
    image: "/assets/forestry-5.jpg",
    alt: "活动现场签到处接待准备",
    caption: "活动签到与接待",
    fit: "contain",
  },
]

export const aboutShowcaseImages: ShowImage[] = [
  {
    id: 1,
    image: "/assets/about-factory-audit.jpg",
    alt: "审核员在木材工厂核对台账",
    caption: "工厂符合性验证",
  },
  {
    id: 2,
    image: "/assets/about-eudr-coordinates.jpg",
    alt: "顾问团队项目会议",
    caption: "EUDR坐标验证",
  },
  {
    id: 3,
    image: "/assets/about-forest-survey.png",
    alt: "林地现场调查",
    caption: "海外林地调查",
  },
  {
    id: 4,
    image: "/assets/about-certificate-handover.jpg",
    alt: "证书交付仪式",
    caption: "非洲工厂访谈",
  },
]

export const verificationShowcaseImages: ShowImage[] = [
  {
    id: 1,
    image: "/assets/verify-1.jpg",
    alt: "桉树人工林采伐地现场符合性核查",
    caption: "采伐地现场符合性核查",
  },
  {
    id: 2,
    image: "/assets/verify-2.jpg",
    alt: "人造板工厂生产现场抽样验证",
    caption: "工厂生产现场抽样验证",
  },
  {
    id: 3,
    image: "/assets/verify-3.jpg",
    alt: "回收木材原料堆场来源核查",
    caption: "回收木材来源核查",
  },
  {
    id: 4,
    image: "/assets/verify-4.jpg",
    alt: "山地林地坐标绘制与文件核对",
    caption: "林地坐标绘制与文件核对",
  },
]

export const trainingShowcaseImages: ShowImage[] = [
  {
    id: 1,
    image: "/assets/training-1.jpg",
    alt: "FSC审核员培训课程现场讲授评估要求",
    caption: "审核员培训课程现场",
  },
  {
    id: 2,
    image: "/assets/training-2.jpg",
    alt: "与认证机构合作的小班研讨课堂",
    caption: "小班研讨与案例演练",
  },
  {
    id: 3,
    image: "/assets/training-3.jpg",
    alt: "企业内训课堂讲解EUDR法规要点",
    caption: "企业内训 EUDR 解读",
  },
  {
    id: 4,
    image: "/assets/training-4.jpg",
    alt: "EUDR核心内容解读公开课现场",
    caption: "EUDR 核心内容公开课",
  },
  {
    id: 5,
    image: "/assets/training-5.jpg",
    alt: "学员分组进行审核策划练习",
    caption: "分组审核策划练习",
  },
]
