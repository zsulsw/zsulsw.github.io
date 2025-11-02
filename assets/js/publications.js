/*
 * Publications page functionality
 * Handles loading and displaying journal and conference papers
 */

let journalData = [];
let conferenceData = [];
let bookChaptersData = [];
// Flag to force reload (set to true to bypass cache)
let forceDataReload = false;
let currentView = 'list'; // 'list' or 'compact'
let sortOrder = 'newest'; // 'newest', 'oldest', or 'title'
let conferenceSortOrder = 'newest'; // 'newest' or 'oldest'

// Pagination state for list view
let currentPage = 1;
let itemsPerPage = 5; // Default items per page
let showAll = false; // If true, show all items without pagination

// Dynamically determined list of journals with >= 3 papers (updated automatically)
let journalsWithThreeOrMore = [];

// Color palette for keywords
const keywordColors = [
  '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#f57c00',
  '#0097a7', '#5d4037', '#455a64', '#c2185b', '#303f9f',
  '#00796b', '#e64a19', '#512da8', '#c62828', '#00695c'
];

// Get random color for keyword tags
function getRandomColor() {
  return keywordColors[Math.floor(Math.random() * keywordColors.length)];
}

// Load JSON data
async function loadJournalData(forceReload = false) {
  // If forceDataReload is true, always reload
  const shouldReload = forceReload || forceDataReload;
  if (!shouldReload && journalData.length > 0) return journalData;
  
  try {
    // Add cache-busting query parameter to prevent browser caching
    const timestamp = `?t=${Date.now()}`;
    const url = `data/Journal-Papers.json${timestamp}`;
    const response = await fetch(url, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    if (!response.ok) throw new Error('Failed to load journal data');
    journalData = await response.json();
    return journalData;
  } catch (error) {
    console.error('Error loading journal data:', error);
    return [];
  }
}

async function loadConferenceData(forceReload = false) {
  // If forceDataReload is true, always reload
  const shouldReload = forceReload || forceDataReload;
  if (!shouldReload && conferenceData.length > 0) return conferenceData;
  
  try {
    // Add cache-busting query parameter to prevent browser caching
    const timestamp = `?t=${Date.now()}`;
    const url = `data/Conference-Papers.json${timestamp}`;
    const response = await fetch(url, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    if (!response.ok) throw new Error('Failed to load conference data');
    conferenceData = await response.json();
    return conferenceData;
  } catch (error) {
    console.error('Error loading conference data:', error);
    return [];
  }
}

async function loadBookChaptersData(forceReload = false) {
  // If forceDataReload is true, always reload
  const shouldReload = forceReload || forceDataReload;
  if (!shouldReload && bookChaptersData.length > 0) return bookChaptersData;
  
  try {
    // Add cache-busting query parameter to prevent browser caching
    const timestamp = `?t=${Date.now()}`;
    const url = `data/Book-Chapters.json${timestamp}`;
    const response = await fetch(url, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    if (!response.ok) throw new Error('Failed to load book chapters data');
    bookChaptersData = await response.json();
    return bookChaptersData;
  } catch (error) {
    console.error('Error loading book chapters data:', error);
    return [];
  }
}

// Format authors list (no bold for corresponding author)
function formatAuthors(authors, correspondingAuthor) {
  if (!Array.isArray(authors)) return '';
  if (authors.length === 0) return '';
  
  const formatted = authors.map(author => {
    return author;
  });
  
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return formatted.join(' and ');
  const last = formatted[formatted.length - 1];
  const rest = formatted.slice(0, -1);
  return rest.join(', ') + ', and ' + last;
}

// Format publication date from publication-date field
function formatPublicationDate(pubDate) {
  if (!pubDate) return '';
  // Format: "2026-01" -> "January 2026"
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const parts = pubDate.split('-');
  if (parts.length >= 2) {
    const year = parts[0];
    const month = parseInt(parts[1]) - 1;
    if (month >= 0 && month < 12) {
      return `${months[month]} ${year}`;
    }
    return year;
  }
  return pubDate;
}

// Setup abstract toggle functionality
function setupAbstractToggle() {
  const abstractContainers = document.querySelectorAll('.paper-abstract-container');
  
  abstractContainers.forEach(container => {
    const paperItem = container.closest('.publication-item');
    const abstractHidden = container.querySelector('.paper-abstract-hidden');
    const abstractToggleBtn = container.querySelector('.abstract-toggle-btn');
    const abstractClickText = container.querySelector('.abstract-click-text');
    const abstractContentWrapper = container.querySelector('.abstract-content-wrapper');
    
    if (!paperItem || !abstractHidden) return;
    
    // Only setup once
    if (paperItem.dataset.abstractSetup === 'true') return;
    paperItem.dataset.abstractSetup = 'true';
    
    // Initially hide the abstract content
    abstractHidden.classList.remove('visible');
    
    // Click handler for "Click to show abstract" text
    if (abstractClickText) {
      abstractClickText.addEventListener('click', (e) => {
        e.stopPropagation();
        // Show abstract content
        abstractClickText.style.display = 'none';
        if (abstractContentWrapper) {
          abstractContentWrapper.style.display = 'block';
        }
        abstractHidden.classList.add('visible');
      });
    }
    
    // Click handler for "Hide abstract" button
    if (abstractToggleBtn) {
      abstractToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Hide abstract content
        abstractHidden.classList.remove('visible');
        if (abstractContentWrapper) {
          abstractContentWrapper.style.display = 'none';
        }
        if (abstractClickText) {
          abstractClickText.style.display = 'block';
        }
      });
    }
    
    // Click handler for abstract text itself to fold (but not if clicking on links)
    if (abstractHidden) {
      abstractHidden.addEventListener('click', (e) => {
        // Don't fold if clicking on links
        if (e.target.tagName === 'A' || e.target.closest('a')) {
          return;
        }
        e.stopPropagation();
        // Hide abstract content
        abstractHidden.classList.remove('visible');
        if (abstractContentWrapper) {
          abstractContentWrapper.style.display = 'none';
        }
        if (abstractClickText) {
          abstractClickText.style.display = 'block';
        }
      });
    }
  });
}

// Render journal papers in list view
function renderJournalListView(papers) {
  const container = document.getElementById('journalList');
  const paginationContainer = document.getElementById('journalPagination');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (papers.length === 0) {
    container.innerHTML = '<li style="padding: 2rem; text-align: center; color: var(--text-color); opacity: 0.7;">No papers found matching your criteria.</li>';
    if (paginationContainer) paginationContainer.style.display = 'none';
    return;
  }
  
  // Pagination logic (only if more than 5 papers and not showing all)
  let papersToRender = papers;
  let totalPages = 1;
  
  if (papers.length > 5 && !showAll) {
    totalPages = Math.ceil(papers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    papersToRender = papers.slice(startIndex, endIndex);
    
    // Show pagination controls
    if (paginationContainer) {
      renderPaginationControls(paginationContainer, papers.length, currentPage, totalPages, itemsPerPage);
      paginationContainer.style.display = 'flex';
    }
  } else {
    // Hide pagination controls
    if (paginationContainer) {
      paginationContainer.style.display = 'none';
    }
  }
  
  papersToRender.forEach(paper => {
    const li = document.createElement('li');
    li.className = 'publication-item';
    // Reset abstract setup flag for re-rendering
    li.dataset.abstractSetup = 'false';
    
    const paperId = paper.id || '';
    const title = paper.title || '';
    const authors = paper.authors || [];
    const correspondingAuthor = paper['corresponding author'] || '';
    const abstract = paper.abstract || '';
    const keywords = paper.keywords || [];
    const doi = paper.doi || '';
    const weblink = paper.weblink || paper.link || '';
    const apa = paper.APA || '';
    const journal = paper.journal || '';
    const volume = paper.volume || '';
    const pubDate = formatPublicationDate(paper['publication-date'] || paper.year);
    
    let html = '';
    
    // Line 1: Paper ID and Title (black)
    html += `<div class="paper-line-1">`;
    html += `<span class="paper-id">${paperId}</span> `;
    html += `<span class="paper-title">${title}</span>`;
    html += `</div>`;
    
    // Line 2: Publication date (grey), Journal name (bold, black, no link), volume (grey) with separators
    html += `<div class="paper-line-2">`;
    const parts = [];
    if (pubDate) {
      parts.push(`<span class="paper-date">${pubDate}</span>`);
    }
    if (journal) {
      parts.push(`<span class="paper-journal">${journal}</span>`);
    }
    if (volume) {
      parts.push(`<span class="paper-volume">${volume}</span>`);
    }
    html += parts.join(' <span class="paper-separator">|</span> ');
    html += `</div>`;
    
    // Line 3: DOI link (full, clickable)
    if (doi) {
      const doiUrl = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
      html += `<div class="paper-line-3">`;
      html += `<span class="paper-doi-label">DOI:</span> `;
      html += `<a href="${doiUrl}" target="_blank" rel="noopener" class="paper-doi-link">${doiUrl}</a>`;
      html += `</div>`;
    }
    
    // Line 4: Authors
    html += `<div class="paper-line-4">`;
    html += formatAuthors(authors, correspondingAuthor);
    html += `</div>`;
    
    // Line 5: Abstract (with click to show/hide functionality)
    if (abstract) {
      html += '<div class="paper-abstract-container">';
      html += '<span class="abstract-click-text"><span class="abstract-arrow">›</span> Show Abstract</span>';
      html += '<div class="abstract-content-wrapper" style="display: none;">';
      html += '<button class="abstract-toggle-btn"><span class="abstract-arrow">›</span> Hide Abstract</button>';
      html += '<span class="abstract-label">Abstract</span>';
      html += `<div class="paper-abstract-hidden">${abstract}</div>`;
      html += '</div>';
      html += '</div>';
    }
    
    // Keywords (round/circular style with background colors, clickable)
    if (keywords.length > 0) {
      html += '<div class="paper-keywords-small">';
      keywords.forEach(keyword => {
        const color = getRandomColor();
        html += `<span class="keyword-tag-small clickable-keyword" data-keyword="${keyword.replace(/"/g, '&quot;')}" style="background-color: ${color}; cursor: pointer;" title="Click to filter by this keyword">${keyword}</span>`;
      });
      html += '</div>';
    }
    
    // Last line: Citation (APA)
    if (apa) {
      html += `<div class="paper-citation-line">`;
      html += `<span class="citation-label">Citation (APA):</span> `;
      html += `<span class="citation-text">${apa}</span>`;
      html += `</div>`;
    }
    
    li.innerHTML = html;
    container.appendChild(li);
  });
  
  // Setup abstract toggle after rendering
  setTimeout(() => {
    setupAbstractToggle();
    setupKeywordClickHandlers();
  }, 100);
}

// Setup keyword click handlers
function setupKeywordClickHandlers() {
  const keywordTags = document.querySelectorAll('.clickable-keyword');
  
  keywordTags.forEach(tag => {
    // Remove existing listeners to avoid duplicates
    const newTag = tag.cloneNode(true);
    tag.parentNode.replaceChild(newTag, tag);
    
    newTag.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent any parent click handlers
      const keyword = newTag.dataset.keyword;
      if (keyword) {
        const searchInput = document.getElementById('journalSearch');
        if (searchInput) {
          searchInput.value = keyword;
          // Trigger input event to update filter counts and search
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          // Scroll to top of results
          const listView = document.getElementById('journalListView');
          if (listView) {
            listView.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });
}

// Render pagination controls
function renderPaginationControls(container, totalItems, currentPageNum, totalPagesNum, itemsPerPageNum) {
  const startItem = (currentPageNum - 1) * itemsPerPageNum + 1;
  const endItem = Math.min(currentPageNum * itemsPerPageNum, totalItems);
  
  container.innerHTML = `
    <div class="pagination-info">
      <span>Showing ${startItem}-${endItem} of ${totalItems} papers</span>
    </div>
    <div class="pagination-controls">
      <button class="pagination-btn" id="paginationFirst" ${currentPageNum === 1 ? 'disabled' : ''} title="First page">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
        </svg>
      </button>
      <button class="pagination-btn" id="paginationPrev" ${currentPageNum === 1 ? 'disabled' : ''} title="Previous page">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <span class="pagination-page-info">Page ${currentPageNum} of ${totalPagesNum}</span>
      <button class="pagination-btn" id="paginationNext" ${currentPageNum === totalPagesNum ? 'disabled' : ''} title="Next page">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
      <button class="pagination-btn" id="paginationLast" ${currentPageNum === totalPagesNum ? 'disabled' : ''} title="Last page">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
        </svg>
      </button>
    </div>
    <div class="pagination-items-per-page">
      <label for="itemsPerPageSelect">Show:</label>
      <select id="itemsPerPageSelect" class="pagination-select">
        <option value="5" ${itemsPerPageNum === 5 ? 'selected' : ''}>5</option>
        <option value="10" ${itemsPerPageNum === 10 ? 'selected' : ''}>10</option>
        <option value="20" ${itemsPerPageNum === 20 ? 'selected' : ''}>20</option>
        <option value="all" ${showAll ? 'selected' : ''}>All</option>
      </select>
    </div>
  `;
  
  // Add event listeners
  setupPaginationHandlers();
}

// Setup pagination event handlers
function setupPaginationHandlers() {
  const firstBtn = document.getElementById('paginationFirst');
  const prevBtn = document.getElementById('paginationPrev');
  const nextBtn = document.getElementById('paginationNext');
  const lastBtn = document.getElementById('paginationLast');
  const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
  
  if (firstBtn) {
    firstBtn.addEventListener('click', () => {
      currentPage = 1;
      filterAndSortJournals();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        filterAndSortJournals();
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const filtered = getFilteredJournals();
      const totalPages = filtered.length > 5 && !showAll ? Math.ceil(filtered.length / itemsPerPage) : 1;
      if (currentPage < totalPages) {
        currentPage++;
        filterAndSortJournals();
      }
    });
  }
  
  if (lastBtn) {
    lastBtn.addEventListener('click', () => {
      const filtered = getFilteredJournals();
      if (filtered.length > 5 && !showAll) {
        currentPage = Math.ceil(filtered.length / itemsPerPage);
        filterAndSortJournals();
      }
    });
  }
  
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', (e) => {
      if (e.target.value === 'all') {
        showAll = true;
        currentPage = 1;
      } else {
        showAll = false;
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
      }
      filterAndSortJournals();
    });
  }
}

// Helper function to get filtered journals (needed for pagination)
function getFilteredJournals() {
  const searchInput = document.getElementById('journalSearch');
  const filterSelect = document.getElementById('journalFilter');
  
  if (!searchInput || !filterSelect) return [];
  
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedJournal = filterSelect.value;
  
  return journalData.filter(paper => {
    // Journal filter
    if (selectedJournal !== 'All') {
      const journal = paper.journal || '';
      if (selectedJournal === 'Others') {
        if (journalsWithThreeOrMore.includes(journal)) {
          return false;
        }
      } else {
        if (journal !== selectedJournal) {
          return false;
        }
      }
    }
    
    // Search filter
    if (searchTerm) {
      const title = (paper.title || '').toLowerCase();
      const abstract = (paper.abstract || '').toLowerCase();
      const journal = (paper.journal || '').toLowerCase();
      const keywords = (paper.keywords || []).map(k => k.toLowerCase()).join(' ');
      const authors = (paper.authors || []).map(a => a.toLowerCase()).join(' ');
      
      if (!title.includes(searchTerm) && 
          !abstract.includes(searchTerm) && 
          !journal.includes(searchTerm) && 
          !keywords.includes(searchTerm) &&
          !authors.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
}

// Render journal papers in compact view (shows APA format with DOI link)
function renderJournalCompactView(papers) {
  const container = document.getElementById('journalCompactList');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (papers.length === 0) {
    container.innerHTML = '<li style="padding: 2rem; text-align: center; color: var(--text-color); opacity: 0.7;">No papers found.</li>';
    return;
  }
  
  papers.forEach(paper => {
    const li = document.createElement('li');
    
    const paperId = paper.id || '';
    const apa = paper.APA || '';
    const doi = paper.doi || '';
    
    let html = `<div class="compact-paper-id">${paperId}</div>`;
    // Format APA with italic and bold journal name
    // APA format typically has journal name after comma before volume
    // Example: "... Journal Name, 123, ..." or "... Journal Name, 123..."
    let formattedApa = apa;
    if (paper.journal) {
      // Escape special regex characters in journal name
      const escapedJournal = paper.journal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match journal name followed by comma and volume number
      const journalRegex = new RegExp(`(${escapedJournal})(?=\\s*,\\s*\\d)`, 'g');
      formattedApa = formattedApa.replace(journalRegex, '<em><strong>$1</strong></em>');
    }
    
    html += `<div class="compact-paper-apa">${formattedApa}`;
    if (doi) {
      const doiUrl = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
      html += ` <a href="${doiUrl}" target="_blank" rel="noopener" class="compact-doi-link">(DOI)</a>`;
    }
    html += `</div>`;
    
    li.innerHTML = html;
    container.appendChild(li);
  });
}

// Update journal filter dropdown with counts
function updateJournalFilterCounts(filtered) {
  const filterSelect = document.getElementById('journalFilter');
  if (!filterSelect) return;
  
  const searchInput = document.getElementById('journalSearch');
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
  
  // Count papers by journal (considering search term if any)
  const journalCounts = {};
  let allCount = 0;
  
  journalData.forEach(paper => {
    // Apply search filter if present
    if (searchTerm) {
      const title = (paper.title || '').toLowerCase();
      const abstract = (paper.abstract || '').toLowerCase();
      const journal = (paper.journal || '').toLowerCase();
      const keywords = (paper.keywords || []).map(k => k.toLowerCase()).join(' ');
      
      const authors = (paper.authors || []).map(a => a.toLowerCase()).join(' ');
      
      if (!title.includes(searchTerm) && 
          !abstract.includes(searchTerm) && 
          !journal.includes(searchTerm) && 
          !keywords.includes(searchTerm) &&
          !authors.includes(searchTerm)) {
        return; // Skip if doesn't match search
      }
    }
    
    allCount++;
    const journal = paper.journal || '';
    
    if (journal) {
      if (!journalCounts[journal]) {
        journalCounts[journal] = 0;
      }
      journalCounts[journal]++;
    }
  });
  
  // Automatically determine journals with >= 3 papers (only update if no search term)
  if (!searchTerm) {
    journalsWithThreeOrMore = Object.keys(journalCounts).filter(journal => 
      journalCounts[journal] >= 3
    );
    
    // Sort by count (descending), then by name (ascending) for same count
    journalsWithThreeOrMore.sort((a, b) => {
      if (journalCounts[b] !== journalCounts[a]) {
        return journalCounts[b] - journalCounts[a]; // Sort by count descending
      }
      return a.localeCompare(b); // Sort by name ascending for same count
    });
  }
  
  // Count "Others" (journals with < 3 papers)
  let othersCount = 0;
  Object.keys(journalCounts).forEach(journal => {
    if (!journalsWithThreeOrMore.includes(journal)) {
      othersCount += journalCounts[journal];
    }
  });
  
  // Update dropdown options
  const currentValue = filterSelect.value;
  filterSelect.innerHTML = '';
  
  // Add "All Journals" option
  const allOption = document.createElement('option');
  allOption.value = 'All';
  allOption.textContent = `All Journals (${allCount})`;
  filterSelect.appendChild(allOption);
  
  // Add journals with >= 3 papers (sorted)
  journalsWithThreeOrMore.forEach(journal => {
    const count = journalCounts[journal] || 0;
    if (count > 0) { // Only add if count > 0 (respects search filter)
      const option = document.createElement('option');
      option.value = journal;
      option.textContent = `${journal} (${count})`;
      filterSelect.appendChild(option);
    }
  });
  
  // Add "Others" option for journals with < 3 papers
  if (othersCount > 0) {
    const othersOption = document.createElement('option');
    othersOption.value = 'Others';
    othersOption.textContent = `Other Journals (< 3 papers) (${othersCount})`;
    filterSelect.appendChild(othersOption);
  }
  
  // Restore selected value
  filterSelect.value = currentValue;
}

// Filter and sort journal papers
function filterAndSortJournals() {
  const searchInput = document.getElementById('journalSearch');
  const filterSelect = document.getElementById('journalFilter');
  const resultsCount = document.getElementById('journalResultsCount');
  
  if (!searchInput || !filterSelect) return;
  
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedJournal = filterSelect.value;
  
  let filtered = journalData.filter(paper => {
    // Journal filter
    if (selectedJournal !== 'All') {
      const journal = paper.journal || '';
      if (selectedJournal === 'Others') {
        // If journal has >= 3 papers, exclude it from "Others"
        if (journalsWithThreeOrMore.includes(journal)) {
          return false;
        }
      } else {
        if (journal !== selectedJournal) {
          return false;
        }
      }
    }
    
    // Search filter (applies to both views)
    if (searchTerm) {
      const title = (paper.title || '').toLowerCase();
      const abstract = (paper.abstract || '').toLowerCase();
      const journal = (paper.journal || '').toLowerCase();
      const keywords = (paper.keywords || []).map(k => k.toLowerCase()).join(' ');
      const authors = (paper.authors || []).map(a => a.toLowerCase()).join(' ');
      
      if (!title.includes(searchTerm) && 
          !abstract.includes(searchTerm) && 
          !journal.includes(searchTerm) && 
          !keywords.includes(searchTerm) &&
          !authors.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort papers
  filtered.sort((a, b) => {
    if (sortOrder === 'newest') {
      const numA = parseInt((a.id || '').match(/\d+/)) || 0;
      const numB = parseInt((b.id || '').match(/\d+/)) || 0;
      return numB - numA; // Descending order (newest first)
    } else if (sortOrder === 'oldest') {
      const numA = parseInt((a.id || '').match(/\d+/)) || 0;
      const numB = parseInt((b.id || '').match(/\d+/)) || 0;
      return numA - numB; // Ascending order (oldest first)
    } else if (sortOrder === 'title') {
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      return titleA.localeCompare(titleB);
    }
    return 0;
  });
  
  // Update results count with highlighted number
  if (resultsCount) {
    resultsCount.innerHTML = `<span class="results-count-number">${filtered.length}</span> paper${filtered.length === 1 ? '' : 's'} found`;
  }
  
  // Update journal filter dropdown with counts
  updateJournalFilterCounts(filtered);
  
  // Render based on current view (both use same filtered data)
  if (currentView === 'list') {
    renderJournalListView(filtered);
  } else {
    renderJournalCompactView(filtered);
  }
}

// Filter and sort conference papers
function filterAndSortConferences() {
  const searchInput = document.getElementById('conferenceSearch');
  
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  let filtered = conferenceData.filter(paper => {
    // Search filter
    if (searchTerm) {
      const title = (paper.title || '').toLowerCase();
      const authors = (paper.authors || []).map(a => a.toLowerCase()).join(' ');
      const journal = (paper.journal || '').toLowerCase();
      const conference = (paper.conference || '').toLowerCase();
      const apa = (paper.APA || '').toLowerCase();
      
      if (!title.includes(searchTerm) && 
          !authors.includes(searchTerm) && 
          !journal.includes(searchTerm) &&
          !conference.includes(searchTerm) &&
          !apa.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort papers
  filtered.sort((a, b) => {
    if (conferenceSortOrder === 'newest') {
      const numA = parseInt((a.id || '').match(/\d+/)) || 0;
      const numB = parseInt((b.id || '').match(/\d+/)) || 0;
      return numB - numA; // Descending order (newest first)
    } else if (conferenceSortOrder === 'oldest') {
      const numA = parseInt((a.id || '').match(/\d+/)) || 0;
      const numB = parseInt((b.id || '').match(/\d+/)) || 0;
      return numA - numB; // Ascending order (oldest first)
    }
    return 0;
  });
  
  // Render filtered and sorted papers
  renderConferencePapers(filtered);
}

// Render conference papers (same style as compact view in journal papers)
function renderConferencePapers(papers) {
  const container = document.getElementById('conferenceList');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (papers.length === 0) {
    container.innerHTML = '<li style="padding: 2rem; text-align: center; color: var(--text-color); opacity: 0.7;">No conference papers found.</li>';
    return;
  }
  
  papers.forEach(paper => {
    const li = document.createElement('li');
    
    const paperId = paper.id || '';
    const apa = paper.APA || '';
    const doi = paper.doi || '';
    const journal = paper.journal || '';
    
    let html = `<div class="compact-paper-id">${paperId}</div>`;
    // Format APA with italic and bold journal name (same as compact view)
    let formattedApa = apa;
    if (journal) {
      // Escape special regex characters in journal name
      const escapedJournal = journal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match journal name followed by comma and volume number
      const journalRegex = new RegExp(`(${escapedJournal})(?=\\s*,\\s*\\d)`, 'g');
      formattedApa = formattedApa.replace(journalRegex, '<em><strong>$1</strong></em>');
    }
    
    html += `<div class="compact-paper-apa">${formattedApa}`;
    if (doi) {
      const doiUrl = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
      html += ` <a href="${doiUrl}" target="_blank" rel="noopener" class="compact-doi-link">(DOI)</a>`;
    }
    html += `</div>`;
    
    li.innerHTML = html;
    container.appendChild(li);
  });
}

// Load and display journal papers
async function loadJournalPapers() {
  await loadJournalData();
  // Ensure view state is properly initialized
  const listView = document.getElementById('journalListView');
  const compactView = document.getElementById('journalCompactView');
  const listViewBtn = document.getElementById('listViewBtn');
  const compactViewBtn = document.getElementById('compactViewBtn');
  
  if (listView && compactView && listViewBtn && compactViewBtn) {
    // Ensure view containers are visible/hidden correctly
    if (currentView === 'compact') {
      listView.style.display = 'none';
      compactView.style.display = 'block';
    } else {
      currentView = 'list'; // Default to list view
      listView.style.display = 'block';
      compactView.style.display = 'none';
    }
  }
  
  // Update filter counts before filtering
  updateJournalFilterCounts([]);
  filterAndSortJournals();
}

// Initialize conference controls
function initConferenceControls() {
  const searchInput = document.getElementById('conferenceSearch');
  const searchClear = document.getElementById('conferenceSearchClear');
  const sortSelect = document.getElementById('conferenceSortSelect');
  
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterAndSortConferences();
      if (searchClear) {
        searchClear.classList.toggle('visible', searchInput.value.trim() !== '');
      }
    });
    
    // Show clear button on focus if there's text
    searchInput.addEventListener('focus', () => {
      if (searchClear && searchInput.value.trim() !== '') {
        searchClear.classList.add('visible');
      }
    });
  }
  
  // Search clear button
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchClear.classList.remove('visible');
        filterAndSortConferences();
      }
    });
  }
  
  // Sort dropdown
  if (sortSelect) {
    sortSelect.value = conferenceSortOrder; // Set default value
    sortSelect.addEventListener('change', () => {
      conferenceSortOrder = sortSelect.value;
      filterAndSortConferences();
    });
  }
}

// Load and display conference papers
async function loadConferencePapers() {
  await loadConferenceData();
  initConferenceControls();
  filterAndSortConferences();
}

// Helper function to bold Liu's name variations in text
function boldLiuNames(text) {
  // List of Liu name variations to match (case-insensitive)
  // Include variations with and without asterisks (with and without periods before asterisk)
  const liuVariations = [
    'Liu, S. W.*',
    'Liu, S.-W.*',
    'Liu, S.-W*',  // Without period before asterisk
    'Liu, S.-W',   // Without period and asterisk
    'Liu, S.*',
    'Liu, S. W.',
    'Liu, S.-W.',
    'Liu, S.',
    'Liu S. W.*',
    'Liu S.-W.*',
    'Liu S.-W*',  // Without period before asterisk
    'Liu S.-W',   // Without period and asterisk
    'Liu S.*',
    'Liu S. W.',
    'Liu S.-W.',
    'Liu S.',
    'Liu Siwei',
    'Siwei Liu',
    'Si-Wei Liu',
    'Si-wei Liu',
    'S.-W. Liu',
    'S. W. Liu',
    'S. Liu'
  ];
  
  let result = text;
  
  // Sort by length (longest first) to avoid partial matches
  const sortedVariations = liuVariations.sort((a, b) => b.length - a.length);
  
  sortedVariations.forEach(variation => {
    // Escape special regex characters, but handle asterisk specially
    // If variation ends with *, we want to match it literally
    let escaped;
    if (variation.endsWith('*')) {
      // Escape everything except the trailing *
      const base = variation.slice(0, -1);
      escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\*';
    } else {
      // Escape all special characters
      escaped = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // Match the variation, potentially followed by comma, space, &, or end of string
    // For variations ending with *, match it as-is (the * is already in the pattern)
    // For others, also allow an asterisk to follow (in case it gets added)
    const regexPattern = variation.endsWith('*')
      ? `(${escaped})(?=\\s*[,&]|\\s|$)`
      : `(${escaped})(?=\\*|\\s*[*,\\s&]|\\s|$)`;
    
    const regex = new RegExp(regexPattern, 'gi');
    
    // Create a function to process each match
    // replace callback: (match, p1, offset, string) when using capturing group
    const processMatch = (match, p1, offset, string) => {
      // Check if this match is already inside a <strong> tag
      // Look backwards from the match position to find the nearest <strong> or </strong>
      const beforeMatch = string.substring(Math.max(0, offset - 200), offset);
      
      // Count opening and closing strong tags
      const openTags = (beforeMatch.match(/<strong>/gi) || []).length;
      const closeTags = (beforeMatch.match(/<\/strong>/gi) || []).length;
      
      // If there are more open tags than close tags, we're inside a strong tag
      if (openTags > closeTags) {
        return match;
      }
      
      return `<strong>${match}</strong>`;
    };
    
    result = result.replace(regex, processMatch);
  });
  
  // Clean up any double bolding
  result = result.replace(/<strong><strong>/g, '<strong>');
  result = result.replace(/<\/strong><\/strong>/g, '</strong>');
  
  return result;
}

// Helper function to add * to corresponding author if not already present
function addCorrespondingAuthorStar(authors, correspondingAuthor, citationText) {
  if (!correspondingAuthor) return citationText;
  
  // First, remove any existing asterisks to ensure we start fresh
  let result = citationText.replace(/\*/g, '');
  
  // Normalize names for comparison (remove spaces, dots, hyphens, case-insensitive)
  const normalize = (name) => name.replace(/[\s\.\-]/g, '').toLowerCase();
  const normalizedCorresponding = normalize(correspondingAuthor);
  
  // Find the corresponding author in the citation and add *
  // The citation uses abbreviated names (e.g., "Liu, Z."), but correspondingAuthor might be full name (e.g., "Zuoqiu Liu")
  // So we need to match the full name to the abbreviated version in the citation
  
  // Build variations to try matching
  const authorVariations = [];
  
  // If correspondingAuthor is a full name like "Zuoqiu Liu", we need to match "Liu, Z."
  // In Western name order: "First Last", so last name is the last part
  const nameParts = correspondingAuthor.split(/\s+/).filter(p => p.length > 0);
  if (nameParts.length >= 2) {
    const lastName = nameParts[nameParts.length - 1]; // Last part is the last name
    const firstName = nameParts[0]; // First part is the first name
    // Try "Liu, Z." format (last name, first initial)
    authorVariations.push(`${lastName}, ${firstName[0]}.`);
    // Try "Liu, Z" format (last name, first initial without period)
    authorVariations.push(`${lastName}, ${firstName[0]}`);
    // Try "Liu Z." format (last name, first initial, no comma)
    authorVariations.push(`${lastName} ${firstName[0]}.`);
  }
  
  // Also try the original name formats
  authorVariations.push(correspondingAuthor);
  authorVariations.push(correspondingAuthor.replace(/-/g, '.'));
  authorVariations.push(correspondingAuthor.replace(/\./g, '-'));
  authorVariations.push(correspondingAuthor.replace(/\s/g, ''));
  authorVariations.push(correspondingAuthor.replace(/\s/g, '.'));
  authorVariations.push(correspondingAuthor.replace(/\s/g, '-'));
  
  let found = false;
  
  // Try each variation
  for (const variation of authorVariations) {
    // Escape special regex characters
    const escaped = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match author name (might be followed by comma, &, or end of string)
    const regex = new RegExp(`(${escaped})(?=\\s*[,&]|\\s|$)`, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, (match) => {
        if (!found) {
          found = true;
          return match + '*';
        }
        return match;
      });
      if (found) break;
    }
  }
  
  // If still not found, try matching by last name and first initial more flexibly
  if (!found && nameParts.length >= 2) {
    const lastName = nameParts[nameParts.length - 1]; // Last part is the last name
    const firstInitial = nameParts[0][0]; // First part's first character is the first initial
    // Match "LastName, Initial." or "LastName, Initial" patterns
    const pattern = `${lastName}[,\\s]+${firstInitial}\\.?`;
    const regex = new RegExp(`(${pattern})(?=\\s*[,&]|\\s|$)`, 'gi');
    result = result.replace(regex, (match) => {
      if (!found) {
        found = true;
        return match + '*';
      }
      return match;
    });
  }
  
  return result;
}

// Render full list in CV format
function renderFullList(journalPapers, bookChapters, conferencePapers) {
  const container = document.getElementById('fullList');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Sort journal papers: J.93 to J.1 (descending)
  const sortedJournals = journalPapers.slice().sort((a, b) => {
    const numA = parseInt((a.id || '').match(/\d+/)) || 0;
    const numB = parseInt((b.id || '').match(/\d+/)) || 0;
    return numB - numA;
  });
  
  // Sort book chapters: BC.2 to BC.1 (descending)
  const sortedBookChapters = bookChapters.slice().sort((a, b) => {
    const numA = parseInt((a.id || '').match(/\d+/)) || 0;
    const numB = parseInt((b.id || '').match(/\d+/)) || 0;
    return numB - numA;
  });
  
  // Sort conference papers: C.32 to C.1 (descending)
  const sortedConferences = conferencePapers.slice().sort((a, b) => {
    const numA = parseInt((a.id || '').match(/\d+/)) || 0;
    const numB = parseInt((b.id || '').match(/\d+/)) || 0;
    return numB - numA;
  });
  
  // Journal Papers Section (Bolded header)
  if (sortedJournals.length > 0) {
    const journalHeader = document.createElement('li');
    journalHeader.className = 'full-list-section-header';
    journalHeader.innerHTML = '<strong>Journal Papers</strong>';
    container.appendChild(journalHeader);
    
    sortedJournals.forEach(paper => {
      const li = document.createElement('li');
      li.className = 'full-list-item';
      
      const paperId = paper.id || '';
      // Use CV format from JSON (preferred), fall back to APA only if CV is missing
      let citation = paper.cv || paper.APA || '';
      
      // If CV exists, use it directly without modification (it should already have correct asterisk)
      // Only add asterisk if we're using APA format (CV should already be correct)
      if (!paper.cv) {
        // Only process APA format - add * to corresponding author if not already present
        const correspondingAuthor = paper['corresponding author'] || '';
        citation = addCorrespondingAuthorStar(paper.authors || [], correspondingAuthor, citation);
      }
      
      // Bold Liu's name variations
      citation = boldLiuNames(citation);
      
      // Format: "J.93 citation text"
      li.innerHTML = `<span class="full-list-id">${paperId}</span> ${citation}`;
      container.appendChild(li);
    });
  }
  
  // Book Chapters Section
  if (sortedBookChapters.length > 0) {
    const bookChaptersHeader = document.createElement('li');
    bookChaptersHeader.className = 'full-list-section-header';
    bookChaptersHeader.innerHTML = '<strong>Book Chapters</strong>';
    container.appendChild(bookChaptersHeader);
    
    sortedBookChapters.forEach(chapter => {
      const li = document.createElement('li');
      li.className = 'full-list-item';
      
      const chapterId = chapter.id || '';
      // Book chapters use APA format
      let citation = chapter.APA || '';
      
      // Bold Liu's name variations
      citation = boldLiuNames(citation);
      
      // Format: "BC.1 citation text"
      li.innerHTML = `<span class="full-list-id">${chapterId}</span> ${citation}`;
      container.appendChild(li);
    });
  }
  
  // Conference Papers Section
  if (sortedConferences.length > 0) {
    const conferenceHeader = document.createElement('li');
    conferenceHeader.className = 'full-list-section-header';
    conferenceHeader.innerHTML = '<strong>Conference Papers</strong>';
    container.appendChild(conferenceHeader);
    
    sortedConferences.forEach(paper => {
      const li = document.createElement('li');
      li.className = 'full-list-item';
      
      const paperId = paper.id || '';
      // Conference papers use APA format
      let citation = paper.APA || '';
      
      // Bold Liu's name variations
      citation = boldLiuNames(citation);
      
      // Format: "C.32 citation text"
      li.innerHTML = `<span class="full-list-id">${paperId}</span> ${citation}`;
      container.appendChild(li);
    });
  }
}

// Load and display full list
async function loadFullList() {
  await loadJournalData();
  await loadBookChaptersData();
  await loadConferenceData();
  renderFullList(journalData, bookChaptersData, conferenceData);
}

// Switch between journal and conference views
function switchPublicationType(type) {
  const contentContainer = document.getElementById('publicationsContent');
  const typeButtons = document.querySelectorAll('.pub-type-btn');
  
  if (!contentContainer) return;
  
  // Update active button
  typeButtons.forEach(btn => {
    if (btn.dataset.type === type) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Load appropriate content using loadElement from main.js
  if (type === 'journal') {
    loadElement('publicationsContent', 'elements/journal.html', () => {
      setTimeout(() => {
        initJournalControls();
        loadJournalPapers();
      }, 100);
    });
  } else if (type === 'conference') {
    loadElement('publicationsContent', 'elements/conference.html', () => {
      setTimeout(() => {
        loadConferencePapers();
      }, 100);
    });
  } else if (type === 'list') {
    loadElement('publicationsContent', 'elements/list.html', () => {
      setTimeout(() => {
        loadFullList();
      }, 100);
    });
  }
}

// Initialize journal controls
function initJournalControls() {
  const searchInput = document.getElementById('journalSearch');
  const searchClear = document.getElementById('journalSearchClear');
  const filterSelect = document.getElementById('journalFilter');
  const listViewBtn = document.getElementById('listViewBtn');
  const compactViewBtn = document.getElementById('compactViewBtn');
  const listView = document.getElementById('journalListView');
  const compactView = document.getElementById('journalCompactView');
  
  // Initialize view state properly
  // Reset to list view by default, or restore previous state
  if (listView && compactView && listViewBtn && compactViewBtn) {
    // Ensure view containers are in correct state
    if (currentView === 'compact') {
      listView.style.display = 'none';
      compactView.style.display = 'block';
      listViewBtn.classList.remove('active');
      compactViewBtn.classList.add('active');
    } else {
      // Default to list view
      currentView = 'list';
      listView.style.display = 'block';
      compactView.style.display = 'none';
      listViewBtn.classList.add('active');
      compactViewBtn.classList.remove('active');
    }
  }
  
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      // Update counts based on search, then filter
      const searchTerm = searchInput.value.trim().toLowerCase();
      if (searchTerm) {
        // Filter papers based on search for count calculation
        const searchFiltered = journalData.filter(paper => {
          const title = (paper.title || '').toLowerCase();
          const abstract = (paper.abstract || '').toLowerCase();
          const journal = (paper.journal || '').toLowerCase();
          const keywords = (paper.keywords || []).map(k => k.toLowerCase()).join(' ');
          
          const authors = (paper.authors || []).map(a => a.toLowerCase()).join(' ');
          
          return title.includes(searchTerm) || 
                 abstract.includes(searchTerm) || 
                 journal.includes(searchTerm) || 
                 keywords.includes(searchTerm) ||
                 authors.includes(searchTerm);
        });
        updateJournalFilterCounts(searchFiltered);
      } else {
        updateJournalFilterCounts([]);
      }
      currentPage = 1; // Reset to first page when searching
      filterAndSortJournals();
      if (searchClear) {
        searchClear.classList.toggle('visible', searchInput.value.trim() !== '');
      }
    });
    
    // Show clear button on focus if there's text
    searchInput.addEventListener('focus', () => {
      if (searchClear && searchInput.value.trim() !== '') {
        searchClear.classList.add('visible');
      }
    });
  }
  
  // Search clear button
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchClear.classList.remove('visible');
        updateJournalFilterCounts([]);
        currentPage = 1; // Reset to first page when clearing search
        filterAndSortJournals();
      }
    });
  }
  
  // Filter select
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      currentPage = 1; // Reset to first page when changing filter
      filterAndSortJournals();
    });
  }
  
  // View toggle buttons
  if (listViewBtn && compactViewBtn) {
    listViewBtn.addEventListener('click', () => {
      currentView = 'list';
      listViewBtn.classList.add('active');
      compactViewBtn.classList.remove('active');
      if (listView) listView.style.display = 'block';
      if (compactView) compactView.style.display = 'none';
      currentPage = 1; // Reset to first page when switching views
      filterAndSortJournals();
    });
    
    compactViewBtn.addEventListener('click', () => {
      currentView = 'compact';
      compactViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      if (listView) listView.style.display = 'none';
      if (compactView) compactView.style.display = 'block';
      currentPage = 1; // Reset to first page when switching views
      filterAndSortJournals();
    });
  }
  
  // Sort dropdown
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.value = sortOrder; // Set default value
    sortSelect.addEventListener('change', () => {
      sortOrder = sortSelect.value;
      currentPage = 1; // Reset to first page when changing sort order
      // Always use filterAndSortJournals which handles both views
      filterAndSortJournals();
    });
  }
  
  // Setup abstract toggle after initial render
  setTimeout(() => {
    setupAbstractToggle();
  }, 300);
}

// Initialize publications page
function initPublicationsPage() {
  // Wait for DOM and main.js to be fully loaded
  const init = () => {
    // Publication type selector buttons
    const typeButtons = document.querySelectorAll('.pub-type-btn');
    if (typeButtons.length === 0) {
      // Retry if buttons aren't ready yet
      setTimeout(init, 100);
      return;
    }
    
    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        switchPublicationType(type);
      });
    });
    
    // Load journal papers by default
    switchPublicationType('journal');
    
    // Check for search parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    // If search parameter exists, populate search box and trigger search
    if (searchQuery) {
      setTimeout(() => {
        const searchInput = document.getElementById('journalSearch');
        if (searchInput) {
          searchInput.value = searchQuery;
          // Trigger input event to activate search
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          // Also trigger filter to update results
          if (typeof filterAndSortJournals === 'function') {
            filterAndSortJournals();
          }
        }
      }, 500); // Wait for page to fully load
    }
  };
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 100));
  } else {
    setTimeout(init, 100);
  }
}

// Initialize when DOM is ready
initPublicationsPage();

