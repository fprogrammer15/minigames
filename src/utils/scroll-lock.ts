const LOCKED_CLASS = 'is-locked';

export function lockScroll(): void {
  document.body.classList.add(LOCKED_CLASS);
}

export function unlockScroll(): void {
  document.body.classList.remove(LOCKED_CLASS);
}
