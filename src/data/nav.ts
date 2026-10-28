import type { IconType } from "react-icons"
import {
  FaHome,
  FaBuilding,
  FaLeaf,
  FaChalkboardTeacher,
  FaBookOpen,
  FaClipboardCheck,
  FaHandshake,
  FaEnvelope,
} from "react-icons/fa"

export interface NavPoint {
  label: string
  anchor: string
}

export interface NavItem {
  label: string
  labelEn?: string
  path: string
  icon: IconType
  summary: string
  points: NavPoint[]
}

export const navItems: NavItem[] = [
  {
    label: "首页",
    path: "/",
    icon: FaHome,
    summary: "可持续发展与进出口合规认证一站式服务入口。",
    points: [
      { label: "四大核心服务", anchor: "core-services" },
      { label: "懂国际标准，更懂中国供应链", anchor: "about-summary" },
      { label: "公司优势", anchor: "advantages" },
      { label: "发展历程", anchor: "milestones" },
      { label: "咨询入口", anchor: "home-inquiry" },
    ],
  },
  {
    label: "关于我们",
    path: "/about",
    icon: FaBuilding,
    summary: "了解林扬东方的团队背景、专家资质与授权证书。",
    points: [
      { label: "我们是谁", anchor: "company-profile" },
      { label: "林扬团队", anchor: "team" },
      { label: "资质与授权", anchor: "credentials" },
    ],
  },
  {
    label: "可持续服务",
    path: "/sustainability",
    icon: FaLeaf,
    summary: "森林认证、气候碳管理、循环经济与林业咨询。",
    points: [
      { label: "森林认证 FSC / PEFC / CFCC", anchor: "forest" },
      { label: "林业咨询与经营方案", anchor: "forestry" },
      { label: "气候变化与碳管理", anchor: "climate" },
      { label: "循环经济 PPWR", anchor: "circular" },
      { label: "企业责任与 ESG 框架", anchor: "esg" },
    ],
  },
  {
    label: "培训",
    path: "/training",
    icon: FaChalkboardTeacher,
    summary: "法规解读、审核员课程、企业内训与标准培训。",
    points: [
      { label: "EUDR 培训", anchor: "eudr-training" },
      { label: "FSC-COC 审核员培训课程", anchor: "fsc-auditor-training" },
      { label: "企业线上公开课", anchor: "online-courses" },
      { label: "标准培训", anchor: "standard-training" },
      { label: "绿色产品认证标准目录", anchor: "green-product-standards" },
    ],
  },
  {
    label: "课程",
    path: "/courses",
    icon: FaBookOpen,
    summary: "登录学习 FSC CoC 课程、记录进度并参加考试测评。",
    points: [
      { label: "FSC CoC 在线课程", anchor: "course" },
    ],
  },
  {
    label: "符合性验证",
    labelEn: "Compliance Verification",
    path: "/verification",
    icon: FaClipboardCheck,
    summary: "覆盖欧盟、英国、美国、澳洲与日本市场准入验证。",
    points: [
      { label: "EUDR 验证信息查询", anchor: "eudr-search" },
      { label: "EUDR / EUTR / UKTR", anchor: "verification-eudr-eutr-uktr" },
      { label: "CE Marking", anchor: "verification-ce-marking" },
      { label: "REACH 甲醛限制", anchor: "verification-reach" },
      { label: "CARB / EPA", anchor: "verification-carb-epa" },
      { label: "GECA", anchor: "verification-geca" },
      { label: "JIS", anchor: "verification-jis" },
    ],
  },
  {
    label: "合作伙伴",
    path: "/partners",
    icon: FaHandshake,
    summary: "国际认证机构、行业协会合作与服务客户展示。",
    points: [
      { label: "全球合作", anchor: "institutions" },
      { label: "服务客户", anchor: "clients" },
    ],
  },
  {
    label: "联系我们",
    path: "/contact",
    icon: FaEnvelope,
    summary: "提交咨询需求，获取合规方案与报价。",
    points: [
      { label: "在线咨询表单", anchor: "contact-form" },
      { label: "联系方式与地址", anchor: "contact-details" },
      { label: "关注公众号", anchor: "wechat" },
    ],
  },
]
