import * as Ariakit from "@ariakit/react";
import { Link } from "@tanstack/react-router";
import {
  PiInstagramLogoBold,
  PiTiktokLogoBold,
  PiXLogoBold,
} from "react-icons/pi";

export function Footer() {
  return (
    <footer>
      <Ariakit.HeadingLevel>
        <section className="footer-utility">
          <Ariakit.HeadingLevel>
            <section>
              <Ariakit.Heading className="heading">Navigation</Ariakit.Heading>
              <nav>
                <Link to=".">Accueil</Link>
                <Link to=".">Catalogue</Link>
              </nav>
            </section>
            <section>
              <Ariakit.Heading className="heading">Légal</Ariakit.Heading>
              <nav>
                <Link to=".">Conditions d'utilisation</Link>
                <Link to=".">Politique de confidentialité</Link>
                <Link to=".">Mentions légales</Link>
              </nav>
            </section>
            <section>
              <Ariakit.Heading className="heading">À propos</Ariakit.Heading>
              <nav>
                <Link to=".">Qui sommes-nous ?</Link>
                <Link to=".">Notre mission</Link>
              </nav>
            </section>
            <section>
              <Ariakit.Heading className="heading">Aide</Ariakit.Heading>
              <nav>
                <Link to=".">FAQ</Link>
                <Link to=".">Centre d'aide</Link>
                <Link to=".">Signaler un bug</Link>
              </nav>
            </section>
          </Ariakit.HeadingLevel>
        </section>
        <section className="social-networks">
          <Ariakit.Heading className="heading">
            Retrouvez-nous sur nos réseaux
          </Ariakit.Heading>
          <ul>
            <li>
              <a href="" target="_blank" rel="noopener noreferre">
                <PiXLogoBold size={40} />
              </a>
            </li>
            <li>
              <a href="" target="_blank" rel="noopener noreferre">
                <PiInstagramLogoBold size={40} />
              </a>
            </li>
            <li>
              <a href="" target="_blank" rel="noopener noreferre">
                <PiTiktokLogoBold size={40} />
              </a>
            </li>
          </ul>
        </section>
        <section className="copyrights">
          © 2025 Kuman — Merci de faire partie de l'aventure. Tous droits
          réservés.
          <br />
          <strong>Projet réalisé dans le cadre d’un projet scolaire.</strong>
        </section>
      </Ariakit.HeadingLevel>
    </footer>
  );
}
