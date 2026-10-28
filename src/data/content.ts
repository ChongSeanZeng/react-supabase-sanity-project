export interface TeamMember {
  name: string;
  nameEn: string;
  title: string;
  years: string;
  bio: string;
  bioEn: string;
  avatar: string;
}

export const teamMembers: TeamMember[] = [
{
  name: "Canna Lee",
  nameEn: "创始人 & 总经理",
  title: "Founder & General Manager",
  years: "15+年国际认证项目经验",
  bio: "拥有15年以上国际认证项目经验，具备多项国际认证体系检查员资质，参与FSC产销监管链主标准修订工作，多次担任FSC及PEFC森林认证审核员培训师。兼任中国出入境检验检疫协会智库专家，专注于林产品、木制品的国际合规与可持续发展。",
  bioEn: "With over 15 years of experience in international certification covering multiple schemes, such as FSC/PEFC, CE Marking, CARB/EPA, GECA, etc, she has contributed to FSC Chain of Custody standard revisions, and has contributed to FSC and PEFC COC auditors training as qualified trainer. She also advises the China Entry-Exit Inspection & Quarantine Association, specializing in international compliance and sustainable development for forest and wood products.",
  avatar: "/assets/team-1.jpg"
},
{
  name: "Laurel Fu",
  nameEn: "业务合伙人 & 市场总监",
  title: "Business Partner & Marketing Director",
  years: "15+年可持续发展领域经验",
  bio: "主导市场规划与新业务拓展，在ESG、EPD、EUDR合规解决方案等方面拥有丰富实践经验，推动循环、低碳、可持续、负责任供应链等新兴板块，擅长整合资源、搭建国际合作网络，为客户创造可持续的商业价值。",
  bioEn: "Leads marketing and new business development, with extensive experience in ESG, EPD, and EUDR compliance solutions. Drives emerging areas including circular economy, low-carbon initiatives, sustainable and responsible supply chains. Expertising in resource integration and building international networks to deliver sustainable business value for clients.",
  avatar: "/assets/team-2.jpg"
},
{
  name: "杨振宇 Max Yang",
  nameEn: "项目总监",
  title: "Project Director",
  years: "10+年认证咨询及可持续供应链经验",
  bio: "深耕EUDR/EUTR、FSC/PEFC领域，具备木材及木制品、纸浆造纸、棕榈油、橡胶等大宗商品的可持续供应链实战经验，擅长尽职调查、合法性追溯、体系认证、专业咨询与培训。聚焦企业供应链价值提升，为企业赋能，助力企业稳健发展。",
  bioEn: "Specializes in EUDR/EUTR, FSC, and PEFC, with hands-on experience in sustainable supply chains for timber, wood products, pulp & paper, palm oil, and rubber. Skilled in due diligence, legality verification, system certification, professional consulting, and training. Focused on enhancing supply chain value, empowering companies, and supporting sustainable business growth.",
  avatar: "/assets/team-9.jpg"
},
{
  name: "高秀梅 Xiumei Gao",
  nameEn: "行政负责人",
  title: "Admin Manager",
  years: "10+年德企制造业工作经验",
  bio: "10年+德企制造业经验，具备质量控制实操背景及内审员资质。擅长人事行政体系搭建、合规运营与流程优化，以精细化运营支撑公司高效运转。",
  bioEn: "With over 10 years of experience in German manufacturing companies, backed by hands-on quality control background and internal auditor qualification. Skilled in establishing HR and administration systems, ensuring compliance and legal operation, and driving process optimization. Supports efficient company operations through meticulous and refined management.",
  avatar: "/assets/team-4.jpg"
},
{
  name: "吴金绒 Ava Wu",
  nameEn: "产品技术经理",
  title: "Product & Technology Manager",
  years: "10+年家居建材行业和产品认证经验",
  bio: "主要负责技术转化及国际产品认证开发，CE、Carb/EPA、GECA、PEFC、FSC检查员，CFCC实习检查员，同时还负责JIS认证咨询工作。熟悉相关标准及认证要求，为企业提供一站式审核策划方案。",
  bioEn: "Mainly responsible for technology transfer and international product certification development. Serves as an auditor for CE, Carb/EPA, GECA, PEFC, and FSC, as well as a trainee auditor for CFCC. Also handles JIS certification consulting. Familiar with relevant standards and certification requirements, providing enterprises with one-stop audit planning solutions.",
  avatar: "/assets/team-5.jpg"
},
{
  name: "马娇龙 Anya Ma",
  nameEn: "国内项目经理",
  title: "Domestic Project Manager",
  years: "10+年质量相关工作经验",
  bio: "国内项目・CCC水性内墙漆项目经理，精通相关标准及全流程实操，为国内客户赋能竞标筹备，为国外客户助力国际市场布局，提升企业海内外核心竞争力。",
  bioEn: "Domestic Project - CCC Water-based Interior Paint Project Manager. Proficient in relevant standards and full-process hands-on work. Helps domestic clients prepare for bids, helps international clients expand in global markets, and boosts companies' core competitiveness both at home and abroad.",
  avatar: "/assets/team-6.jpg"
},
{
  name: "韩琳 Helia Han",
  nameEn: "FSC项目经理",
  title: "FSC Project Manager",
  years: "3+年国际森林合规运营工作经验",
  bio: "拥有CE、EUDR/EUTR、CARB/EPA项目经验，深耕FM相关工作，熟悉经营方案编制，同时负责FSC森林项目协调管理工作，为客户提供符合国际标准与市场准入要求的解决方案，助力企业提升可持续竞争力。",
  bioEn: "Certified Auditor for CE, CARB/EPA projects and EUDR/EUTR Assessor. Extensive experience in Forest Management (FM), proficient in developing business operation plans. Also responsible for coordinating and managing FSC forest certification projects. Dedicated to providing clients with solutions that meet international standards and market access requirements, thereby enhancing their sustainable competitiveness.",
  avatar: "/assets/team-7.jpg"
},
{
  name: "张弘释 Ian Zhang",
  nameEn: "森林项目经理",
  title: "Forestry Project Manager",
  years: "3+年森林经营相关工作经验",
  bio: "拥有CE、EUDR/EUTR项目经验，参与FSC、CE、EUDR/EUTR相关工作，具有企业质量控制管理经验。深耕FM相关工作，熟悉经营方案编制，为森林经营单位提供森林经营管理指导，协助客户提高产品附加值。",
  bioEn: "Serving as an auditor for CE and EUDR/EUTR, with active involvement in FSC, CE, and EUDR/EUTR related projects. Possesses solid experience in enterprise quality control management. Deeply specialized in Forest Management (FM) operations, with expertise in the formulation of management plans. Provides expert FM consulting services to forest management units, dedicated to enhancing product added value for clients.",
  avatar: "/assets/team-8.jpg"
},
{
  name: "李晓然 Ric Lee",
  nameEn: "PEFC项目经理",
  title: "PEFC Project Manager",
  years: "10+年建材及家居行业审核与合规管理经验",
  bio: "PEFC检查员及CE检查员，深度参与EUDR与FSC相关工作，熟悉PEFC、FSC、CE、EUDR等国际标准及合规要求，熟悉绿色建材产品认证与绿色建筑评价体系。擅长为企业提供从原料溯源到市场准入的全链条合规支持。",
  bioEn: "PEFC Auditor and CE Auditor, deeply involved in EUDR and FSC related work. Familiar with PEFC, FSC, CE, EUDR and other international standards and compliance requirements. Familiar with green building material product certification and green building assessment systems. Skilled in providing enterprises with full-chain compliance support from raw material traceability to market access.",
  avatar: "/assets/team-3.jpg"
}];


export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export const milestones: Milestone[] = [
{
  year: "2018",
  title: "公司成立",
  desc: "林扬东方（北京）科技有限公司注册成立。核心团队深耕林业、环境治理、质量检测与国际商务领域，专注为进出口企业提供全链条合规与可持续发展解决方案。"
},
{
  year: "2019",
  title: "FSC 宣传许可与森林认证起步",
  desc: "取得 FSC® 宣传许可（许可号 FSC® N002971），正式启动 FSC/PEFC/CFCC 森林认证咨询业务，助力木制品企业实现合规化进出口。"
},
{
  year: "2020",
  title: "审核员培训体系建立",
  desc: "与英国知名认证机构 Soil Association 合作，在中国开设 FSC-COC 产销监管链审核员培训课程，持续为行业输送实战型审核人才。"
},
{
  year: "2021",
  title: "气候与碳管理拓展",
  desc: "布局 ISCC、国际 EPD 体系、Verra VCS、GCC 等国际标准的一站式碳管理服务，助力企业完成碳合规、生命周期评估与可持续发展报告。"
},
{
  year: "2022",
  title: "多市场符合性验证深化",
  desc: "深耕 EUTR 木材合规验证，拓展 CE Marking、CARB/EPA、GECA、JIS、REACH 等多市场符合性验证能力，服务网络覆盖欧洲、北美、澳洲与日本市场。"
},
{
  year: "2023",
  title: "EUDR 零毁林合规先行",
  desc: "欧盟零毁林法案（EUDR）颁布后，率先开展采伐地地理坐标绘制、DDS 尽职调查落地验证与批次性符合声明服务，帮助客户从 EUTR 平稳过渡至 EUDR。"
},
{
  year: "2024",
  title: "WWF-FSC 可持续项目合作",
  desc: "成为 WWF-FSC 多个可持续项目合作方，通过工厂走访、上下游资源对接、集体采购与数字化协同，打通 FSC 认证从原材料到成品的交易瓶颈。"
},
{
  year: "2025",
  title: "FSC 中国区供需对接会",
  desc: "作为 FSC 中国区资源供需对接会组织方，聚焦绿色可持续木材产业，一站直达认证原料与目标客户群，联动产业链上下游共建可持续绿色供应链。"
},
{
  year: "2026",
  title: "可持续全链条服务矩阵",
  desc: "形成森林认证、气候碳管理、循环经济（PPWR）、ESG、合规培训与符合性验证的全链条服务矩阵，累计服务 500+ 合规客户，业务从中国本土扩展至东南亚、欧洲及非洲市场。"
}];


export const fscLicenseImage = "/assets/fsc-license-original.jpg";

export interface QualificationTile {
  id: number;
  name: string;
  nameEn: string;
  image: string;
}

export const qualificationTiles: QualificationTile[] = [
{ id: 1, name: "国家级高新技术企业证书", nameEn: "National High-tech Enterprise Certificate", image: "/assets/cert-1.jpg" },
{ id: 2, name: "CARB/EPA 业务授权", nameEn: "CARB / EPA Authorization", image: "/assets/cert-2.png" },
{ id: 3, name: "CE 业务授权", nameEn: "CE Authorization", image: "/assets/cert-3.png" },
{ id: 4, name: "VCS 业务授权", nameEn: "VCS Authorization", image: "/assets/cert-4.png" },
{ id: 5, name: "木链计划绿色低碳战略合作伙伴", nameEn: "Green Low-carbon Strategic Partner, Wood Chain Program", image: "/assets/cert-5.png" },
{ id: 6, name: "中国木材与木制品流通协会科学技术奖", nameEn: "Science & Technology Award, CTWPA", image: "/assets/cert-6.png" }];


export const qualificationTileCrop = {
  aspectRatio: "4 / 3"
};

export const fscDisclaimer = {
  zh: "FSC® 不对林扬东方（北京）科技有限公司所提供的任何培训/咨询/服务内容承担责任。",
  en: "FSC® is not responsible for the content of any training/consultation/services offered by East Inflink Sci Tech Co., Ltd."
};

export const clientLogosImage = "/assets/client-logos.png";

export interface Partner {
  name: string;
  full: string;
  url: string;
}

export const partners: Partner[] = [
{ name: "FSC", full: "Forest Stewardship Council", url: "https://fsc.org" },
{ name: "WWF", full: "World Wide Fund for Nature", url: "https://www.worldwildlife.org" },
{ name: "PEFC", full: "Programme for the Endorsement of Forest Certification", url: "https://pefc.org" },
{ name: "SA", full: "Soil Association Certification", url: "https://www.soilassociation.org" },
{ name: "MPA", full: "MPA Eberswalde", url: "https://www.mpaew.de" },
{ name: "KBS", full: "KBS Certification Services", url: "https://www.kbscertification.com/" },
{ name: "Double Helix", full: "Double Helix Tracking Technologies", url: "https://doublehelixtracking.com" }];



export const inquiryTypes = [
"森林认证",
"合规培训",
"符合性验证",
"产业咨询",
"其他"];


export interface GreenProductStandard {
  name: string;
  image: string;
}

export const greenProductStandards: GreenProductStandard[] = [
{ name: "人造板和木质地板", image: "/assets/product-wood-flooring.jpg" },
{ name: "涂料", image: "/assets/product-coatings.jpg" },
{ name: "卫生陶瓷", image: "/assets/product-sanitary-ceramics.jpg" },
{ name: "建筑玻璃", image: "/assets/product-building-glass.jpg" },
{ name: "太阳能热水系统", image: "/assets/product-solar-water-heater.jpg" },
{ name: "陶瓷砖", image: "/assets/product-ceramic-tiles.jpg" },
{ name: "家具", image: "/assets/product-furniture.jpg" },
];
