import React from 'react';
import ReactDOM from 'react-dom/client';
import './public-site.css';

const principles = [
  ['01', 'Människan först', 'LIV börjar med personen – aldrig med diagnosen, systemen eller dokumenten.'],
  ['02', 'Minnen som får leva', 'Små ögonblick, relationer och berättelser samlas till ett helt liv.'],
  ['03', 'Familjen tillsammans', 'De människor som känner och älskar personen kan bidra till samma gemensamma berättelse.'],
  ['04', 'Tryggt och enkelt', 'Tekniken ska finnas i bakgrunden och göra det lättare att minnas, förstå och vara nära.'],
];

function App() {
  return (
    <div className="public-site">
      <header className="site-header">
        <a className="site-brand" href="#top" aria-label="LIV startsida">
          <span className="brand-mark">LIV</span>
          <span className="brand-line">Varje liv är värt att bevara.</span>
        </a>
        <nav aria-label="Huvudnavigation">
          <a href="#varfor">Varför LIV</a>
          <a href="#sa-fungerar-det">Så fungerar det</a>
          <a href="#grundarfamiljer">LIV 100</a>
          <a className="nav-cta" href="/app.html">Öppna LIV</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">ETT LIV · EN BERÄTTELSE · TILLSAMMANS</p>
            <h1>Ingen människas historia ska gå förlorad.</h1>
            <p className="hero-intro">
              LIV är en trygg och enkel plats där människor, familjer och andra viktiga personer kan
              bevara vardagen, minnena, relationerna och det som gör en människa till den hon är.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#grundarfamiljer">Bli en grundarfamilj</a>
              <a className="button button-secondary" href="/app.html">Utforska LIV</a>
            </div>
            <p className="free-note">LIV lanseras kostnadsfritt för familjer som vill använda och utveckla tjänsten tillsammans med oss.</p>
          </div>
          <div className="hero-card" aria-label="Exempel på ett liv i LIV">
            <div className="portrait-placeholder"><span>V</span></div>
            <p className="card-label">ETT LIV I LIV</p>
            <h2>Det här är Viktor.</h2>
            <p>Varm, nyfiken, omtänksam. Tycker om musik, promenader, tåg, glass och att hjälpa till.</p>
            <div className="memory-strip">
              <span>En bra dag</span>
              <strong>Musik · Familjen · Ansvar</strong>
            </div>
          </div>
        </section>

        <section className="manifest-strip">
          <p>Alla människor har ett liv.</p>
          <p>Alla människor har en historia.</p>
          <strong>Alla människor har rätt att bli ihågkomna.</strong>
        </section>

        <section className="content-section story-section" id="varfor">
          <div className="section-number">01</div>
          <div className="section-heading">
            <p className="eyebrow">VARFÖR LIV FINNS</p>
            <h2>Ett liv är mer än uppgifter i olika system.</h2>
          </div>
          <div className="story-copy">
            <p>
              Ett människoliv ryms inte i en journal, en pärm eller ett fotoalbum. Det finns i vardagen,
              i relationerna, i favoritsångerna, i det som skapar trygghet och i de små ögonblick som annars lätt glöms bort.
            </p>
            <p>
              LIV hjälper familjen att samla detta på en plats. Inte för att skapa mer administration,
              utan för att göra det enklare att förstå, minnas och dela det som verkligen betyder något.
            </p>
          </div>
        </section>

        <section className="principles-grid" aria-label="LIV:s principer">
          {principles.map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </section>

        <section className="how-section" id="sa-fungerar-det">
          <div className="section-heading light-heading">
            <p className="eyebrow">SÅ FUNGERAR DET</p>
            <h2>Bygg ett liv tillsammans, en dag i taget.</h2>
          </div>
          <div className="steps">
            <article><span>01</span><h3>Berätta om personen</h3><p>Samla det som skapar glädje, trygghet, förståelse och en bra vardag.</p></article>
            <article><span>02</span><h3>Bevara dagarna</h3><p>Spara minnen, händelser, bilder, lärdomar och sådant familjen vill komma ihåg.</p></article>
            <article><span>03</span><h3>Dela med rätt människor</h3><p>Låt familj och andra viktiga personer bidra till samma sammanhängande berättelse.</p></article>
          </div>
        </section>

        <section className="founders-section" id="grundarfamiljer">
          <div>
            <p className="eyebrow">LIV 100 · GRUNDARFAMILJERNA</p>
            <h2>Hjälp oss bygga Sveriges varmaste plats för att bevara ett människoliv.</h2>
          </div>
          <div className="founders-copy">
            <p>
              Vi söker de första 100 familjerna som vill börja använda LIV kostnadsfritt och hjälpa oss göra tjänsten ännu bättre.
              Ni får en direkt väg in till utvecklingen och blir för alltid en del av LIV:s historia.
            </p>
            <a className="button button-primary" href="mailto:hej@livplattformen.se?subject=Jag%20vill%20bli%20en%20LIV%20100-grundarfamilj">Anmäl familjens intresse</a>
            <small>Ingen kostnad. Ingen reklam. Bara en trygg plats och ärlig återkoppling.</small>
          </div>
        </section>

        <section className="organisation-section">
          <p className="eyebrow">FÖR FÖRENINGAR OCH VERKSAMHETER</p>
          <h2>Arbetar ni nära personer och familjer som LIV kan hjälpa?</h2>
          <p>Vi vill gärna samarbeta med föreningar, anpassade skolor, LSS-verksamheter, dagliga verksamheter och andra som delar vårt uppdrag.</p>
          <a href="mailto:hej@livplattformen.se?subject=Samarbete%20med%20LIV">Prata med oss →</a>
        </section>
      </main>

      <footer>
        <div><strong>LIV</strong><p>Ingen människas historia ska gå förlorad.</p></div>
        <div className="footer-links"><a href="mailto:hej@livplattformen.se">Kontakt</a><a href="/app.html">Öppna LIV</a></div>
        <p className="copyright">© 2026 LIV. Byggt med omsorg för människor och deras berättelser.</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
