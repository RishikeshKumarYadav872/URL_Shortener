import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/marketing/Hero";
import ShortenForm from "@/components/shortener/ShortenForm";
import Stats from "@/components/marketing/Stats";
import Features from "@/components/marketing/Features";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ShortenForm />
      <Stats />
      <Features />
      <Footer />
    </main>
  );
}
