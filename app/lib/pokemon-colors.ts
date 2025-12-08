export const TYPE_GRADIENTS: Record<string, string> = {
  grass: "from-[#009E51] to-[#88F6B0]",
  fire: "from-[#CF5300] to-[#FFA46F]",
  water: "from-[#0267DB] to-[#88B6F6]",
  bug: "from-[#939E00] to-[#D3F688]",
  electric: "from-[#DBB702] to-[#F6DC88]",
  ice: "from-[#007D9E] to-[#88DFF6]",
  poison: "from-[#6E009E] to-[#D588F6]",
  fighting: "from-[#9E0003] to-[#F6888A]",
  ground: "from-[#8E2C02] to-[#DB812D]",
  psychic: "from-[#9E0064] to-[#F688E2]",
  flying: "from-[#0D009E] to-[#8A88F6]",
  ghost: "from-[#450167] to-[#A769FF]",
  rock: "from-[#9E6600] to-[#F6C588]",
  dragon: "from-[#022D69] to-[#7091FF]",
  dark: "from-[#010101] to-[#4A4251]",
  steel: "from-[#313030] to-[#B2B2B2]",
  fairy: "from-[#9E004C] to-[#F688B6]",
  normal: "from-[#A8A878] to-[#E0E0B0]",
};

export const TYPE_BG_POSITIONS: Record<string, string> = {
  grass: "lg:bottom-15 lg:-left-10 lg:h-135",
  fire: "lg:bottom-0 lg:-left-15 lg:h-160",
  water: "lg:bottom-10 lg:-left-5 lg:h-130",
  bug: "lg:bottom-15 lg:-left-3 lg:h-130",
  electric: "lg:bottom-25 lg:left-0 lg:h-140",
  ground: "lg:top-20 lg:left-0 lg:w-250 h-auto",
  poison: "lg:top-0 lg:-left-5 lg:h-110",
  fighting: "lg:top-0 lg:left-0 lg:h-110",
  psychic: "lg:top-0 lg:-left-5 lg:h-115",
  rock: "lg:top-10 lg:left-0 lg:h-120",
  ghost: "lg:bottom-0 lg:-left-10 lg:h-160",
  ice: "lg:top-10 lg:left-0 lg:h-110",
  dragon: "lg:top-0 lg:left-0 lg:h-130",
  flying: "lg:top-5 lg:left-0 lg:h-120",
  dark: "lg:top-0 lg:-left-5 lg:h-120",
  steel: "lg:-top-5 lg:left-0 lg:h-120",
  fairy: "lg:top-15 lg:left-0 lg:h-100",
};

export const ABILITY_COLORS: Record<string, { normal: string; hidden: string }> = {
  grass: { normal: "bg-[#65C85F]", hidden: "bg-[#4B9A47]" },
  water: { normal: "bg-[#248BCD]", hidden: "bg-[#2671A1]" },
  fire: { normal: "bg-[#FF823A]", hidden: "bg-[#E66007]" },
  bug: { normal: "bg-[#B2C12C]", hidden: "bg-[#8DA126]" },
  electric: { normal: "bg-[#F0CE24]", hidden: "bg-[#D4BD10]" },
  ice: { normal: "bg-[#68B4E5]", hidden: "bg-[#358AC1]" },
  poison: { normal: "bg-[#A467EF]", hidden: "bg-[#7244DF]" },
  fighting: { normal: "bg-[#CD2424]", hidden: "bg-[#A12626]" },
  ground: { normal: "bg-[#D9985A]", hidden: "bg-[#BA7E3A]" },
  psychic: { normal: "bg-[#CD24CD]", hidden: "bg-[#9326A1]" },
  flying: { normal: "bg-[#2A67D7]", hidden: "bg-[#2649A1]" },
  rock: { normal: "bg-[#CDAE56]", hidden: "bg-[#AA975F]" },
  ghost: { normal: "bg-[#6A24CD]", hidden: "bg-[#3126A1]" },
  dragon: { normal: "bg-[#244ECD]", hidden: "bg-[#002AB4]" },
  dark: { normal: "bg-[#7E7E7E]", hidden: "bg-[#46494B]" },
  steel: { normal: "bg-[#9A9A9A]", hidden: "bg-[#6D7579]" },
  fairy: { normal: "bg-[#EC61C2]", hidden: "bg-[#BE2D9A]" },
  normal: { normal: "bg-[#A5A580]", hidden: "bg-[#7E7E62]" },
};

export const DARK_TEXT_TYPES = ["dark", "ghost", "steel"];

export function isDarkTextType(type: string): boolean {
  return DARK_TEXT_TYPES.includes(type);
}

export function getTypeGradient(type: string): string {
  return TYPE_GRADIENTS[type] || "";
}

export function getTypeBgPosition(type: string): string {
  return TYPE_BG_POSITIONS[type] || "";
}

export function getAbilityColor(type: string, isHidden: boolean): string {
  const colors = ABILITY_COLORS[type] || ABILITY_COLORS.normal;
  return isHidden ? colors.hidden : colors.normal;
}