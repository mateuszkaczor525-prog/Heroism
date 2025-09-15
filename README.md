# Hero-ish — Rozbudowany starter RPG (prototyp)

To jest rozbudowana wersja prototypu RPG (przeglądarkowy), wzorowana mechaniką na Hero Zero.
Zawiera:
- system postaci (statystyki, exp, monety, ekwipunek),
- misje (różne trudności, warianty ryzykowny/bezpieczny),
- trening (wydawanie energii → punkty umiejętności),
- sklep (rotujące oferty),
- prosty autosave w localStorage,
- przykładowe, lekkie grafiki SVG (assets/svg).

## Jak uruchomić lokalnie
Najprościej uruchomić prosty serwer, np:
```
npx http-server
```
Albo:
```
python3 -m http.server 8000
```
Otwórz `http://localhost:8000` i kliknij `index.html`.

> Jeśli otworzysz plik bez serwera (file://) fetch() do folderu data/ może nie działać — dlatego uruchom serwer lokalny lub wrzuć repo na GitHub Pages.

## Deploy na GitHub Pages
1. Stwórz repo na GitHub i wypchnij pliki.
2. W ustawieniach repo: Pages → wybierz branch `main` i folder root.
3. Po kilku minutach strona będzie dostępna.

## Co dalej?
- Możemy dodać więcej grafik z Kenney (CC0), animacje, dźwięki OGG, rozbudowaną walkę turową, system plecaka, craft.
- Jeśli chcesz, mogę przygotować automatyczny workflow do deploy (GitHub Actions) lub rozszerzyć mechanikę walki.

