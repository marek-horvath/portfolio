// Each entry pairs Slovak and English descriptions of the same verified scope.
const details = {
  "workspace-manager": {
    type: ["Desktopová aplikácia", "Desktop application"],
    problem: ["Pri práci s viacerými repozitármi sa Git, Docker a lokálne prostredie spravujú na rôznych miestach.", "Managing several repositories spreads Git, Docker and local workspace tasks across different tools."],
    solution: ["Jedno desktopové rozhranie zobrazuje asynchrónny stav projektov a poskytuje akcie na spustenie, zastavenie či otvorenie v editore.", "One desktop interface shows asynchronous project status and provides actions to start, stop and open projects in an editor."],
    result: ["Aplikácia podporuje sťahovanie chýbajúcich repozitárov a obnovu pracovného prostredia so zachovaním záloh.", "The application supports downloading missing repositories and restoring a workspace while preserving backups."],
    decisions: ["Tauri 2 prepája React rozhranie s Pythonom cez Rust a JSON-line IPC. Windows runtime je zabalený aj pre počítače bez vývojového toolchainu.", "Tauri 2 connects the React interface to Python through Rust and JSON-line IPC. The Windows runtime is packaged for computers without a development toolchain."],
    note: ["Desktopová aplikácia; verejný inštalátor zatiaľ nie je sprístupnený.", "Desktop application; a public installer is not available yet."]
  },
  monitoring: {
    type: ["Prevádzkový dashboard", "Operations dashboard"],
    problem: ["Dostupnosť služieb, infraštruktúra a návštevnosť potrebujú spoločný prevádzkový prehľad.", "Service availability, infrastructure and traffic need a shared operational overview."],
    solution: ["Vlastná integračná vrstva prepája HTTP/TLS kontroly, metriky Promethea a Grafany a štatistiky Plausible CE.", "A custom integration layer combines HTTP/TLS checks, Prometheus and Grafana metrics, and Plausible CE statistics."],
    result: ["Jedno chránené rozhranie zobrazuje latencie, stav endpointov, CPU, pamäť, disk a agregovanú návštevnosť.", "One protected interface displays latency, endpoint status, CPU, memory, disk usage and aggregate traffic."],
    decisions: ["Podpísaná session, serverová proxy a read-only Stats API oddeľujú rozhranie od prístupov k službám. Prevádzka využíva Docker Compose a Caddy.", "A signed session, server-side proxy and read-only Stats API separate the interface from service credentials. Operations use Docker Compose and Caddy."],
    note: ["Súkromná aplikácia s prihlásením. Grafana, Prometheus a Plausible sú integrované nástroje tretích strán; okamžitý stav nevyjadruje dlhodobé SLA.", "Private application requiring sign-in. Grafana, Prometheus and Plausible are integrated third-party tools; a current health snapshot is not a long-term SLA."]
  },
  "fei-rozvrh": {
    type: ["Rozvrhový nástroj", "Timetable tool"],
    problem: ["Porovnávanie rozvrhov pedagógov, skupín a miestností býva zdĺhavé.", "Comparing teacher, group and room timetables can be time-consuming."],
    solution: ["Crawler ukladá verejné rozvrhy do SQLite; rozhranie pridáva filtre, porovnávanie a spoločné voľné časy.", "A crawler stores public timetables in SQLite; the interface adds filters, comparisons and shared free slots."],
    result: ["Obľúbené položky a jednostranový PDF export pomáhajú pri každodennom plánovaní.", "Favourites and a single-page PDF export support everyday planning."],
    decisions: ["Python, Flask a Waitress obsluhujú API, SQLite uchováva dáta a ReportLab vytvára PDF.", "Python, Flask and Waitress serve the API, SQLite stores data and ReportLab generates PDFs."],
    note: ["Verejný odkaz na aktuálny frontend zatiaľ nie je dostupný.", "A public URL for the current frontend is not available yet."]
  },
  athena: {
    type: ["Univerzitná platforma", "University platform"],
    problem: ["Programátorské zadania potrebujú opakovateľné testovanie a prehľadné výsledky bez ručného spúšťania každého riešenia.", "Programming assignments need repeatable testing and clear results without manually running every submission."],
    solution: ["Platforma integruje GitLab, izolované testovanie v Docker kontajneroch a dashboard na prehliadanie výsledkov, podobnosti a zdrojových kódov.", "The platform integrates GitLab, isolated testing in Docker containers and a dashboard for reviewing results, similarity and source code."],
    result: ["Výsledky sa ukladajú na ďalšiu kontrolu; editor a terminál poskytujú kontext priamo v dashboarde.", "Results are stored for later review, with an editor and terminal providing context directly in the dashboard."],
    decisions: ["React/TypeScript rozhranie komunikuje s Python/FastAPI backendom. Produkčný backend podporuje PostgreSQL a lokálny režim SQLite.", "The React/TypeScript interface communicates with a Python/FastAPI backend. Storage supports PostgreSQL in production and SQLite locally."],
    note: ["Tímový univerzitný projekt. Opis sa týka systému ako celku; nepripisuje autorstvo všetkých modulov jednej osobe. Záber je archívny.", "Team university project. This describes the overall system without attributing every module to one person. The screenshot is archival."]
  },
  "python-course": {
    type: ["Výučbový portál", "Teaching portal"],
    solution: ["Prednášky, cvičenia a interaktívne doplnky sú dostupné na jednom webe.", "Lectures, exercises and interactive supplements are available on one website."],
    decisions: ["Astro a TypeScript tvoria web, Node.js a PptxGenJS pripravujú prezentačné podklady. Python je predmet výučby.", "Astro and TypeScript power the website; Node.js and PptxGenJS prepare presentation materials. Python is the subject being taught."]
  },
  workweek: {
    type: ["Študentská supervízia", "Student supervision"],
    solution: ["Týždenné reporty, komentáre, témy a konzultácie prepájajú študenta so supervízorom.", "Weekly reports, comments, topics and consultations connect students and supervisors."],
    decisions: ["React/TypeScript, Express 5 a Prisma so SQLite. Oddelené roly, Argon2, JWT a PDFKit zabezpečujú prístup a exporty.", "React/TypeScript, Express 5 and Prisma with SQLite. Separate roles, Argon2, JWT and PDFKit support access control and exports."],
    note: ["Obsah vyžaduje prihlásenie. Reálne študentské reporty a prístupové údaje nie sú súčasťou ukážky.", "Content requires sign-in. Real student reports and credentials are not included in the showcase."]
  },
  neurologia: {
    type: ["Rezervačný systém", "Booking system"],
    problem: ["Ambulancia potrebuje spojiť rezervovanie termínov, administráciu a komunikáciu s pacientmi.", "A medical practice needs to connect appointment booking, administration and patient communication."],
    solution: ["Pacienti si rezervujú dostupný termín, administrácia spravuje návštevy a systém posiela e-mailové pripomienky.", "Patients book available appointments, administrators manage visits and the system sends email reminders."],
    result: ["Rezervácie, stavy návštev a pripomienky sú súčasťou jednej aplikácie.", "Reservations, visit statuses and reminders form one application."],
    decisions: ["Next.js 15 a TypeScript s Prisma/PostgreSQL, validáciou cez Zod a e-mailmi cez Nodemailer; dátumy zohľadňujú časové pásma.", "Next.js 15 and TypeScript with Prisma/PostgreSQL, Zod validation and Nodemailer emails; date handling accounts for time zones."],
    note: ["Ukážka neobsahuje osobné údaje pacientov.", "The showcase does not include patient personal data."]
  },
  "football-predictions": {
    type: ["Tipovacia aplikácia", "Prediction app"],
    solution: ["Tipy na futbalové výsledky, vyhodnocovanie a rebríčky na porovnávanie s kamarátmi.", "Football predictions, result evaluation and leaderboards for comparing picks with friends."],
    decisions: ["Bun a Hono renderujú serverové JSX; dáta sú v SQLite s voliteľným Appwrite adaptérom. Frontend nepoužíva React.", "Bun and Hono render server-side JSX; data uses SQLite with an optional Appwrite adapter. The frontend does not use React."],
    note: ["Verejný odkaz zatiaľ nie je sprístupnený.", "A public URL is not available yet."]
  },
  "hraj-sk": {
    type: ["Herná platforma", "Game platform"],
    problem: ["Browserové hry potrebujú spoločné relácie a férové spracovanie skóre na serveri.", "Browser games need shared session handling and fair server-side score processing."],
    solution: ["Platforma združuje hry, anonymné relácie a verejné rebríčky bez povinnej registrácie.", "The platform brings together games, anonymous sessions and public leaderboards without mandatory registration."],
    result: ["Projekt obsahuje 11 hier podľa projektovej dokumentácie a API na overovanie výsledkov.", "The project includes 11 games according to its documentation and an API for validating results."],
    decisions: ["Next.js frontend a NestJS API v monorepe so zdieľanými balíkmi, Prisma/PostgreSQL a HTTP-only cookies.", "A Next.js frontend and NestJS API share a monorepo with shared packages, Prisma/PostgreSQL and HTTP-only cookies."],
    note: ["Lokálny projekt; verejné demo zatiaľ nie je sprístupnené.", "Local project; a public demo is not available yet."]
  },
  "programmers-day": {
    type: ["Desktopová hra", "Desktop game"],
    problem: ["Ako premeniť kancelársky pracovný deň na kombináciu rozhodovania, komunikácie a logických úloh?", "How can an office workday become a mix of decisions, communication and logic puzzles?"],
    solution: ["Retro desktop spája Mail, Tasks, Meets a ďalšie aplikácie s dátovo riadenou kampaňou.", "A retro desktop connects Mail, Tasks, Meets and other apps with a data-driven campaign."],
    result: ["Hrateľný základ obsahuje projektové rozhodnutia, ekonomiku, minihry a checkpointové ukladanie.", "The playable foundation includes project decisions, an economy, minigames and checkpoint saves."],
    decisions: ["Godot .NET a C# spracúvajú hernú logiku, JSON definície dni a scenáre a Godot resources jednotlivé scény.", "Godot .NET and C# handle gameplay, JSON definitions describe days and scenarios, and Godot resources compose the scenes."],
    note: ["Archívne vývojové QA zábery; verejný build zatiaľ nie je sprístupnený.", "Archival development QA captures; a public build is not available yet."]
  },
  "guess-who": {
    type: ["Multiplayerová hra", "Multiplayer game"],
    solution: ["Dedukčná hra s miestnosťami, pripojením cez kód a postupným vyraďovaním postáv.", "A deduction game with rooms, join codes and progressive character elimination."],
    decisions: ["React a TypeScript na klientovi, Node.js/Express a Socket.IO pre komunikáciu hráčov v reálnom čase.", "React and TypeScript on the client, with Node.js/Express and Socket.IO for real-time player communication."]
  },
  "bandito-signal": {
    type: ["Interaktívny príbeh", "Interactive narrative"],
    solution: ["Ilustrované kapitoly prepájajú vetvené voľby, skryté následky, viacero koncov a krátke 2D minihry.", "Illustrated chapters combine branching choices, hidden consequences, multiple endings and short 2D minigames."],
    decisions: ["React/TypeScript, Vite a Framer Motion pre herné rozhranie a prechody.", "React/TypeScript, Vite and Framer Motion power the game interface and transitions."],
    note: ["Neoficiálny fan projekt inšpirovaný Twenty One Pilots.", "An unofficial fan project inspired by Twenty One Pilots."]
  },
  slovakdle: {
    type: ["Browserová hra", "Browser game"],
    solution: ["Wordle-inšpirované hádanie slovenských osobností a údajov so spätnou väzbou k pokusom.", "Wordle-inspired guessing of Slovak personalities and attributes with feedback on each attempt."],
    decisions: ["Next.js, React a Tailwind CSS; PapaParse spracúva herné dáta.", "Next.js, React and Tailwind CSS; PapaParse processes game data."]
  },
  seug: {
    type: ["Akademický web", "Academic website"],
    solution: ["Profily ľudí, aktivity a publikácie výskumnej skupiny dopĺňa automatizovaná synchronizácia bibliografie cez OpenAlex.", "Research-group profiles, activities and publications are supported by automated bibliography synchronization through OpenAlex."],
    decisions: ["Vue 3 a Vue Router s Node.js backendom a JSON úložiskom; CSV spracovanie cez PapaParse.", "Vue 3 and Vue Router with a Node.js backend and JSON storage; PapaParse handles CSV data."],
    note: ["Inštitucionálny web; opis predstavuje systém bez tvrdenia o výlučnom autorstve všetkých častí.", "Institutional website; the description presents the system without claiming sole authorship of every part."]
  },
  cnk: {
    type: ["Komunitný web", "Community website"],
    solution: ["Program, história meetupov, miesto konania a kontakt pre komunitu Cloud Native Košice.", "Schedules, past meetups, location and contact information for the Cloud Native Košice community."],
    decisions: ["Vue 3 frontend dopĺňa Python HTTP API a SQLite na správu obsahu a odberateľov.", "A Vue 3 frontend is supported by a Python HTTP API and SQLite for content and subscriber management."]
  },
  krajcirstvo: {
    type: ["Web služieb", "Service website"],
    solution: ["Služby, cenník a kontaktný tok v mobilnom aj desktopovom rozložení, s vlastnou administráciou a analytikou.", "Services, pricing and contact flow in mobile and desktop layouts, with custom administration and analytics."],
    decisions: ["Vue 3/Vite s Node.js API, SQLite a Dockerom.", "Vue 3/Vite with a Node.js API, SQLite and Docker."],
    note: ["Verejný rezervačný formulár je momentálne vypnutý.", "The public booking form is currently disabled."]
  },
  revik: {
    type: ["Firemný web", "Business website"],
    solution: ["Prehľadná ponuka čistiacich služieb, kontaktné akcie a interaktívna mapa.", "A clear cleaning-service offering, contact actions and an interactive map."],
    decisions: ["Vue 3, Tailwind CSS a Leaflet cez vue3-leaflet.", "Vue 3, Tailwind CSS and Leaflet through vue3-leaflet."]
  },
  algoritmization: {
    type: ["Výučbový web", "Teaching website"],
    solution: ["Materiály k algoritmizácii dopĺňa vizualizačná časť s vývojovými diagramami.", "Algorithmization materials are complemented by a flowchart-oriented learning interface."],
    decisions: ["Statický web v HTML, CSS a JavaScripte s PDF a prezentačnými podkladmi.", "A static HTML, CSS and JavaScript website with PDF and presentation materials."]
  },
  cardiocheck: {
    type: ["UX prototyp", "UX prototype"],
    solution: ["Podmienené formuláre, validácia vstupov, témy, SK/EN a ilustračná správa skúmajú používateľský tok kardiovaskulárnych vstupov.", "Conditional forms, input validation, themes, SK/EN and an illustrative report explore the user flow for cardiovascular inputs."],
    decisions: ["Expo SDK 54, React Native Web a TypeScript tvoria spoločný základ pre webové a mobilné rozloženie.", "Expo SDK 54, React Native Web and TypeScript provide a shared foundation for web and mobile layouts."],
    note: ["UX prototyp bez backendu, databázy a klinickej validácie. Ilustračné grafy nie sú výsledky pacientov; nejde o zdravotnícku pomôcku.", "UX prototype without a backend, database or clinical validation. Illustrative charts are not patient results; this is not a medical device."]
  }
};

export function getProjectDetails(id, language) {
  const index = language === "sk" ? 0 : 1;
  return Object.fromEntries(Object.entries(details[id]).map(([key, value]) => [key, value[index]]));
}
