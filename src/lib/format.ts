export function formatBlackoutType(type: string) {
  switch (type) {
    case "ALL_DAY":
      return "Toată ziua";
    case "MORNING":
      return "🌤️ Dimineața";
    case "EVENING":
      return "🌙 Seara";
    default:
      return type;
  }
}

export function getBlackoutBadgeClass(type: string) {
  switch (type) {
    case "ALL_DAY":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20";
    case "MORNING":
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-400/20";
    case "EVENING":
      return "bg-indigo-500/15 text-indigo-300 border border-indigo-400/20";
    default:
      return "bg-white/10 text-white/80 border border-white/10";
  }
}
