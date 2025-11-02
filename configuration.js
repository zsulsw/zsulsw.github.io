/*
  Site configuration file for the Stability Fun website.

  This JavaScript module defines a global object `siteConfig` which
  contains all of the metadata required to customise the website for
  different users or research groups.  To adapt the site to your own
  needs simply update the values below.  Each section is
  documented so that you understand what information it should hold.

  The configuration object is split into several sections:

  - `Website`: high‑level settings such as the site name, logo and
    copyright notice.
  - `Research`: details about the principal investigator including
    name, titles, affiliations and external profile links (e.g. ORCID,
    Scopus, ResearchGate).  You can add additional fields as needed.
  - `ResearchInterests`: a list of keywords or short phrases
    describing your research topics.  These may be used to generate
    tag clouds or highlight areas of expertise.  Leave it empty if
    not required.
  - `Navigation`: menu items displayed in the header navigation bar.
    Each item has a label and URL.  Set `display` to false to hide
    an item temporarily.
  - `Sidebar`: profile information displayed in the left sidebar,
    including photo, name, credentials, roles, contact details and
    academic profiles.
  - `Footer`: footer links and information displayed at the bottom
    of each page.
  - `Pages`: mapping of page names to Markdown files.  The keys
    correspond to routes such as `About` and `Home`, while the values
    indicate whether the page should be included in the navigation
    (`"yes"`/`"no"`) and the path to the corresponding Markdown
    document.  You can add more pages here and create the matching
    `.md` files under the `pages` folder.

  When expanding the functionality of this site, you can import
  `configuration.js` in your scripts and use the values defined here to
  dynamically build menus, populate profile sections and more.
*/

window.siteConfig = {
  /**
   * High‑level website information.  The `name` appears in the
   * browser tab and header.  `logo` and `favicon` should be
   * relative paths to image files stored in the `assets/images`
   * directory.  `logoName` provides alt text for accessibility.
   */
  Website: {
    name: 'Stability Fun',
    logo: 'assets/images/logo.png',
    logoName: 'Stability Fun',
    logoIcon: 'assets/images/logo-icon.png',
    favicon: 'assets/images/logo-icon.png',
    copyright: '© 2025 Siwei Liu | Department of Civil and Environmental Engineering, The Hong Kong Polytechnic University',
    lastUpdated: 'October 2025'
  },

  /**
   * Principal investigator or research leader information.  Replace
   * these values with your own details.  Each subline consists of
   * a descriptive label and a URL.  Add or remove properties as
   * necessary.
   */
  Research: {
    name: 'Ir Dr. Siwei LIU',
    chineseName: '劉思威',
    titles: 'BEng, PhD, MHKIE (Structural), FHKISC',
    photo: 'assets/images/siwei_liu_photo.jpeg',
    sublines: [
      {
        text: 'Assistant Professor, The Hong Kong Polytechnic University',
        url: 'https://www.polyu.edu.hk/cee/people/academic-staff/dr-siwei-liu/'
      },
      {
        text: 'Associate Editor, International Journal of Advanced Steel Construction',
        url: 'https://www.ascjournal.com/'
      }
    ],
    email: 'si-wei.liu@polyu.edu.hk',
    phone: {
      office: '(852) 2766 5542',
      mobile: '(852) 5646 6192'
    },
    address: 'ZS949, Block Z, The Hong Kong Polytechnic University',
    orcid: '0000-0002-3283-5964',
    scopus: '55836781500',
    googleScholar: 'https://scholar.google.com.hk/citations?user=pltU9uwAAAAJ',
    researchgate: 'https://www.researchgate.net/profile/Siwei_Liu'
    // You can add more identifiers here (e.g. Web of Science ID, LinkedIn)
  },

  /**
   * A list of research interests.  Each entry should be a short
   * phrase summarising a topic area.  This list can be used to
   * generate tag clouds or filters on publications.  Leave as an
   * empty array if you do not wish to display research interests.
   */
  ResearchInterests: [
    'Steel structures and structural stability',
    'Constructional 3D‑printed metal structures',
    'Glass curtain walls and tall building engineering',
    'Composite materials and construction',
    'Computational mechanics and machine learning',
    'Engineering software development'
  ],

  /**
   * Navigation menu items displayed in the header.  Each item has
   * a `label` (displayed text), `url` (link destination) and
   * `display` flag (set to false to hide temporarily).
   */
  Navigation: [
    { label: 'Home', url: 'index.html', display: true },
    { label: 'Biography', url: 'about.html', display: true },
    { label: 'Team', url: 'team.html', display: true },
    { label: 'Publications', url: 'publications.html', display: true },
    { label: 'Contact', url: 'contact.html', display: true }
  ],

  /**
   * Sidebar configuration for profile display.  This section
   * contains the same information as `Research` but is structured
   * for sidebar rendering.  Academic profiles include icons and
   * links to external services.
   */
  Sidebar: {
    photo: 'assets/images/siwei_liu_photo.jpeg',
    photoAlt: 'Ir Dr. Siwei Liu',
    name: 'Ir Dr. Siwei LIU',
    credentials: 'BEng, PhD, MHKIE (Structural), FHKISC',
    roles: [
      {
        text: 'Assistant Professor, The Hong Kong Polytechnic University',
        url: 'https://www.polyu.edu.hk/cee/people/academic-staff/dr-siwei-liu/'
      },
      {
        text: 'Associate Editor, International Journal of Advanced Steel Construction',
        url: 'https://www.ascjournal.com'
      }
    ],
    contact: {
      email: 'si-wei.liu@polyu.edu.hk'
    },
    profiles: [
      {
        name: 'ORCID',
        icon: 'assets/images/icon-orcid.png',
        url: 'https://orcid.org/0000-0002-3283-5964',
        text: 'ORCID: 0000-0002-3283-5964'
      },
      {
        name: 'Google Scholar',
        icon: 'assets/images/icon-google-scholar.png',
        url: 'https://scholar.google.com.hk/citations?user=pltU9uwAAAAJ',
        text: 'Google Scholar'
      },
      {
        name: 'Scopus',
        icon: 'assets/images/icon-scopus.png',
        url: 'https://www.scopus.com/authid/detail.uri?authorId=55836781500',
        text: 'Scopus ID: 55836781500'
      },
      {
        name: 'ResearchGate',
        icon: 'assets/images/icon-researchgate.png',
        url: 'https://www.researchgate.net/profile/Siwei_Liu',
        text: 'Research Gate'
      }
    ]
  },

  /**
   * Footer configuration.  The `links` array contains navigation
   * items displayed in the footer.  External links should have
   * `external: true` to open in a new tab.
   */
  Footer: {
    links: [
      { label: 'Home', url: 'index.html', external: false },
      { label: 'Biography', url: 'about.html', external: false },
      { label: 'Publications', url: 'publications.html', external: false },
      { label: 'Contact', url: 'contact.html', external: false },
      { 
        label: 'Google Scholar', 
        url: 'https://scholar.google.com/citations?user=pltU9uwAAAAJ', 
        external: true 
      },
      { 
        label: 'ResearchGate', 
        url: 'https://www.researchgate.net/profile/Siwei-Liu', 
        external: true 
      }
    ],
    rss: 'feed.xml'
  },

  /**
   * Mapping of site pages to their Markdown sources.  The key is the
   * page name (used in navigation and page titles) and the value is
   * either an object with a `display` flag and `file` path, or a
   * simple string pointing to the Markdown file (in which case
   * `display` defaults to "yes").
   */
  Pages: {
    Home: { display: 'yes', file: 'pages/home.md' },
    About: { display: 'yes', file: 'pages/about.md' }
    // Add additional pages here, for example:
    // Publications: { display: 'yes', file: 'pages/publications.md' }
  }
};
