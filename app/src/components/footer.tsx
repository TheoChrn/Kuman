import * as Ariakit from "@ariakit/react";
import {
  PiInstagramLogoBold,
  PiTiktokLogoBold,
  PiXLogoBold,
} from "react-icons/pi";

export function Footer() {
  return (
    <footer>
      <Ariakit.HeadingLevel>
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
