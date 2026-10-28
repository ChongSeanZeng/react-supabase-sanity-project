import { useLanguage } from "@/i18n"

interface SectionHeadProps {
  eyebrow: string;
  title: string;
  desc?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHead({ eyebrow, title, desc, align = "left", light = false }: SectionHeadProps) {
  const { t } = useLanguage()

  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p
        className={`font-display text-[13px] font-semibold uppercase tracking-[0.18em] ${
        light ? "text-sprout" : "text-moss"}`
        }>

        <span>{t(eyebrow)}</span>
      </p>
      <h2
        className={`mt-3 font-display text-3xl font-bold leading-[1.15] tracking-[-0.02em] md:text-4xl ${
        light ? "text-white" : "text-forest"}`
        }>

        {t(title)}
      </h2>
      {desc &&
      <p className={`mt-4 leading-relaxed text-sm ${light ? "text-mist" : "text-inksoft"}`} style={{}}>
        {t(desc)}
      </p>
      }
    </div>);

}