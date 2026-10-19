import { useTranslations } from "next-intl";

const tilts = ["-rotate-[2.5deg]", "rotate-[2deg] mt-5", "rotate-[1.5deg] -mt-4", "-rotate-[1.5deg]"];

export function Polaroid({ index, title, note, photoUrl, day, points, color }: { index: number; title: string; note: string | null; photoUrl: string | null; day: string; points: number; color: string }) {
  const t = useTranslations("scrapbook");
  return (
    <figure className={`flex flex-col gap-2 rounded-md bg-cream px-2 pt-2 pb-3 text-ink shadow-[0_12px_28px_rgba(0,0,0,0.45)] ${tilts[index % tilts.length]}`}>
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- signed Supabase URLs, already resized on upload
        <img src={photoUrl} alt="" className="aspect-[4/3] w-full rounded-[3px] object-cover" loading="lazy" />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center rounded-[3px] bg-raised p-2 text-center text-[11px] font-semibold whitespace-pre-line text-muted" style={{ borderTop: `4px solid ${color}` }}>
          {t("noPhoto")}
        </div>
      )}
      <figcaption className="flex flex-col gap-2">
        <h3 className="text-[13px] leading-tight font-bold">{title}</h3>
        {note && <p className="font-hand text-[17px] leading-[1.1] text-[#3F3A33]">{note}</p>}
        <div className="flex justify-between text-[11px] font-semibold text-dim">
          <span>{day}</span>
          <span>+{points}</span>
        </div>
      </figcaption>
    </figure>
  );
}
