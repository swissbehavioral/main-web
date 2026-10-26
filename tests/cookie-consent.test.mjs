import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCookiePreference, CONSENT_DAYS } from '../app/lib/cookie-consent.ts';
const now = Date.now();
const encode = value => encodeURIComponent(JSON.stringify(value));
test('Unrecognized or expired consent never enables external media', () => {
  for (const value of [undefined, 'bad%encoding', encode(null), encode({version:2,externalMedia:true,savedAt:now}), encode({version:1,externalMedia:'yes',savedAt:now}), encode({version:1,externalMedia:true,savedAt:now+1}), encode({version:1,externalMedia:true,savedAt:now-CONSENT_DAYS*86400000})]) assert.equal(parseCookiePreference(value, now), null);
});
test('Explicit acceptance and rejection both persist without changing the choice', () => {
  for (const externalMedia of [true,false]) {
    const value = {version:1,externalMedia,savedAt:now};
    assert.deepEqual(parseCookiePreference(encode(value),now),value);
  }
});
