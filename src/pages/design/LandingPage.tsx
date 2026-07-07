import { SiteHeader } from '../../components/design/SiteHeader';
import { HeroSection } from '../../components/design/HeroSection';
import { PortfolioSection } from '../../components/design/PortfolioSection';
import { ServicesSection } from '../../components/design/ServicesSection';
import { ProcessSection } from '../../components/design/ProcessSection';
import { ContactsSection } from '../../components/design/ContactsSection';
import { SiteFooter } from '../../components/design/SiteFooter';
import projectsData from '../../data/mock-projects.json';
import type { ProjectMock } from '../../types/project';
import { useHelmet } from '../../utils/HelmetProvider';

const projects = projectsData as ProjectMock[];

export function LandingPage() {
  useHelmet({
    title: 'Веб-Решения — Digital-агентство полного цикла',
    description:
      'Разрабатываем лендинги, интернет-магазины и CRM для малого и среднего бизнеса. Берём проект от брифа до запуска без субподрядчиков.',
  });

  return (
    <div className="public-page min-h-screen">
      <SiteHeader />
      <main>
        <HeroSection />
        <PortfolioSection projects={projects} />
        <ServicesSection />
        <ProcessSection />
        <ContactsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
