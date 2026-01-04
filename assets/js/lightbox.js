// Lightbox functionality for images
(function() {
  'use strict';

  // Create lightbox overlay element
  function createLightboxOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<img class="lightbox-image" src="" alt="">';
    document.body.appendChild(overlay);
    return overlay;
  }

  // Initialize lightbox
  function initLightbox() {
    const overlay = createLightboxOverlay();
    const lightboxImage = overlay.querySelector('.lightbox-image');

    // Find all images with alt="mhkarami97"
    const images = document.querySelectorAll('img[alt="mhkarami97"]');

    images.forEach(function(img) {
      // Add clickable class for hover effect
      img.classList.add('clickable-image');

      // Add click event to open lightbox
      img.addEventListener('click', function(e) {
        e.preventDefault();
        lightboxImage.src = this.src;
        lightboxImage.alt = this.alt;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
    });

    // Close lightbox when clicking on overlay
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay || e.target === lightboxImage) {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
      }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
