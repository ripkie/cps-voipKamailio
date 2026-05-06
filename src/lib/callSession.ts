let currentSession: any = null;

export function setSession(session: any) {
  currentSession = session;
}

export function getSession(): any {
  return currentSession;
}

export function clearSession() {
  currentSession = null;
}