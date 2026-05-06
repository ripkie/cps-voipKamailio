import { UserAgent, Registerer } from "sip.js";

let userAgent: UserAgent | null = null;
let registerer: Registerer | null = null;

export async function createSipClient({
  username,
  password,
  domain,
  wsServer,
}: {
  username: string;
  password: string;
  domain: string;
  wsServer: string;
}) {
  const uri = UserAgent.makeURI(`sip:${username}@${domain}`);

  if (!uri) throw new Error("Invalid SIP URI");

  userAgent = new UserAgent({
    uri,
    transportOptions: {
      server: wsServer,
    },
    authorizationUsername: username,
    authorizationPassword: password,
    sessionDescriptionHandlerFactoryOptions: {
      peerConnectionConfiguration: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    },
  });

  await userAgent.start();

  registerer = new Registerer(userAgent);
  await registerer.register();

  return userAgent;
}

export function getUserAgent() {
  if (!userAgent) throw new Error("SIP belum di-init");
  return userAgent;
}