import HeroCarousel from '../components/home/HeroCarousel';
import ProcessSteps from '../components/home/ProcessSteps';
import Categories from '../components/home/Categories';
import ComparisonSection from '../components/home/ComparisonSection';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Benefits from '../components/home/Benefits';
import ResourcesSection from '../components/home/ResourcesSection';
import Testimonials from '../components/home/Testimonials';
import ContactCTA from '../components/home/ContactCTA';
import Reveal from '../components/ui/Reveal';
import { slideUp, fadeIn } from '../animations/variants';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroCarousel />

      <Reveal variants={slideUp} delay={0.2}>
        <ProcessSteps />
      </Reveal>

      <Reveal variants={fadeIn} threshold={0.1}>
        <Categories />
      </Reveal>

      <Reveal variants={slideUp}>
        <ComparisonSection />
      </Reveal>

      <Reveal variants={slideUp} threshold={0.1}>
        <FeaturedProjects />
      </Reveal>

      <Reveal variants={fadeIn}>
        <Benefits />
      </Reveal>

      <Reveal variants={slideUp}>
        <ResourcesSection />
      </Reveal>

      <Reveal variants={fadeIn}>
        <Testimonials />
      </Reveal>

      <Reveal variants={slideUp} threshold={0.2}>
        <ContactCTA />
      </Reveal>
    </div>
  );
}
