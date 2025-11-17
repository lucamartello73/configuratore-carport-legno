import Link from "next/link"
import Image from "next/image"

export function FooterMartello1930() {
  return (
    <footer className="main-footer">
      <div className="footer-logo-section">
        <Image
          src="/logo-martello.jpg"
          alt="Logo Martello 1930"
          width={150}
          height={100}
          className="footer-logo"
        />
      </div>
      <div className="footer-container">
        <div className="footer-column">
          <h4 className="footer-title">Sede e Showroom</h4>
          <p className="footer-text">Via Aurelia 7</p>
          <p className="footer-text">Sestri Levante (GE)</p>
          <a 
            href="https://maps.google.com/?q=Via+Aurelia+7+Sestri+Levante" 
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Vedi su Google Maps →
          </a>
        </div>
        
        <div className="footer-column">
          <h4 className="footer-title">Contatti Telefonici</h4>
          <a href="tel:+390185167656" className="footer-link">
            +39 0185 167 656
          </a>
          <a 
            href="https://wa.me/390185167656" 
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            WhatsApp →
          </a>
        </div>
        
        <div className="footer-column">
          <h4 className="footer-title">Email</h4>
          <a href="mailto:soluzioni@martello1930.net" className="footer-link">
            soluzioni@martello1930.net
          </a>
          <p className="footer-text">
            Vieni a scoprire le nostre strutture e prefabbricati
          </p>
        </div>
        
        <div className="footer-column">
          <h4 className="footer-title">Sito Web</h4>
          <a 
            href="https://www.martello1930.net" 
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            www.martello1930.net →
          </a>
          <p className="footer-text">
            Visita il nostro sito per scoprire tutti i prodotti
          </p>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} Martello 1930 - Legnami & Outdoor | Sestri Levante (GE)</p>
      </div>
    </footer>
  )
}
