// i18n: authored text uses the shared locale dictionary; values and destinations stay unchanged.
import { T, useTranslate } from "./locale";
import { useCookieConsent } from "./cookie-consent";
import { site } from "../data/site";
export function LocationMap() {
    const translate = useTranslate();
    const { externalMedia: loaded, allowMedia } = useCookieConsent();
    return loaded ? (<iframe className="location-map-frame" title={translate("Swiss Behavioral Health contact location in Oldsmar")} src={site.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer" allowFullScreen/>) : (<div className="location-diagram">
      <span><T>{"SBH"}</T></span>
      <small><T>{"209 STATE ST E"}</T><br /><T>{"OLDSMAR, FLORIDA"}</T></small>
      <button className="retreat-button" type="button" onClick={allowMedia}><T>{"Allow Google Maps & load \u2197"}</T></button>
      <p className="editorial-small"><T>{"Loads Google Maps. Google will receive connection information."}</T></p>
    </div>);
}
