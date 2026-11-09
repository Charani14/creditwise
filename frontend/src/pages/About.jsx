import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    name: 'Credit card management',
    description: 'Add, update, view, or delete simulated cards.',
  },
  {
    name: 'Credit utilization',
    description: 'See how much of each card’s limit is being used.',
  },
  {
    name: 'Billing cycles',
    description: 'Generate monthly statements and track due dates.',
  },
  {
    name: 'Repayments',
    description: 'Record simulated full or partial repayments.',
  },
  {
    name: 'Alerts',
    description: 'View due-date reminders and high-utilization alerts.',
  },
  {
    name: 'Reports and analytics',
    description: 'Review spending and card utilization charts.',
  },
];

const team = [
  {
    person: 'Person 1',
    work: 'Card management, utilization, About Us, and Contact Us.',
  },
  {
    person: 'Person 2',
    work: 'Billing, repayments, and the Home page.',
  },
  {
    person: 'Person 3',
    work: 'Alerts, reports, Login, and Registration.',
  },
];

export default function About() {
  return (
    <>
      <Navbar />

      <main className="public-page">
        <section className="public-hero">
          <span className="hero-badge">ABOUT CREDITWISE</span>
          <h1>About CreditWise</h1>
          <p>
            CreditWise is a web application for managing simulated credit cards,
            billing statements, repayments, alerts, and spending reports.
          </p>
          <p className="simulation-note">
            This project is for simulation only. It does not connect to banks or process payments.
          </p>
        </section>

        <section className="public-section">
          <div className="public-section-heading">
            <div className="eyebrow">OBJECTIVE</div>
            <h2>Project objective</h2>
            <p>
              Help users view their card balances, bills, and repayments in one place.
            </p>
          </div>

          <div className="public-section-heading">
            <div className="eyebrow">FEATURES</div>
            <h2>Main features</h2>
          </div>
          <div className="three-col-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.name}>
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section tech-section">
          <div className="eyebrow">TECHNOLOGY</div>
          <h2>Technology stack</h2>
          <div className="architecture-grid">
            <div>
              <strong>React</strong>
              <span>Frontend pages and forms</span>
            </div>
            <div>
              <strong>Node.js and Express</strong>
              <span>Backend API</span>
            </div>
            <div>
              <strong>MySQL and Sequelize</strong>
              <span>Database and data models</span>
            </div>
          </div>
        </section>

        <section className="public-section">
          <div className="public-section-heading">
            <div className="eyebrow">TEAM</div>
            <h2>Project contributions</h2>
            <p>Replace the person labels with your team members’ names.</p>
          </div>

          <div className="three-col-grid">
            {team.map((member) => (
              <article className="feature-card" key={member.person}>
                <h3>{member.person}</h3>
                <p>{member.work}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
