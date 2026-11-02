import { useTranslate, useLocale } from "./locale";
import { es, enUS } from "react-day-picker/locale";
import { useId, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { facilityToday, isCalendarDate } from "../lib/calendar";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
function localDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}
function dateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
/** shadcn Calendar + Radix Popover. The named field remains a standard GET form value. */
export function DateField({
  name,
  label,
  defaultValue = "",
  required = false,
  maxDate,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  maxDate?: string;
}) {
  const t = useTranslate(),
    { locale } = useLocale();
  const id = useId(),
    input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue),
    [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() =>
    localDate(isCalendarDate(defaultValue) ? defaultValue : facilityToday()),
  );
  function choose(date?: Date) {
    setValue(date ? dateString(date) : "");
    input.current?.setCustomValidity("");
    setOpen(false);
  }
  return (
    <div className="date-field">
      <label htmlFor={id}>{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="date-field-control">
            <input
              ref={input}
              id={id}
              name={name}
              required={required}
              type="text"
              inputMode="numeric"
              placeholder="YYYY-MM-DD"
              value={value}
              pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
              aria-describedby={`${id}-hint`}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={`${id}-calendar`}
              autoComplete="off"
              onClick={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "Enter") {
                  event.preventDefault();
                  setOpen(true);
                }
              }}
              onChange={(event) => {
                const next = event.target.value;
                setValue(next);
                event.target.setCustomValidity(
                  next &&
                    (!isCalendarDate(next) || (!!maxDate && next > maxDate))
                    ? t("Enter a valid date as YYYY-MM-DD.")
                    : "",
                );
                if (isCalendarDate(next)) setMonth(localDate(next));
              }}
            />
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="date-trigger"
                aria-label={`${t("Choose date")}: ${label}`}
              >
                <CalendarDays className="size-5" />
              </Button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>
        <PopoverContent
          id={`${id}-calendar`}
          align="start"
          side="bottom"
          collisionPadding={12}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="sbh-date-popover"
          aria-label={`${label} calendar`}
        >
          <p className="calendar-kicker">{label}</p>
          <Calendar
            locale={locale === "es" ? es : enUS}
            disabled={maxDate ? { after: localDate(maxDate) } : undefined}
            mode="single"
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            selected={isCalendarDate(value) ? localDate(value) : undefined}
            onSelect={choose}
            startMonth={new Date(1900, 0)}
            endMonth={maxDate ? localDate(maxDate) : new Date(2100, 11)}
            autoFocus
            className="sbh-calendar"
          />
          <div className="calendar-footer">
            <Button
              type="button"
              variant="ghost"
              onClick={() => choose(localDate(facilityToday()))}
            >
              {t("Today")}
            </Button>
            <Button type="button" variant="ghost" onClick={() => choose()}>
              {t("Clear")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              {t("Close")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <span id={`${id}-hint`} className="sr-only">
        {t(
          maxDate
            ? "Enter YYYY-MM-DD or choose a date of birth."
            : "Enter YYYY-MM-DD or open the calendar. Filter dates use America/New_York.",
        )}
      </span>
    </div>
  );
}
