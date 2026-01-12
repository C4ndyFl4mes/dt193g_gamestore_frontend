# gamestore_frontend

## Beskrivning
En frontend-applikation för att hantera lagret i en spelbutik. Applikationen tillåter användare att lägga till, uppdatera, ta bort och visa spel i lagret. Den är byggd med Vue.js och använder Axios för att kommunicera med backend-API:et som använder ramverket Fastify. CSS-ramverket Tailwind CSS används för att skapa en responsiv och användarvänlig design.

## Komponenter

### Base
GameForm.vue - Ett formulär för att lägga till och uppdatera spel i lagret. Innehåller fält för spelnamn, plattform, pris och lagerstatus.
GameOverlay.vue - En överläggskomponent som visar detaljerad information om ett spel när användaren klickar på det i spel-listan. Här kan användaren också uppdatera eller ta bort spelet.
GenreForm.vue - Ett formulär för att lägga till nya genrer till spelbutiken. Men också radera eller uppdatera befintliga genrer.
GenreSelector.vue - En dropdown-komponent som låter användaren välja en genre när de lägger till eller uppdaterar ett spel.
GameItem.vue - En komponent som representerar ett enskilt spel i spel-listan. Visar grundläggande information som lagersaldostatus om spelet och hanterar klickhändelser för att visa GameOverlay.

### Layout
Footer.vue - En enkel sidfot för applikationen som innehåller upphovsrättsinformation.
Header.vue - En sidhuvudskomponent som innehåller applikationens titel.
Navigation.vue - En navigationsmeny som låter användaren navigera mellan olika sektioner av applikationen, såsom spel-listan och genre-hantering.

### Views
AddPage.vue - En vy för att lägga till nya spel i lagret. Innehåller GameForm-komponenten och GenreForm.
LoginPage.vue - En vy för användarinloggning. Innehåller ett enkelt inloggningsformulär.
StoragePage.vue - Huvudvyn för applikationen som visar spellistan. Spellistan består av flera GameItem-komponenter och hanterar visningen av GameOverlay när ett spel väljs.

## Router
Applikationen använder Vue Router för att hantera navigering mellan olika vyer. De definierade rutterna inkluderar:
- `/add` - Visar AddPage-vyn för att lägga till nya spel eller genrer.
- `/` - Visar LoginPage-vyn för användarinloggning.
- `/storage` - Visar StoragePage-vyn som innehåller spellistan.

Routern skyddar också vissa rutter genom att kontrollera om användaren är inloggad innan de får åtkomst till specifika sidor.

## Auth Store
Applikationen använder Pinia för att hantera autentiseringstillstånd. Auth Store innehåller:
- `isAuthenticated` - En boolean som indikerar om användaren är inloggad.
- `setAuthenticated` - En åtgärd för att uppdatera autentiseringstillståndet.

## Axios
Axios används för att göra HTTP-förfrågningar till backend-API:et. Axios används i olika komponenter för att hämta, lägga till, uppdatera och ta bort spel från lagret samt autentisering.

### Authentication
Funktioner för att hantera användarinloggning och utloggning genom att skicka förfrågningar till backend-API:et.

### Games
Funktioner för att hämta, lägga till, uppdatera och ta bort spel i lagret genom att kommunicera med backend-API:et.

### Genres
Funktioner för att hantera genrer, inklusive att hämta, lägga till, uppdatera och ta bort genrer från backend-API:et.