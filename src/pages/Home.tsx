import React from "react";
import { Hero } from "../components/Hero";
import { AboutUs } from "../components/AboutUs";
import { Solutions } from "../components/Solutions";
import { Services } from "../components/Services";
import { TrustSection } from "../components/TrustSection";
import { ContactForm } from "../components/ContactForm";

export function Home() {
  return (
    <main className="flex-grow">
      <Hero />
      <AboutUs />
      <Solutions />
      <Services />
      <TrustSection />
      <ContactForm />
    </main>
  );
}
