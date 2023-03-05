import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-2 my-0 bg-dark">
      <div>
        <div>
          <div className="nav d-flex flex-column flex-md-row justify-content-center align-items-center border-bottom pb-3 mb-2">
            <div className="nav-item">
              <Link to="/" className="nav-link px-0 px-md-2 text-muted">
                Home
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/features" className="nav-link px-0 px-md-2 text-muted">
                Features
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/pricing" className="nav-link px-0 px-md-2 text-muted">
                Pricing
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/faqs" className="nav-link px-0 px-md-2 text-muted">
                FAQs
              </Link>
            </div>
            <div className="nav-item">
              <Link to="/about" className="nav-link px-0 px-md-2 text-muted">
                About
              </Link>
            </div>
          </div>
        </div>
        <div>
          <p className="text-center p-0 m-0 text-muted">© 2023 BlogE, Inc</p>
        </div>
      </div>
    </footer>
  );
}
