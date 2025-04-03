document.addEventListener('DOMContentLoaded', function() {

    // ---- Mobile Menu Toggle ----
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
                navToggle.setAttribute('aria-label', 'Đóng menu');
            } else {
                icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
                navToggle.setAttribute('aria-label', 'Mở menu');
            }
        });
        // Close menu on link click (for single page)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.querySelector('i').classList.remove('fa-times');
                    navToggle.querySelector('i').classList.add('fa-bars');
                     navToggle.setAttribute('aria-label', 'Mở menu');
                }
            });
        });
    }

    // ---- Back to Top Button ----
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Accordion Functionality ----
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if(accordionHeaders.length > 0) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const accordionItem = header.parentElement;
                const accordionContent = header.nextElementSibling;
                const isActive = accordionItem.classList.contains('active');

                // Close all other items (optional, remove if you want multiple open)
                document.querySelectorAll('.accordion-item.active').forEach(item => {
                    if (item !== accordionItem) {
                         item.classList.remove('active');
                         item.querySelector('.accordion-content').style.maxHeight = null;
                         item.querySelector('.accordion-content').style.paddingTop = '0';
                         item.querySelector('.accordion-content').style.paddingBottom = '0';
                    }
                });

                // Toggle current item
                accordionItem.classList.toggle('active');
                if (!isActive) {
                    // Set max-height to scrollHeight for smooth opening
                    accordionContent.style.paddingTop = '20px'; // Add padding back before calculating scrollHeight
                    accordionContent.style.paddingBottom = '20px';
                    accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";

                } else {
                    accordionContent.style.maxHeight = null;
                    accordionContent.style.paddingTop = '0';
                    accordionContent.style.paddingBottom = '0';
                }
            });
        });
    }

    // ---- Filter Functionality (Điểm Đến & Thư Viện) ----
    function initializeFilter(filterButtonSelector, itemSelector, dataAttribute) {
        const filterButtons = document.querySelectorAll(filterButtonSelector);
        const itemsToFilter = document.querySelectorAll(itemSelector);

        if (filterButtons.length > 0 && itemsToFilter.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const filterValue = button.getAttribute(dataAttribute);

                    itemsToFilter.forEach(item => {
                        // Add transition for smoother filtering (optional)
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        if (filterValue === 'all' || item.getAttribute(dataAttribute) === filterValue) {
                            item.style.display = 'block'; // Or grid, flex depending on layout
                            // Trigger reflow for transition
                            // void item.offsetWidth;
                            // item.style.opacity = '1';
                            // item.style.transform = 'scale(1)';

                        } else {
                             item.style.display = 'none';
                            // item.style.opacity = '0';
                            // item.style.transform = 'scale(0.9)';
                            // setTimeout(() => { item.style.display = 'none'; }, 300); // Hide after transition
                        }
                    });
                    // Reinitialize Lightbox if it's the gallery filter
                    if (typeof lightbox !== 'undefined' && itemSelector === '.gallery-item') {
                        // Check lightbox documentation for reinitialization or update methods if needed
                        // lightbox.reload(); // Example, check actual method
                    }
                });
            });
        }
    }
    // Initialize filters
    initializeFilter('#diem-den .btn-filter', '#diem-den .destination-item', 'data-filter');
    initializeFilter('#thu-vien .btn-filter', '#thu-vien .gallery-item', 'data-filter');


     // ---- Lightbox Initialization ----
     if (typeof lightbox !== 'undefined') {
        lightbox.option({
          'resizeDuration': 200,
          'wrapAround': true,
          'fadeDuration': 300,
          'imageFadeDuration': 300
        });
     }


    // ---- ScrollSpy for Navigation Highlighting ----
    const sections = document.querySelectorAll('section[id]'); // Get all sections with an ID
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 60; // Get header height for offset

    function activateNavLink() {
        let currentSectionId = '';
        let minDistance = Infinity; // Track the closest section to the top

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 10; // Offset by header height + a small margin
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.pageYOffset;

            // Check if the section is currently visible or the closest one above the fold
            const distanceToTop = Math.abs(scrollPosition - sectionTop);

             if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                 // Section is currently visible
                 currentSectionId = section.getAttribute('id');
                  minDistance = 0; // Found the active section
                 return; // Exit loop early if found
             } else if (scrollPosition < sectionTop && distanceToTop < minDistance) {
                  // Update closest section *above* the current view, in case nothing is perfectly active
                 minDistance = distanceToTop;
                 currentSectionId = section.getAttribute('id');
             } else if (scrollPosition > sectionTop + sectionHeight && currentSectionId === '') {
                  // If scrolled past all sections, keep the last one active maybe?
                  // Or handle the case where the footer is visible? Let's prioritize visible sections.
                  // If we've scrolled past a section and haven't found an active one yet,
                  // consider the one just scrolled past as potentially the closest.
                 if(distanceToTop < minDistance) {
                    minDistance = distanceToTop;
                    currentSectionId = section.getAttribute('id');
                 }
             }

             // Handle reaching the bottom of the page - activate the last nav item
             if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 5) { // Check if near bottom
                const lastSection = sections[sections.length - 1];
                 if (lastSection) {
                    currentSectionId = lastSection.getAttribute('id');
                 }
             }
        });


        navLinks.forEach(link => {
            link.classList.remove('active');
             // Check if the link's href matches the current section ID
             // Handle the case where link href might be just "#section-id"
            const linkHrefId = link.getAttribute('href').substring(1); // Remove '#'
            if (linkHrefId === currentSectionId) {
                link.classList.add('active');
            }
        });
         // Special case for hero section (Trang chủ)
         const heroSection = document.getElementById('hero');
         const homeLink = document.querySelector('a.nav-link[href="#hero"]');
         if (heroSection && homeLink) {
             if (window.pageYOffset < (heroSection.offsetTop + heroSection.offsetHeight - headerHeight - 10)) {
                // If scrolled near the top or within the hero section
                 navLinks.forEach(link => link.classList.remove('active')); // Deactivate others
                 homeLink.classList.add('active');
             } else if (currentSectionId === '') {
                 // If no other section is active (e.g., between sections), keep home active? Or none?
                 // Let's default to keeping the calculated one or home if near top.
             }
         }
    }

    // Add scroll event listener for ScrollSpy
    window.addEventListener('scroll', activateNavLink);
    // Run once on load
    activateNavLink();

    // Add smooth scroll for internal links (although CSS scroll-behavior handles most)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default only if smooth scroll needs JS handling
            // e.preventDefault(); // Keep this commented if CSS scroll-behavior works well

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Optional: JS-based smooth scroll if CSS is not enough
                /*
                e.preventDefault(); // Need preventDefault for JS scroll
                const offsetTop = targetElement.offsetTop - headerHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                */

                // Close mobile menu if open after clicking a link
                 if (navMenu && navMenu.classList.contains('active')) {
                     navMenu.classList.remove('active');
                     navToggle.querySelector('i').classList.remove('fa-times');
                     navToggle.querySelector('i').classList.add('fa-bars');
                     navToggle.setAttribute('aria-label', 'Mở menu');
                 }
            }
        });
    });

    AOS.init({
        duration: 800,      // Thời gian hiệu ứng (milliseconds)
        offset: 120,        // Trigger hiệu ứng sớm hơn một chút (pixels)
        once: true,         // Chỉ chạy hiệu ứng một lần
        easing: 'ease-in-out', // Kiểu hiệu ứng chuyển động
        // disable: 'mobile' // Có thể tắt hiệu ứng trên mobile nếu muốn
    });

}); // End DOMContentLoaded