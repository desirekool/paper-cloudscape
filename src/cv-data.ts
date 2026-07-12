export interface CvCard {
  heading?: string;
  text?: string;
  bullets?: string[];
  subsection?: string;
}

export interface CvPhase {
  phase: string;
  scrollTarget: number;
  cards: CvCard[];
}

export const cvPhases: CvPhase[] = [
  {
    phase: "Kontakt",
    scrollTarget: 0.00,
    cards: [
      {
        text: "Am Kimmelsteich 1\n63791 Karlstein am Main",
      },
      {
        text: "\u{1F4DE} 0160 96809764 \n\u{2709} ahmed.bilal73@outlook.com",
      },
      {
        text: "Arbeitserlaubnis unbefristet",
      },
      {
        text: "LinkedIn: http://www.linkedin.com/in/ahmed-bilal-14355940\nGitHub: https://www.github.com/desirekool",
      },
    ],
  },
  {
    phase: "PROFIL",
    scrollTarget: 0.10,
    cards: [
      {
        
        text:
          "Senior Full Stack Software Engineer mit u\u{0308}ber 12 Jahren Erfahrung in der Entwicklung, " +
          "Architektur und technischer Verantwortung komplexer Web- und Unternehmensanwendungen. " +
          "Schwerpunkt auf skalierbaren Java- und React-basierten Systemen sowie datenintensiven " +
          "Backend-Architekturen.",
      },
      {        
        text:
          "Gescha\u{308}ftskritische FinTech-Anwendungen bei Check24 und sicherheitskritische Systeme " +
          "im Beho\u{308}rdenumfeld. Technische Verantwortung u\u{308}ber den gesamten Software Lifecycle.",
      },
    ],
  },
  {
    phase: "KERNKOMPETENZEN",
    scrollTarget: 0.23,
    cards: [
      {
        heading: "Frontend",
        text: "React, TypeScript, Angular, JavaScript, HTML5, CSS3, SASS",
      },
      {
        heading: "Backend",
        text:
          "Java, Spring Boot, Python, REST APIs, Microservices, Java EE",
      },
      {
        heading: "Daten & Plattformen",
        text:
          "Apache Spark, PySpark, Palantir Foundry, SQL, Adobe Experience Manager, Datenanalyse & ETL",
      },
      {
        heading: "DevOps & Tools",
        text: "Docker, Jenkins, Git, CI/CD, Jira, Confluence",
      },
      {
        heading: "Arbeitsweise",
        text:
          "Agile Entwicklung, Scrum, Architekturdesign, Code Reviews, Qualita\u{308}tssicherung",
      },
    ],
  },
  {
    phase: "BERUFSERFAHRUNG",
    scrollTarget: 0.38,
    cards: [
      {
        heading: "Software Developer (Expert)",
        text:
          "05/2024 \u{2013} 04/2026\tHessisches Polizeipra\u{308}sidium fu\u{308}r Technik, Wiesbaden",
        subsection: "hpt",
      },
      {
        bullets:
          [ "Technische Weiterentwicklung des Asservatenmanagers (AMS), einer zentralen Fachanwendung der Hessischen Polizei",        
            "Backend-Komponenten mit Palantir Foundry, Java und TypeScript",        
            "Robuste Softwarearchitekturen fu\u{308}r polizeiliche Analyse- und Verwaltungsprozesse",        
            "Stabilita\u{308}t, Performance und Weiterentwicklung produktiver Systeme im laufenden Betrieb",
            "Enge Zusammenarbeit mit Palantir bei Performance und Architekturthemen",
            "Tetch Stack: TypeScript, Java, Apache Spark, Python, Git, Jira, Confluence"
          ],
        subsection: "hpt",
      },
      {
        heading: "Software Developer (Consultant)",
        text:
          "05/2021 \u{2013} 12/2021\tCognizant Deutschland, Mu\u{308}nchen",
        subsection: "cognizant",
      },
      {
        bullets:
          [
            "Frontend-Komponenten fu\u{308}r Versicherungsplattformen im Angular O\u{308}kosystem",
            "End-to-End-Tests mit Cypress und CI-Integration mit Jenkins",
            "Agile Teams mit Fokus auf Qualita\u{308}t und stabile Auslieferung",
            "Tech Stack: JavaScript, TypeScript, Angular, Jenkins, Git, Cypress"
          ],
        subsection: "cognizant",
      },
      {
        heading: "Freelance Software Developer",
        text:
          "1999 \u{2013} 2005\tSelbsta\u{308}ndig \u{B7} USA / Pakistan / Deutschland",
        subsection: "freelance",
      },
      {
        bullets:
          [ 
            "Individuelle Softwarelo\u{308}sungen und Webanwendungen fu\u{308}r verschiedene Kundenprojekte",
            "Datenbankgestu\u{308}tzte Softwaremodule und kundenspezifische Lo\u{308}sungen",
            "Tech Stack: Perl, Visual Basic, ASP, ASP.NET, C#"
          ],
        subsection: "freelance",
      },
      {
        heading: "Consultant / Software Developer",
        text:
          "05/2022 \u{2013} 03/2024\tEggs Unimedia GmbH, Mu\u{308}nchen",
        subsection: "eggs",
      },
      {      
        bullets:
          [
          "Skalierbare Enterprise-Webanwendungen mit Adobe Experience Manager (AEM)",        
          "Workflows zur Digitalisierung von Gescha\u{308}ftsprozessen",
          "Backend- und Frontend-Komponenten mit Java EE und JavaScript",
          "Integration und Erweiterung bestehender Unternehmenssysteme",
          "Tech Stack: JavaScript, Java, Java EE, Git, Jira"
          ],
        subsection: "eggs",
      },
      {
        heading: "Software Developer",
        text:
          "07/2015 \u{2013} 04/2021\tCheck24 Karten und Konten GmbH, Mu\u{308}nchen (Fintech)",
        subsection: "check24",
      },
      {
        bullets:
          [
            "Gescha\u{308}ftskritische Webanwendungen mit mehreren hunderttausend Nutzern",
            "Migration von Legacy weba Aps zu React und Aufbau moderner Frontend-Architekturen",
            "Skalierbare Spring Boot Microservices\nPerformance, Wartbarkeit und Deployment u\u{308}ber den gesamten Software Lifecycle",
            "Zusammenarbeit mit Product Management, UX und Backend Teams",
            "Tech Stack: React, AngularJS, Java, Spring Boot, Docker, Jenkins, Git, Redis",
          ],
        subsection: "check24",
      },
    ],
  },
  {
    phase: "ZERTIFIKATE",
    scrollTarget: 0.54,
    cards: [
      {
        heading: "Linux LPIC-1: 117-101 Certification\tLinux Professional Institute",
      },
      {
        heading: "Udemy Certificate of Completion\tComplete React, Next.js & TypeScript",
      },
      {
        heading: "Udemy Certificate of Completion\tJava Masterclass",
      },
    ],
  },
  {
    phase: "Studium",
    scrollTarget: 0.66,
    cards: [
      {
        heading: "Fachinformatiker (IHK) Anwendungsentwicklung",
        text:
          " Macromedia Akademie, Mu\u{308}nchen, 2012 \u{2013} 2015",
      },
      {
        heading: "B.Eng. Computer Systems",
        text:
          "GIK Institute of Engineering, Pakistan 1995 \u{2013} 1999",
      },
      {
        heading: "Masterstudium Systems Engineering",
        text:
          "Hochschule Mu\u{308}nchen (ohne Abschluss), 2007 \u{2013} 2012",
      },
    ],
  },
  {
    phase: "SPRACHEN & SONSTIGES",
    scrollTarget: 0.78,
    cards: [
      {
        heading: "Deutsch Verhandlungssicher (C1)"
      },
      {
        heading: "Englisch: Verhandlungssicher (C1)"
      },
      {
        heading: "Urdu: Muttersprache",
      },
      {
        heading: "Interessen: Open-Source-Entwicklung, Radfahren, Fachliteratur",
      },
    ],
  },
];
