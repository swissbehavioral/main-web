// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T } from "./locale";
import type { NavigationArt as ArtKind } from "../data/navigation";
/** Brand illustrations rather than unverified facility or staff photography. */
export function NavigationArt({ kind, label, }: {
    kind: ArtKind;
    label: string;
}) {
    return (<div className={`navigation-art navigation-art-${kind}`} aria-hidden="true">
      <svg viewBox="0 0 320 156" fill="none" focusable="false">
        <T>{kind === "approach" && (<>
            <circle cx="160" cy="94" r="78" stroke="currentColor" opacity=".15"/>
            <circle cx="160" cy="94" r="59" stroke="currentColor" opacity=".12"/>
            <circle cx="207" cy="49" r="17" fill="currentColor" opacity=".16"/>
            <path d="M49 156 132 54l44 57 29-34 68 79" fill="currentColor" opacity=".13"/>
            <path d="m92 156 64-81 64 81" fill="currentColor" opacity=".32"/>
            <path d="m132 54 20 26-20-9-12 8 12-25Z" fill="#ffffff"/>
            <path d="M0 142c75-17 108 18 179 0s105-7 141-2v16H0Z" fill="currentColor" opacity=".1"/>
          </>)}</T>
        <T>{kind === "treatment" && (<>
            <path d="M32 112h256" stroke="currentColor" opacity=".13"/>
            <path d="M66 98V72c0-8 6-14 14-14h35c8 0 14 6 14 14v26M129 98V56c0-8 6-14 14-14h35c8 0 14 6 14 14v42M192 98V39c0-8 6-14 14-14h35c8 0 14 6 14 14v59" fill="currentColor" opacity=".1"/>
            <path d="m75 88 47-16 65-17 50-16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".5"/>
            <T>{[
                [75, 88],
                [122, 72],
                [187, 55],
                [237, 39],
            ].map(([cx, cy]) => (<circle key={cx} cx={cx} cy={cy} r="4" fill="currentColor"/>))}</T>
            <text x="94" y="132" textAnchor="middle"><T>{"PHP"}</T></text>
            <text x="160" y="132" textAnchor="middle"><T>{"IOP"}</T></text>
            <text x="225" y="132" textAnchor="middle"><T>{"OP"}</T></text>
          </>)}</T>
        <T>{kind === "admissions" && (<>
            <rect x="98" y="20" width="123" height="139" rx="11" fill="#ffffff" stroke="currentColor" strokeOpacity=".12"/>
            <rect x="128" y="14" width="64" height="17" rx="6" fill="currentColor" opacity=".2"/>
            <T>{[54, 82, 110].map((y) => (<g key={y}>
                <circle cx="121" cy={y} r="7" fill="currentColor" opacity=".12"/>
                <path d={`m118 ${y} 2 2 4-4`} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d={`M139 ${y - 2}h58M139 ${y + 4}h37`} stroke="currentColor" strokeOpacity=".3" strokeLinecap="round"/>
              </g>))}</T>
            <circle cx="228" cy="115" r="24" fill="currentColor"/>
            <path d="M218 115h20m-7-7 7 7-7 7" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>)}</T>
        <T>{kind === "resources" && (<>
            <path d="M61 46c34-11 65-6 99 9 34-15 65-20 99-9v88c-34-11-65-6-99 9-34-15-65-20-99-9V46Z" fill="#ffffff" stroke="currentColor" strokeOpacity=".16"/>
            <path d="M160 55v88M80 65c24-4 43 0 61 7M80 80c24-4 43 0 61 7M80 95c24-4 43 0 61 7M179 72c24-8 43-10 61-7M179 87c24-8 43-10 61-7M179 102c24-8 43-10 61-7" stroke="currentColor" strokeOpacity=".3"/>
            <path d="M209 22v42l9-5 9 2V20" fill="currentColor" opacity=".5"/>
          </>)}</T>
      </svg>
      <span><T>{label}</T></span>
    </div>);
}
