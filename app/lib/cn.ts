import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
/** Shared shadcn class combiner; caller overrides resolve predictably. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
