const NAVIGATION_LOCK_MS = 900;

let lockedUntil = 0;

export function canStartNavigation() {
  return Date.now() >= lockedUntil;
}

export function beginNavigationLock() {
  lockedUntil = Date.now() + NAVIGATION_LOCK_MS;
}

export function releaseNavigationLock() {
  lockedUntil = 0;
}
