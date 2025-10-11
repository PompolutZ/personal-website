import { createSignal, createEffect } from "../reactivity";

interface CVMeta {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  youtube?: string;
}

interface CVData {
  meta: CVMeta;
  content: string;
  rawMarkdown: string;
}

export function CV() {
  const [cvData, setCVData] = createSignal<CVData | null>(null);
  const [loading, setLoading] = createSignal(true);

  // Add CV page class to body
  createEffect(() => {
    document.body.classList.add('cv-page');
    document.body.classList.remove('home-page');
    
    return () => {
      document.body.classList.remove('cv-page');
    };
  });

  // Load CV data on mount
  createEffect(() => {
    (async () => {
      try {
        const response = await fetch("/cv/cv.json");
        const data = await response.json();
        setCVData(data);
      } catch (error) {
        console.error("Failed to load CV:", error);
      } finally {
        setLoading(false);
      }
    })();
  });

  const handlePrint = () => {
    console.log("Print button clicked");
    window.print();
  };

  // Wrap the conditional rendering in a function so the jsx-runtime can track it
  const renderContent = () => {
    if (loading()) {
      return <div class="cv-loading">Loading CV...</div>;
    }

    const cv = cvData();
    if (!cv) {
      return <div class="cv-error">Failed to load CV</div>;
    }

    console.log("CV data:", cv.meta);

    return (
      <div class="cv-container">
        <button class="print-button no-print" onClick={() => handlePrint()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Download PDF
        </button>

        <div class="cv-content">
          <header class="cv-header">
            <h1>{cv.meta.name}</h1>
            <p class="cv-title">{cv.meta.title}</p>
            <div class="cv-contact">
              <span>{cv.meta.email}</span>
              <span>{cv.meta.phone}</span>
              <span>{cv.meta.location}</span>
            </div>
            {(cv.meta.linkedin || cv.meta.website || cv.meta.youtube) && (
              <div class="cv-links">
                {cv.meta.linkedin && (
                  <a href={cv.meta.linkedin} target="_blank" rel="noopener">
                    LinkedIn
                  </a>
                )}
                {cv.meta.website && (
                  <a href={cv.meta.website} target="_blank" rel="noopener">
                    Website
                  </a>
                )}
                {cv.meta.youtube && (
                  <a href={cv.meta.youtube} target="_blank" rel="noopener">
                    YouTube
                  </a>
                )}
              </div>
            )}
          </header>

          <div class="cv-body" innerHTML={cv.content}></div>
        </div>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
}
