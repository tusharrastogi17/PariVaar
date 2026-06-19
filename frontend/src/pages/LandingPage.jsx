import React from 'react';
import { Network, Database, Zap, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage({ onLoginClick }) {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-logo">
          <Network size={28} />
          <span>Parivaar</span>
        </div>
        <div className="landing-actions">
          <button onClick={onLoginClick} className="login-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>Login</button>
          <button onClick={onLoginClick} className="btn-get-started">Get Started</button>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="version-badge">
            ✨ Version 2.0 is live
          </div>
          <h1>
            Understand Every <br />
            <span className="gradient-text">Family Connection</span> Instantly
          </h1>
          <p>
            Parivaar is an intelligent Family Relationship Engine that visualizes family trees,
            manages relationships, and resolves complex kinship connections using advanced
            graph traversal algorithms.
          </p>
          <div className="hero-actions">
            <button onClick={onLoginClick} className="btn-build-tree">
              Start Building Your Tree <ArrowRight size={18} />
            </button>
            <button onClick={onLoginClick} className="btn-demo">
              View Live Demo
            </button>
          </div>
        </section>

        <section className="landing-features">
          <h2>Enterprise-grade Kinship Engine</h2>
          <p>Built with modern web technologies to handle thousands of interconnected nodes effortlessly.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Database size={24} />
              </div>
              <h3>Graph Database Ready</h3>
              <p>Optimized data structures to store people and dynamic relational links.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={24} />
              </div>
              <h3>Instant Resolution</h3>
              <p>Calculate complex familial relationships in milliseconds using optimized BFS algorithms.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={24} />
              </div>
              <h3>Privacy First</h3>
              <p>Role-based access control ensures family data remains secure and private.</p>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <h2>Ready to map your lineage?</h2>
          <p>Join thousands of researchers and families using Parivaar to document their history.</p>
          <button onClick={onLoginClick} className="btn-create-account">
            Create Free Account
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-logo">
          <Network size={20} />
          <span>Parivaar</span>
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Parivaar Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
