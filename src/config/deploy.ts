/**
 * Konfiguracja wdrożenia (Deploy Configuration)
 * 
 * Ten plik zawiera ustawienia niezbędne do poprawnego działania aplikacji
 * po wdrożeniu na GitHub Pages (lub inne środowiska).
 */

export const deployConfig = {
  // Nazwa repozytorium na GitHubie (np. 'TestXIV')
  // Bez początkowych i końcowych ukośników!
  repoName: '/',
  
  // Czy aplikacja jest budowana pod GitHub Pages?
  // UWAGA: Zmień na TRUE tuż przed zrobieniem commita i pusha na GitHuba!
  // Do testowania w AI Studio lub lokalnie zostaw FALSE.
  isGitHubPages: true,
  
  // Obliczona ścieżka bazowa (base path)
  get basePath() {
    if (!this.isGitHubPages) return '/';
    // Usuwamy ewentualne ukośniki z nazwy repozytorium, żeby uniknąć błędów
    const cleanRepoName = this.repoName.replace(/^\/+|\/+$/g, '');
    return cleanRepoName ? `/${cleanRepoName}/` : '/';
  }
};
