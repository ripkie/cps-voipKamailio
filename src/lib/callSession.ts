let currentSession: any = null;

export function setSession(session: any) {
  currentSession = session;
}

export function getSession() {
  return currentSession;
}