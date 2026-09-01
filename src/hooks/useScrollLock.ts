import { useEffect } from 'react';

/**
 * Blokuje przewijanie dokumentu, gdy otwarte jest okno modalne / panel nakładkowy.
 *
 * Dzięki temu strona w tle stoi nieruchomo także wtedy, gdy kursor lub palec
 * znajduje się poza przewijalnym panelem (np. nad przyciemnionym tłem).
 *
 * Wymaga `html { scrollbar-gutter: stable; }` w index.css — miejsce na pasek
 * przewijania jest wtedy zarezerwowane na stałe i układ strony nie skacze
 * w momencie otwarcia okna.
 *
 * Uwaga: przewijalny element wewnątrz okna powinien dodatkowo mieć klasę
 * `overscroll-contain`, żeby gest nie „przeskakiwał” na dokument po dojechaniu
 * do końca listy (scroll chaining).
 */
export const useScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
};
