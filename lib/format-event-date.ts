import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale/it";

/** Formats an ISO date string to "mercoledì 24 maggio" */
export function formatEventDate(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, "EEEE d MMMM", { locale: it });
}
