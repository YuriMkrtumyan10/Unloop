import { useTranslations } from "next-intl";
import type { Category } from "@/lib/types";
import { categoryIcon, Icon } from "./Icon";

export const categoryColor: Record<Category, string> = {
  outdoors: "#7FD1AE",
  food: "#FFB36B",
  creative: "#F59BD0",
  learn: "#9DB8FF",
  games: "#E2C6FF",
  social: "#FFD66B",
  spicy: "#FF9A4D",
  quick: "#C8F03C",
};

export function CategoryBadge({ category }: { category: Category }) {
  const t = useTranslations("categories");
  return (
    <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold text-ink" style={{ background: categoryColor[category] }}>
      <Icon name={categoryIcon[category]} size={16} />
      {t(category)}
    </span>
  );
}
