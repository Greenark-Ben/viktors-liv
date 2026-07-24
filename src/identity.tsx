import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './identity.css';

type Role = 'Administratör' | 'Familj' | 'Stödperson' | 'Professionell';
type Permission = 'Läsa livsbild' | 'Skriva daganteckningar' | 'Hantera dokument' | 'Se ekonomi' | 'Bjuda in människor';
type Identity = {
  id: string;
  name: string;
  relation: string;
  role: Role;
  permissions: Permission[];
};
type Session = { identity: Identity; subject: 'Viktor O’Donnell Hansson'; verifiedBy: 'Utvecklarläge'; signedInAt: string };
type AuditEvent = { id: string; at: string; actor: string; action: string; subject: string };

const identities: Identity[] = [
  { id: 'ben', name: 'Ben', relation: 'Pappa och legal företrädare', role: 'Administratör', permissions: ['Läsa livsbild','Skriva daganteckningar','Hantera dokument','Se ekonomi','Bjuda in människor'] },
  { id: 'josephine', name: 'Josephine', relation: 'Familj', role: 'Familj', permissions: ['Läsa livsbild','Skriva daganteckningar','Hantera dokument'] },
  { id: 'support', name: 'Stödperson', relation: 'Inbjuden stödperson', role: 'Stödperson', permissions: ['Läsa livsbild','Skriva daganteckningar'] },
  { id: 'professional', name: 'Professionell', relation: 'Inbjuden yrkesperson', role: 'Professionell', permissions: ['Läsa livsbild'] }
];

const sessionKey = 'liv.identity.session.v1';
const auditKey = 'liv.identity.audit.v1';

function readSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch { return null; }
}
function appendAudit(event: Omit<AuditEvent,'id'|'at'>) {
  try {
    const current: AuditEvent[] = JSON.parse(localStorage.getItem(auditKey) || '[]');
    const next = [{ id: crypto.randomUUID(), at: new Date().toISOString(), ...event }, ...current].slice(0, 100);
    localStorage.setItem(auditKey, JSON.stringify(next));
  } catch { /* prototype audit must never block sign-in */ }
}

function Login({ onSignedIn }: { onSignedIn: (session: Session) => void }) {
  const [step, setStep] = useState<'welcome'|'identity'|'subject'>('welcome');
  const [selected, setSelected] = useState<Identity>(identities[0]);

  const complete = () => {
    const session: Session = { identity: selected, subject: 'Viktor O’Donnell Hansson', verifiedBy: 'Utvecklarläge', signedInAt: new Date().toISOString() };
    localStorage.setItem(sessionKey, JSON.stringify(session));
    appendAudit({ actor: selected.name, action: 'Loggade in och valde relation', subject: session.subject });
    onSignedIn(session);
  };

  return <div className="identity-gate">
    <div className="identity-panel">
      <div className="identity-brand">♥ LIV</div>
      {step === 'welcome' && <>
        <p className="identity-kicker">ETT TRYGGT HEM FÖR ETT MÄNNISKOLIV</p>
        <h1>Välkommen till Liv.</h1>
        <p className="identity-lead">Här samlas vardag, relationer, kunskap och beslut runt Viktor — med familjen som ägare.</p>
        <button className="bankid-button" onClick={() => setStep('identity')}>Fortsätt till inloggning</button>
        <div className="prototype-note"><strong>Utvecklarläge</strong><span>Riktig BankID-verifiering kopplas in via en serveradapter när avtal och certifikat finns.</span></div>
      </>}
      {step === 'identity' && <>
        <button className="back-link" onClick={() => setStep('welcome')}>← Tillbaka</button>
        <p className="identity-kicker">VERIFIERAD IDENTITET · PROTOTYP</p>
        <h1>Vem loggar in?</h1>
        <p className="identity-lead">I produktion ersätts detta val av identiteten som BankID verifierar.</p>
        <div className="identity-options">{identities.map(identity => <button key={identity.id} className={selected.id === identity.id ? 'selected' : ''} onClick={() => setSelected(identity)}><span className="identity-avatar">{identity.name[0]}</span><span><strong>{identity.name}</strong><small>{identity.relation}</small></span><em>{identity.role}</em></button>)}</div>
        <button className="bankid-button" onClick={() => setStep('subject')}>Fortsätt som {selected.name}</button>
      </>}
      {step === 'subject' && <>
        <button className="back-link" onClick={() => setStep('identity')}>← Tillbaka</button>
        <p className="identity-kicker">RELATION FÖRE ÅTKOMST</p>
        <h1>Vem är du här för?</h1>
        <button className="subject-card selected"><span className="subject-avatar">V</span><span><strong>Viktor O’Donnell Hansson</strong><small>{selected.relation}</small></span><em>Vald</em></button>
        <div className="permission-box"><span>DIN ÅTKOMST</span>{selected.permissions.map(permission => <p key={permission}>✓ {permission}</p>)}</div>
        <button className="bankid-button" onClick={complete}>Öppna Viktors Liv</button>
        <p className="privacy-line">Liv kontrollerar åtkomsten. Identitetsleverantören verifierar bara vem du är.</p>
      </>}
    </div>
  </div>;
}

function SessionBadge({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const summary = useMemo(() => `${session.identity.name} · ${session.identity.role}`, [session]);
  return <div className="session-control">
    <button className="session-badge" onClick={() => setOpen(!open)}><span>{session.identity.name[0]}</span><strong>{summary}</strong></button>
    {open && <div className="session-menu"><p className="identity-kicker">INLOGGAD FÖR</p><h3>{session.subject}</h3><p>{session.identity.relation}</p><div className="session-permissions">{session.identity.permissions.map(permission => <span key={permission}>✓ {permission}</span>)}</div><div className="prototype-chip">Verifiering: {session.verifiedBy}</div><button onClick={onSignOut}>Logga ut</button></div>}
  </div>;
}

function IdentityRoot() {
  const [session, setSession] = useState<Session | null>(readSession);
  const signOut = () => {
    if (session) appendAudit({ actor: session.identity.name, action: 'Loggade ut', subject: session.subject });
    localStorage.removeItem(sessionKey);
    setSession(null);
  };
  return session ? <SessionBadge session={session} onSignOut={signOut}/> : <Login onSignedIn={setSession}/>;
}

const root = document.getElementById('identity-root');
if (root) ReactDOM.createRoot(root).render(<React.StrictMode><IdentityRoot/></React.StrictMode>);
