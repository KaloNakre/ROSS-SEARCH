// ROSS-SEARCH Content Script
// Inspects active academic DOM elements if on arXiv, IEEE Xplore, or DIU portals
(() => {
  const metaDOI = document.querySelector('meta[name="citation_doi"]')?.content;
  const metaPDF = document.querySelector('meta[name="citation_pdf_url"]')?.content;
  const metaTitle = document.querySelector('meta[name="citation_title"]')?.content;

  if (metaDOI || metaPDF || metaTitle) {
    chrome.runtime.sendMessage({
      action: "academic_metadata_detected",
      metadata: {
        doi: metaDOI,
        pdfUrl: metaPDF,
        title: metaTitle
      }
    });
  }
})();
