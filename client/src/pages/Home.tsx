import HeroSection from "@/components/HeroSection";
import ChallengeForm from "@/components/ChallengeForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <HeroSection />
      <ChallengeForm />
      <Footer />
    </div>
  );
}
