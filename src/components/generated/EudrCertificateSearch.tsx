import { useEffect, useState, type FormEvent } from "react"
import { LocalizedLink as Link } from "@/components/common/LocalizedLink"
import { FaSearch } from "react-icons/fa"
import { SectionHead } from "@/components/generated/SectionHead"
import { useLanguage } from "@/i18n"
import { sanityClient } from "@/lib/sanity"

interface EudrCertificate {
  _id: string
  ddsReference: string
  reportHolder: string
  verificationDate: string
  reportValidUntil: string
  productType: string
  hsCode: string
  treeSpecies: string[]
  conclusion: string
}

interface CertificateSearch {
  query: string
  params: Record<string, string>
}

const inputClass =
  "w-full rounded-card border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-inksoft/60 outline-none transition-colors focus:border-moss focus:ring-2 focus:ring-sprout/30"

function searchPattern(value: string) {
  const term = value.trim().replace(/[*?\\]/g, " ").trim()
  return term ? `*${term}*` : ""
}

export function EudrCertificateSearch() {
  const { language, t } = useLanguage()
  const [company, setCompany] = useState("")
  const [reference, setReference] = useState("")
  const [records, setRecords] = useState<EudrCertificate[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeSearch, setActiveSearch] = useState<CertificateSearch | null>(null)

  useEffect(() => {
    const client = sanityClient
    if (!client || !activeSearch) return

    let disposed = false
    let refreshId = 0
    const subscription = client
      .listen(activeSearch.query, activeSearch.params, { includeResult: false })
      .subscribe({
        next: () => {
          const currentRefresh = ++refreshId
          void client
            .fetch<EudrCertificate[]>(activeSearch.query, activeSearch.params)
            .then((updatedRecords) => {
              if (disposed || currentRefresh !== refreshId) return
              setRecords(updatedRecords)
              setError("")
            })
            .catch(() => {
              if (disposed || currentRefresh !== refreshId) return
              setError(
                language === "en"
                  ? "Live verification updates are temporarily unavailable. Please search again."
                  : "实时验证数据更新暂不可用，请重新查询。",
              )
            })
        },
        error: () => {
          if (disposed) return
          setError(
            language === "en"
              ? "Live verification updates are temporarily unavailable. Please search again."
              : "实时验证数据更新暂不可用，请重新查询。",
          )
        },
      })

    return () => {
      disposed = true
      subscription.unsubscribe()
    }
  }, [activeSearch, language])

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActiveSearch(null)
    const companyTerm = company.trim().slice(0, 100)
    const referenceTerm = reference.trim().slice(0, 100)
    if (!companyTerm && !referenceTerm) {
      setError(t("请输入公司名称或 DDS reference 编号"))
      setSearched(false)
      setRecords([])
      return
    }
    if (!sanityClient) {
      setError(t("验证数据暂不可用，请稍后重试或联系工作人员。"))
      setSearched(false)
      setRecords([])
      return
    }

    const companyPattern = companyTerm ? searchPattern(companyTerm) : ""
    const referencePattern = referenceTerm ? searchPattern(referenceTerm) : ""
    if (!companyPattern && !referencePattern) {
      setError(t("请输入公司名称或 DDS reference 编号"))
      setSearched(false)
      setRecords([])
      return
    }

    setLoading(true)
    setError("")
    setSearched(true)
    setRecords([])
    try {
      const filters: string[] = []
      const params: Record<string, string> = {}
      if (companyPattern) {
        filters.push("reportHolder match $company")
        params.company = companyPattern
      }
      if (referencePattern) {
        filters.push("ddsReference match $reference")
        params.reference = referencePattern
      }

      const query = `*[_type == "eudrCertificate" && (${filters.join(" || ")})] | order(_updatedAt desc) {
        _id,
        ddsReference,
        reportHolder,
        verificationDate,
        reportValidUntil,
        productType,
        hsCode,
        treeSpecies,
        conclusion
      }`
      const result = await sanityClient.fetch<EudrCertificate[]>(query, params)
      setRecords(result)
      setActiveSearch({ query, params })
    } catch {
      setError(t("验证数据加载失败，请稍后重试。"))
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${value}T00:00:00Z`))

  const headings = [
    "DDS reference 编号",
    "报告持有人",
    "现场验证时间",
    "报告有效期",
    "产品类型",
    "HS Code（前 4 位）",
    "树种",
    "结论",
  ]

  return (
    <section id="eudr-search" className="scroll-mt-32 border-y border-line bg-mist/50">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-6 md:py-20">
        <SectionHead
          eyebrow="EUDR"
          title="EUDR 验证信息查询"
          desc="输入编号或持有者名称开始查询。支持模糊匹配，不区分大小写。查询结果实时读取数据库，数据更新后无需刷新页面即可获取最新记录。"
        />

        <form onSubmit={handleSearch} className="mt-8 rounded-card border border-line bg-white p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div>
              <label htmlFor="eudr-company" className="mb-1.5 block text-sm font-medium text-ink">
                {t("公司名称")}
              </label>
              <input
                id="eudr-company"
                className={inputClass}
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                maxLength={100}
                placeholder={t("输入报告持有人 / 公司名称")}
              />
            </div>
            <div>
              <label htmlFor="eudr-reference" className="mb-1.5 block text-sm font-medium text-ink">
                {t("DDS reference 编号")}
              </label>
              <input
                id="eudr-reference"
                className={inputClass}
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                maxLength={100}
                placeholder={t("输入 DDS reference 编号")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-card bg-forest px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaSearch className="text-xs" />
              {loading ? t("查询中…") : t("查询验证信息")}
            </button>
          </div>
        </form>

        <div className="mt-5" aria-live="polite">
          {error && (
            <p role="alert" className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}
          {searched && !loading && !error && records.length === 0 && (
            <div className="rounded-card bg-forest px-6 py-8 text-center text-white md:px-10 md:py-10">
              <h2 className="text-2xl font-bold md:text-3xl">{t("未查询到您的报告？")}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-mist/85">
                {t("报告可能尚未录入或已超出有效期。请与我们联系，合规顾问将协助人工核实并说明后续处理方式。")}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/contact"
                  className="rounded-card bg-sprout px-6 py-3 text-sm font-semibold text-forest transition-colors hover:bg-white"
                >
                  {t("联系我们核实")}
                </Link>
                <Link
                  to="/verification#verification-services"
                  className="rounded-card border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {t("了解验证服务")}
                </Link>
              </div>
            </div>
          )}
          {records.length > 0 && (
            <div className="overflow-x-auto rounded-card border border-line bg-white">
              <table className="w-full min-w-[1120px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-mist/70">
                    {headings.map((heading) => (
                      <th key={heading} scope="col" className="px-4 py-3 font-semibold text-forest">
                        {t(heading)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const expired = record.reportValidUntil < new Date().toISOString().slice(0, 10)
                    return (
                      <tr key={record._id} className="border-b border-line/70 last:border-0">
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-forest">{record.ddsReference}</td>
                        <td className="px-4 py-4 text-ink">{record.reportHolder}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-ink">{formatDate(record.verificationDate)}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-ink">
                          {formatDate(record.reportValidUntil)}
                          <span
                            className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                              expired ? "bg-red-50 text-red-700" : "bg-mist text-forest"
                            }`}
                          >
                            {expired ? t("已过期") : t("有效")}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-ink">{record.productType}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-ink">{record.hsCode}</td>
                        <td className="px-4 py-4 text-ink">{record.treeSpecies.join("、")}</td>
                        <td className="min-w-48 px-4 py-4 text-ink">{record.conclusion}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          {records.length > 0 && (
            <p className="mt-3 text-xs leading-relaxed text-inksoft">
              {t("本查询结果仅供参考，不构成法律意见或合规保证。最终认定及适用要求以相关主管机关和官方系统信息为准。")}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
