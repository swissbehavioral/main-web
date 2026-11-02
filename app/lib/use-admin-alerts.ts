import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useMatches } from "react-router";
import {
  shouldShowDesktopAlert,
  unreadEvents,
  type WorkspaceEvent,
} from "./admin-alerts";
const empty = { inquiry: 0, insurance: 0, chat: 0 };
export function useAdminAlerts(userId: string) {
  const location = useLocation(),
    navigate = useNavigate(),
    current = useRef(location);
  current.current = location;
  const readable = useMatches()
    .flatMap((match) => {
      const data = match.data as
        | {
            leads?: { id: string }[];
            lead?: { id: string };
            selected?: { $id: string };
          }
        | undefined;
      return [
        ...(data?.leads || []).map((lead) => `/admin/leads/${lead.id}`),
        ...(data?.lead ? [`/admin/leads/${data.lead.id}`] : []),
        ...(data?.selected
          ? [`/admin/chat?id=${encodeURIComponent(data.selected.$id)}`]
          : []),
      ];
    })
    .join("|");
  const visibleRefs = useRef<string[]>([]);
  visibleRefs.current = readable.split("|").filter(Boolean);
  const [counts, setCounts] = useState(empty),
    [permission, setPermission] = useState("default"),
    [enabled, setEnabled] = useState(false),
    [problem, setProblem] = useState(false),
    [notice, setNotice] = useState<WorkspaceEvent | null>(null);
  const refresh = useRef<() => void>(() => {}),
    key = `sbh-alerts:${userId}`;
  useEffect(() => {
    let stopped = false,
      running = false,
      baseline: Set<string> | null = null;
    let lastEvents: WorkspaceEvent[] = [];
    const controller = new AbortController(),
      tabId = crypto.randomUUID();
    const read = (suffix: string, fallback: any) => {
      try {
        return (
          JSON.parse(localStorage.getItem(key + suffix) || "null") ?? fallback
        );
      } catch {
        return fallback;
      }
    };
    const write = (suffix: string, value: unknown) => {
      try {
        localStorage.setItem(key + suffix, JSON.stringify(value));
      } catch {}
    };
    setPermission(
      "Notification" in window ? Notification.permission : "unsupported",
    );
    setEnabled(read(":enabled", false));
    const title = () => {
      const base = document.title.replace(/^\(\d+ new\) /, "");
      const total = Object.values(
        read(":counts", empty) as typeof empty,
      ).reduce((a, b) => a + b, 0);
      document.title =
        document.hidden && total ? `(${total} new) ${base}` : base;
    };
    const update = async () => {
      if (running || stopped) return;
      running = true;
      try {
        const response = await fetch("/api/admin/notifications", {
          signal: controller.signal,
          cache: "no-store",
          redirect: "error",
        });
        if (!response.ok) throw Error("Unavailable");
        const payload = await response.json();
        if (stopped) return;
        setProblem(false);
        const events = payload.events as WorkspaceEvent[],
          seen = read(":seen", {}) as Record<string, string>,
          path = current.current.pathname;
        if (!document.hidden) {
          let changed = false;
          for (const event of events)
            if (
              visibleRefs.current.includes(event.to) &&
              Date.parse(event.at) > (Date.parse(seen[event.to] || "") || 0)
            ) {
              seen[event.to] = event.at;
              changed = true;
            }
          if (changed)
            write(
              ":seen",
              Object.fromEntries(
                Object.entries(seen)
                  .sort((a, b) => Date.parse(b[1]) - Date.parse(a[1]))
                  .slice(0, 2000),
              ),
            );
          write(":active", { id: tabId, until: Date.now() + 25000 });
        }
        lastEvents = events;
        const unread = unreadEvents(events, seen),
          next = { ...empty };
        unread.forEach((event) => next[event.kind]++);
        setCounts(next);
        write(":counts", next);
        title();
        const arrivals = baseline
          ? events.filter((event) => !baseline!.has(event.id))
          : [];
        const fresh = baseline
          ? unread.filter((event) => !baseline!.has(event.id))
          : [];
        baseline = new Set(events.map((event) => event.id));
        if (arrivals.length)
          window.dispatchEvent(new Event("sbh-workspace-update"));
        if (fresh.length) {
          const newest = fresh.sort((a, b) => b.at.localeCompare(a.at))[0];
          setNotice(newest);
          if (
            "Notification" in window &&
            shouldShowDesktopAlert({
              hidden: document.hidden,
              enabled: read(":enabled", false),
              permission: Notification.permission,
              activeUntil: read(":active", { until: 0 }).until,
              now: Date.now(),
            })
          ) {
            const send = () => {
              if (read(":delivered", []).includes(newest.id)) return;
              write(":delivered", [
                ...read(":delivered", []).slice(-199),
                newest.id,
              ]);
              const labels = {
                chat: "New chat activity",
                insurance: "New insurance inquiry",
                inquiry: "New website inquiry",
              };
              let alert: Notification;
              try {
                alert = new Notification("Swiss Behavioral Health", {
                  body: labels[newest.kind],
                  tag: `sbh-${newest.kind}`,
                  icon: "/logos/SBH_Isotipo_Color.svg",
                });
              } catch {
                return;
              }
              alert.onclick = () => {
                window.focus();
                navigate(newest.to);
                alert.close();
              };
            };
            if (navigator.locks)
              void navigator.locks
                .request(key + ":delivery", { ifAvailable: true }, (lock) => {
                  if (lock) send();
                })
                .catch(() => {});
            else send();
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setProblem(true);
        }
      } finally {
        running = false;
      }
    };
    refresh.current = () => {
      void update();
    };
    void update();
    const timer = setInterval(() => void update(), 15000);
    const change = () => {
      if (document.hidden && read(":active", {}).id === tabId)
        write(":active", { id: tabId, until: 0 });
      title();
      void update();
    };
    const sync = (event: StorageEvent) => {
      if (event.key?.startsWith(key)) {
        setEnabled(read(":enabled", false));
        if (event.key === key + ":seen") {
          const next = { ...empty };
          unreadEvents(lastEvents, read(":seen", {})).forEach(
            (event) => next[event.kind]++,
          );
          setCounts(next);
          write(":counts", next);
          title();
        }
      }
    };
    document.addEventListener("visibilitychange", change);
    window.addEventListener("focus", change);
    window.addEventListener("online", change);
    window.addEventListener("storage", sync);
    return () => {
      if (read(":active", {}).id === tabId)
        write(":active", { id: tabId, until: 0 });
      stopped = true;
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", change);
      window.removeEventListener("focus", change);
      window.removeEventListener("online", change);
      window.removeEventListener("storage", sync);
      document.title = document.title.replace(/^\(\d+ new\) /, "");
    };
  }, [userId, navigate, key]);
  useEffect(() => {
    refresh.current();
  }, [location.pathname, location.search, readable]);
  async function toggle() {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    if (enabled) {
      localStorage.setItem(key + ":enabled", "false");
      setEnabled(false);
      return;
    }
    let status: NotificationPermission;
    try {
      status = await Notification.requestPermission();
    } catch {
      setPermission("unsupported");
      return;
    }
    setPermission(status);
    if (status === "granted") {
      localStorage.setItem(key + ":enabled", "true");
      setEnabled(true);
    }
  }
  return {
    counts,
    permission,
    enabled,
    toggle,
    problem,
    notice,
    dismiss: () => setNotice(null),
  };
}
