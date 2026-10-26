/** Appwrite's Node SDK transport, adapted to Workers' native HTTPS fetch. */
export const fetch = (input, options) => {
  if (options?.dispatcher) throw new Error('Custom TLS dispatchers are not supported on Workers. Use a trusted HTTPS Appwrite endpoint.');
  return globalThis.fetch(input, options);
};
export const FormData = globalThis.FormData;
export const File = globalThis.File;
export class Agent {
  constructor() { throw new Error('Custom TLS agents are not supported on Workers.'); }
}
