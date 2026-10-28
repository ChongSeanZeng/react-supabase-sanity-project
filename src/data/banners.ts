export interface BannerSlide {
  id: number
  image: string
  alt: string
  title: string
  desc: string
  linkText?: string
  linkPath?: string
}

export const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    image:
      "/assets/hero-forest-canopy.jpg",
    alt: "阳光穿透森林树冠",
    title: "森林认证 FSC / PEFC / CFCC",
    desc: "从林地到货架的全链条认证咨询，助力木制品企业合规出口。",
    linkText: "了解森林认证",
    linkPath: "/sustainability",
  },
  {
    id: 2,
    image:
      "/assets/hero-auditor-documents.jpg",
    alt: "审核员在工厂核对文件",
    title: "EUDR 零毁林合规验证",
    desc: "采伐地坐标绘制、DDS 尽职调查落地与批次性符合声明服务。",
    linkText: "查看验证服务",
    linkPath: "/verification",
  },
  {
    id: 3,
    image:
      "/assets/hero-sustainability-meeting.jpg",
    alt: "团队讨论可持续发展报告",
    title: "合规培训与审核员课程",
    desc: "EUDR 法规解读、FSC-COC 审核员培训与企业定制内训。",
    linkText: "浏览课程体系",
    linkPath: "/training",
  },
]

export const bannerSettings = {
  interval: 2000,
  height: "h-[440px] md:h-[560px] lg:h-[640px]",
}
