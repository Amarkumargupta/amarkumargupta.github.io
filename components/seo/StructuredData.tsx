import Script from 'next/script';

interface PersonStructuredData {
  name: string;
  jobTitle: string;
  image?: string;
  sameAs?: string[];
  description?: string;
  url?: string;
}

interface ArticleStructuredData {
  title: string;
  description: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  publisherName: string;
  publisherLogo?: string;
  url: string;
}

interface PortfolioProjectStructuredData {
  name: string;
  description: string;
  url: string;
  image?: string;
  dateCreated?: string;
  author?: string;
  technologies?: string[];
  category?: string;
}

interface SkillStructuredData {
  name: string;
  description?: string;
  category?: string;
}

interface StructuredDataProps {
  type: 'person' | 'article' | 'website' | 'portfolioProject' | 'skill';
  data: PersonStructuredData | ArticleStructuredData | PortfolioProjectStructuredData | SkillStructuredData;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData = {};
  
  // Common function to clean up undefined values from schema objects
  const cleanStructuredData = (data: any) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );
  };
  
  if (type === 'person') {
    const personData = data as PersonStructuredData;
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: personData.name,
      jobTitle: personData.jobTitle,
      image: personData.image,
      sameAs: personData.sameAs,
      description: personData.description,
      url: personData.url,
    };
  } else if (type === 'article') {
    const articleData = data as ArticleStructuredData;
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleData.title,
      image: articleData.imageUrl ? [articleData.imageUrl] : [],
      datePublished: articleData.datePublished,
      dateModified: articleData.dateModified || articleData.datePublished,
      author: {
        '@type': 'Person',
        name: articleData.authorName,
        url: articleData.authorUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: articleData.publisherName,
        logo: articleData.publisherLogo
          ? {
              '@type': 'ImageObject',
              url: articleData.publisherLogo,
            }
          : undefined,
      },
      description: articleData.description,
      url: articleData.url,
    };
  } else if (type === 'website') {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Amar Kumar Gupta - Cloud & DevOps Engineer',
      description: 'Portfolio and blog of Amar Kumar Gupta, a Cloud & DevOps Engineer specializing in AWS LAMP stack migration.',
      url: 'https://your-domain.com',
      potentialAction: {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': 'https://your-domain.com/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    };
  } else if (type === 'portfolioProject') {
    const projectData = data as PortfolioProjectStructuredData;
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: projectData.name,
      description: projectData.description,
      url: projectData.url,
      image: projectData.image,
      dateCreated: projectData.dateCreated,
      author: projectData.author ? {
        '@type': 'Person',
        name: projectData.author
      } : undefined,
      keywords: projectData.technologies?.join(', '),
      applicationCategory: projectData.category,
      programmingLanguage: projectData.technologies
    };
  } else if (type === 'skill') {
    const skillData = data as SkillStructuredData;
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: skillData.name,
      description: skillData.description,
      termCode: skillData.category
    };
  }
  
  return (
    <Script 
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(cleanStructuredData(structuredData)) 
      }}
    />
  );
}
