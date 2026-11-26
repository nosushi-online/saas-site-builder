import { notFound } from 'next/navigation';

// Exemple de type pour un Canvas
interface CanvasSection {
  type: 'hero' | 'projects' | 'contact' | 'about' | 'gallery';
  content: Record<string, any>;
}

interface SiteData {
  subdomain: string;
  canvasId: string;
  canvasName: string;
  sections: CanvasSection[];
  styles: {
    primaryColor: string;
    fontFamily: string;
  };
}

// Dans un vrai projet, ceci viendrait de la base de données
async function getSiteData(subdomain: string): Promise<SiteData | null> {
  // TODO: Requête Prisma / Redis
  // Exemple mock
  if (subdomain === 'demo') {
    return {
      subdomain: 'demo',
      canvasId: 'portfolio-modern',
      canvasName: 'Portfolio Moderne',
      styles: {
        primaryColor: '#2563eb',
        fontFamily: 'Inter, sans-serif',
      },
      sections: [
        {
          type: 'hero',
          content: {
            title: 'Bienvenue sur mon site',
            subtitle: 'Un exemple de canvas portfolio',
            ctaText: 'Me contacter',
            ctaLink: '#contact',
          },
        },
        {
          type: 'about',
          content: {
            text: 'Ceci est un site généré via le SaaS avec un canvas prédéfini par l\'admin.',
          },
        },
      ],
    };
  }
  return null;
}

export default async function SitePage({
  params,
}: {
  params: { subdomain: string };
}) {
  const site = await getSiteData(params.subdomain);

  if (!site) {
    notFound();
  }

  return (
    <div
      style={{
        fontFamily: site.styles.fontFamily,
        '--primary': site.styles.primaryColor,
      } as React.CSSProperties}
      className="min-h-screen"
    >
      {site.sections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return (
              <section key={index} className="bg-gradient-to-br from-blue-50 to-white py-24 text-center">
                <h1 className="text-5xl font-bold mb-4">{section.content.title}</h1>
                <p className="text-xl text-gray-600 mb-8">{section.content.subtitle}</p>
                <a
                  href={section.content.ctaLink}
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  {section.content.ctaText}
                </a>
              </section>
            );
          case 'about':
            return (
              <section key={index} className="py-16 px-4 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">À propos</h2>
                <p className="text-lg text-gray-700">{section.content.text}</p>
              </section>
            );
          default:
            return null;
        }
      })}

      <footer className="border-t py-8 text-center text-sm text-gray-500">
        Site créé avec le SaaS — Canvas : {site.canvasName}
      </footer>
    </div>
  );
}
