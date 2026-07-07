export interface ProjectMock {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'ecommerce' | 'crm' | 'landing' | 'corporate';
  coverImage: string;
  images: string[];
  technologies: string[];
  liveUrl: string;
}
