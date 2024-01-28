import React from 'react';
import { Link } from 'framework7-react';

const ImpressumPage = () => {
  return (
    <div className="page">
      <div className="navbar">
        <div className="navbar-inner">
          <div className="title">Impressum</div>
        </div>
      </div>
      <div className="page-content">
        <div className="block">
          <p>
            Diese Website wurde von einer Gruppe von Studenten erstellt.
          </p>
          <p>
            <strong>Kontakt</strong>
          </p>
          <p>
            Address: Fallenbrunnen 2, Friedrichshafen, Deutschland
          </p>
          <p>
            Email: lennart.schuster@gmail.com
          </p>
          <p>
            Phone: -
          </p>
          <p>
            <strong>Disclaimer:</strong> Die Richtigkeit der Daten sind nicht gewährleistet
          </p>
          <p>
            Diese Impressum Seite ist lediglich ein Beispiel für eine Impressum Seite.
          </p>
          {/* Link back to the main page */}
          <Link href="/">Back to Main Page</Link>
        </div>
      </div>
    </div>
  );
};

export default ImpressumPage;
