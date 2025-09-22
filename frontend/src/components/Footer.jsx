import React from "react";
import "../styles/footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="brand">
                    <h3 className="brand-title">MyStore</h3>
                    <p className="brand-sub">Thoughtful products. Honest prices.</p>
                </div>

                <nav className="nav-col">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/">About</a></li>
                        <li><a href="/">Careers</a></li>
                        <li><a href="/">Press</a></li>
                    </ul>
                </nav>

                <nav className="nav-col">
                    <h4>Help</h4>
                    <ul>
                        <li><a href="/">Support</a></li>
                        <li><a href="/">Shipping</a></li>
                        <li><a href="/">Returns</a></li>
                    </ul>
                </nav>

                <div className="social-col">
                    <h4>Follow</h4>
                    <div className="social-icons">
                        <a aria-label="Website" href="#" className="icon">
                            {/* globe SVG */}
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M2 12h20M12 2c2 3 2 7 2 10s0 7-2 10" /></svg>
                        </a>
                        <a aria-label="Twitter" href="#" className="icon">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 5.92c-.66.3-1.36.5-2.1.6.76-.46 1.34-1.18 1.6-2.04-.72.42-1.52.73-2.37.9A4.02 4.02 0 0016.5 4c-2.22 0-4.02 1.8-4.02 4.02 0 .32.04.64.1.94C8.1 9.8 5.1 7.92 3 5.1c-.35.6-.56 1.3-.56 2.04 0 1.4.72 2.6 1.82 3.3-.67 0-1.3-.2-1.85-.5v.06c0 1.97 1.4 3.6 3.25 3.96-.34.1-.7.15-1.06.15-.26 0-.5-.02-.74-.07.5 1.58 1.94 2.72 3.65 2.75A8.07 8.07 0 012 19.54 11.37 11.37 0 008.29 21c6.14 0 9.5-5.07 9.5-9.46v-.43c.66-.47 1.2-1.06 1.64-1.73-.6.3-1.3.5-2 .6z" /></svg>
                        </a>
                        <a aria-label="Instagram" href="#" className="icon">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><path d="M17.5 6.5h.01" /></svg>
                        </a>
                        <a aria-label="LinkedIn" href="#" className="icon">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3zM9 9h3.57v1.64h.05c.5-.95 1.72-1.94 3.55-1.94 3.8 0 4.5 2.5 4.5 5.76V21h-4v-5.12c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21H9z" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="legal">
                <p>© {new Date().getFullYear()} MyStore — Crafted with care.</p>
                <div className="legal-links">
                    <a href="/">Privacy</a>
                    <a href="/">Terms</a>
                </div>
            </div>
        </footer>
    );
}
