
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.pagination-dot');
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');
    
    const itemWidth = items[0].offsetWidth + 32; // Width + margin
    const containerWidth = window.innerWidth;
    const containerCenter = containerWidth / 2;
    let currentPosition = 0;
    let currentPage = 0;
    let isAnimating = false;
    let autoScrollInterval;
    function initializeCarousel() {
        const visibleCardCount = Math.floor(containerWidth / itemWidth);
        if (items.length < visibleCardCount * 3) {
            const cloneCount = (visibleCardCount * 3) - items.length;
            for (let i = 0; i < cloneCount && i < items.length; i++) {
                const clone = items[i].cloneNode(true);
                track.appendChild(clone);
            }
        }
        startAutomaticScroll();
        updateCardsElevation();

        handleResponsiveDisplay();
    }
    function startAutomaticScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            if (isAnimating) return;
            scrollRight();
        }, 3000);
    }
    function scrollRight() {
        if (isAnimating) return;
        
        isAnimating = true;
        currentPosition -= itemWidth;
        currentPage = (currentPage + 1) % 5;
        updateDots();
        track.style.transform = `translateX(${currentPosition}px)`;
        if (Math.abs(currentPosition) >= (items.length / 2) * itemWidth) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentPosition = 0;
                track.style.transform = `translateX(${currentPosition}px)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease-out';
                }, 50);
            }, 500);
        }
        
        setTimeout(() => {
            isAnimating = false;
            updateCardsElevation();
        }, 500);
    }
    function scrollLeft() {
        if (isAnimating) return;
        
        isAnimating = true;
        currentPosition += itemWidth;
        currentPage = (currentPage - 1 + 5) % 5;
        updateDots();
        track.style.transform = `translateX(${currentPosition}px)`;
        if (currentPosition > 0) {
            setTimeout(() => {
                track.style.transition = 'none';
                currentPosition = -(items.length / 2 - 1) * itemWidth;
                track.style.transform = `translateX(${currentPosition}px)`;
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease-out';
                }, 50);
            }, 500);
        }
        
        setTimeout(() => {
            isAnimating = false;
            updateCardsElevation();
        }, 500);
    }
    function updateCardsElevation() {
        const trackRect = track.getBoundingClientRect();
        
        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + (itemRect.width / 2);
            const distanceFromCenter = Math.abs(containerCenter - itemCenter);
            item.style.transform = 'none';
            if (distanceFromCenter < itemWidth / 2) {
                const elevationAmount = 20; // pixels to move up
                item.style.transform = `translateY(-${elevationAmount}px)`;
            }
        });
    }
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    function handleResponsiveDisplay() {
        // Show fewer items on smaller screens
        if (containerWidth < 768) { // Mobile
            leftArrow.style.opacity = '0.7';
            rightArrow.style.opacity = '0.7';
            leftArrow.style.padding = '0.5rem';
            rightArrow.style.padding = '0.5rem';
        } else {
            leftArrow.style.opacity = '1';
            rightArrow.style.opacity = '1';
            leftArrow.style.padding = '0.5rem';
            rightArrow.style.padding = '0.5rem';
        }
        if (containerWidth < 640) {
            leftArrow.style.left = '0.25rem';
            rightArrow.style.right = '0.25rem';
        } else {
            leftArrow.style.left = '0';
            rightArrow.style.right = '0';
        }
        
        // Add a hover effect
        leftArrow.onmouseover = function() {
            this.style.backgroundColor = '#D6C1A4';
            this.style.transform = 'translateY(-50%) scale(1.1)';
        }
        leftArrow.onmouseout = function() {
            this.style.backgroundColor = 'rgba(214, 193, 164, 0.8)';
            this.style.transform = 'translateY(-50%) scale(1)';
        }
        
        rightArrow.onmouseover = function() {
            this.style.backgroundColor = '#D6C1A4';
            this.style.transform = 'translateY(-50%) scale(1.1)';
        }
        rightArrow.onmouseout = function() {
            this.style.backgroundColor = 'rgba(214, 193, 164, 0.8)';
            this.style.transform = 'translateY(-50%) scale(1)';
        }
    }
    
    // Add event listeners for arrows
    leftArrow.addEventListener('click', () => {
        clearInterval(autoScrollInterval);
        scrollLeft();
        startAutomaticScroll(); // Restart auto scroll after manual interaction
    });
    
    rightArrow.addEventListener('click', () => {
        clearInterval(autoScrollInterval);
        scrollRight();
        startAutomaticScroll(); // Restart auto scroll after manual interaction
    });
    track.addEventListener('transitionend', updateCardsElevation);
    initializeCarousel();
    window.addEventListener('resize', () => {
        const newContainerWidth = window.innerWidth;
        handleResponsiveDisplay();
        
        if (Math.abs(containerWidth - newContainerWidth) > 200) {
            location.reload(); // Only reload on significant width changes
        }
    });
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isAnimating || currentPage === index) return;
            
            clearInterval(autoScrollInterval);
            isAnimating = true;
            const pageDiff = index - currentPage;
            currentPosition -= pageDiff * itemWidth;
            currentPage = index;
            track.style.transform = `translateX(${currentPosition}px)`;
            updateDots();
            setTimeout(() => {
                isAnimating = false;
                updateCardsElevation();
                startAutomaticScroll();
            }, 500);
        });
    });
});
    function carouselData() {
      return {
        // Carousel configuration
        scrollPosition: 0,       // Current scroll position
        scrollSpeed: 0.1,        // Scroll sensitivity
        currentIndex: 0,         // Current active card index
        radius: 600,             // Arc radius (will be adjusted based on screen size)
        cardSpacing: 60,         // Angle between cards in degrees
        cardDepth: 300,          // Z-axis distance variation
        autoplay: true,          // Enable autoplay
        autoplaySpeed: 3000,     // Autoplay speed in ms
        autoplayTimer: null,     // Timer reference
        touchStartX: 0,          // Touch start position
        touchMoveX: 0,           // Touch current position
        isDragging: false,       // Is user dragging
        inertia: 0,              // Scroll inertia
        frameId: null,           // Animation frame ID
        isMobile: false,         // Is mobile view
        // Destination data (with placeholder images)
        destinations: [
          {
            title: "Bayon",
            image: "https://i.pinimg.com/736x/d3/d5/80/d3d580d39ebfc05d3ae7ef0876fe3fac.jpg",
            listings: "22"
          },
          {
            title: "Giant Tree",
            image: "https://i.pinimg.com/736x/c5/dd/1e/c5dd1eba457cc2ed5a3be674c4c1fb06.jpg",
            listings: "18"
          },
          {
            title: "Cambodia",
            image: "https://i.pinimg.com/736x/21/89/39/218939fccc0a54e52b57b7ee6173dd7b.jpg", 
            listings: "32"
          },
          {
            title: "Cambodia",
            image: "https://i.pinimg.com/736x/c5/0a/05/c50a05d2c5120091338fc614e78db2ac.jpg",
            listings: "26"
          },
          {
            title: "Bayon tonwer",
            image: "https://i.pinimg.com/736x/68/f2/b5/68f2b56ec41e4f404c3934e34ee8f54c.jpg",
            listings: "15"
          }
        ],
        get displayDestinations() {
          // We duplicate elements for infinite scrolling
          return [...this.destinations, ...this.destinations, ...this.destinations];
        },

        init() {
          this.checkDeviceSize();
          this.animate();
          if (this.autoplay) {
            this.startAutoplay();
          }
          window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
          });
          window.addEventListener('resize', this.handleResize.bind(this));
          this.handleResize();
        },
        checkDeviceSize() {
          this.isMobile = window.innerWidth < 768;
        },
        getCardSizeClasses() {
          return this.isMobile ? 'w-64 h-80' : 'w-80 h-96';
        },
        handleResize() {
          const viewportWidth = window.innerWidth;
          this.checkDeviceSize();
          if (viewportWidth < 640) {
            this.radius = 400;
            this.cardSpacing = 70;
            this.cardDepth = 200;
          } else if (viewportWidth < 1024) {
            this.radius = 500;
            this.cardSpacing = 65;
            this.cardDepth = 250;
          } else {
            this.radius = 600;
            this.cardSpacing = 60;
            this.cardDepth = 300;
          }
        },
        animate() {
          if (!this.isDragging && Math.abs(this.inertia) > 0.001) {
            this.scrollPosition += this.inertia;
            this.inertia *= 0.95; // Decay factor
          } else if (!this.isDragging) {
            this.inertia = 0;
          }
          const targetPosition = this.currentIndex;
          const diff = targetPosition - this.scrollPosition;
          
          if (Math.abs(diff) > 0.001) {
            this.scrollPosition += diff * 0.1; // Smooth factor
          }
          const normalizedPosition = ((this.scrollPosition % this.destinations.length) + this.destinations.length) % this.destinations.length;
          if (Math.abs(normalizedPosition - Math.round(normalizedPosition)) < 0.01) {
            this.currentIndex = Math.round(normalizedPosition);
          }
          this.frameId = requestAnimationFrame(this.animate.bind(this));
        },
        getOriginalIndex(index) {
          const totalItems = this.destinations.length;
          return index % totalItems;
        },
        getCardStyle(index) {
          // Calculate position on the arc
          const totalItems = this.displayDestinations.length;
          const middleIndex = Math.floor(totalItems / 3); // Center of display array
          const angleOffset = (index - this.scrollPosition - middleIndex) * this.cardSpacing;
          const radian = (angleOffset * Math.PI) / 180;
          const x = Math.sin(radian) * this.radius;
          const z = (Math.cos(radian) * this.radius) - this.radius;
          const y = -Math.abs(angleOffset) * 0.8; // Slight vertical offset
          const distance = Math.abs(angleOffset);
          const scale = Math.max(0.65, 1 - (distance / 10) * 0.05);
          const opacity = Math.max(0.4, 1 - (distance / 8) * 0.1);
          return {
            transform: `translate3d(calc(${x}px), calc(${y}px), ${z}px) scale(${scale})`,
            opacity: opacity,
            zIndex: Math.round(1000 - Math.abs(angleOffset)),
            left: '50%', // Center horizontally
            top: '50%',  // Center vertically
            transformOrigin: 'center', // Important for rotation
            marginLeft: this.isMobile ? '-128px' : '-160px', // Half of width
            marginTop: this.isMobile ? '-160px' : '-192px'   // Half of height
          };
        },
        
        handleWheel(e) {
          e.preventDefault();
          this.stopAutoplay();
          const delta = e.deltaY || e.deltaX;
          this.scrollPosition += (delta > 0 ? 0.2 : -0.2);
          this.currentIndex = Math.round(this.scrollPosition);
          if (this.currentIndex < 0) {
            this.currentIndex = this.destinations.length - 1;
            this.scrollPosition = this.currentIndex;
          } else if (this.currentIndex >= this.destinations.length) {
            this.currentIndex = 0;
            this.scrollPosition = 0;
          }
        },
        touchStart(e) {
          this.touchStartX = e.touches[0].clientX;
          this.isDragging = true;
          this.inertia = 0;
          this.stopAutoplay();
        },
        
        touchMove(e) {
          if (!this.isDragging) return;
          
          const currentX = e.touches[0].clientX;
          const diff = (this.touchStartX - currentX) * 0.01;
          
          this.touchStartX = currentX;
          this.scrollPosition += diff;
          this.inertia = diff * 0.8;
        },
        
        touchEnd() {
          this.isDragging = false;
          // Snap to nearest index
          this.goToSlide(Math.round(this.scrollPosition) % this.destinations.length);
        },
        
        // Navigation methods
        prevSlide() {
          this.stopAutoplay();
          this.currentIndex = (this.currentIndex - 1 + this.destinations.length) % this.destinations.length;
          this.scrollPosition = this.currentIndex;
        },
        
        nextSlide() {
          this.stopAutoplay();
          this.currentIndex = (this.currentIndex + 1) % this.destinations.length;
          this.scrollPosition = this.currentIndex;
        },
        
        goToSlide(index) {
          this.stopAutoplay();
          this.currentIndex = index % this.destinations.length;
          // Don't set scrollPosition directly to allow smooth animation
        },
        startAutoplay() {
          this.autoplayTimer = setInterval(() => {
            this.nextSlide();
          }, this.autoplaySpeed);
        },
        
        stopAutoplay() {
          if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
          }
        }
      };
    }
  
    // recent gallary
    let currentImageIndex = 0;
    const images = [
      'https://www.experienceparkhyattsiemreap.com/wp-content/uploads/2024/05/Park-Hyatt-Siem-Reap-SEO-MAY-C02-1_1200x628-1200x800.jpg',
      'https://southeastasiabackpacker.com/wp-content/uploads/2024/02/Bousra-Waterfall-Sen-Monorom-1200x800.jpg',
      'https://cms.siemreaper.click/uploads/phnom_penh_city_tour_in_cambodia2712_00d1599de9.jpeg',
      'https://cms.siemreaper.click/uploads/sok_san_beach_cambodia2712_922e94086d.jpeg',
      'https://cms.siemreaper.click/uploads/bokor_mountain_in_kampot2712_6ed50cf717.jpeg',
      'https://cms.siemreaper.click/uploads/Cardamom_mountain2712_9c48e5bfc6.jpeg',
      'https://cms.siemreaper.click/uploads/kirirrom_cambodia2712_f38d1898b1.jpeg',
      'https://cms.siemreaper.click/uploads/mondulkiri_cambodia2712_f92cfcf15d.jpeg'
    ];
    
    function openLightbox(imgSrc) {
      currentImageIndex = images.indexOf(imgSrc);
      document.getElementById('lightboxImage').classList.add('hidden');
      document.getElementById('lightboxLoader').classList.remove('hidden');
      document.getElementById('lightbox').classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      
      const img = new Image();
      img.onload = function() {
        document.getElementById('lightboxLoader').classList.add('hidden');
        document.getElementById('lightboxImage').src = imgSrc;
        document.getElementById('lightboxImage').classList.remove('hidden');
      };
      img.src = imgSrc;
    }
    
    function closeLightbox() {
      document.getElementById('lightbox').classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
    
    function showPrevImage() {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      openLightbox(images[currentImageIndex]);
    }
    
    function showNextImage() {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      openLightbox(images[currentImageIndex]);
    }
    
    // Event listeners
    document.getElementById('lightbox').addEventListener('click', function(e) {
      if (e.target !== document.getElementById('lightboxImage') && 
          e.target !== document.getElementById('prevButton') &&
          e.target !== document.getElementById('nextButton')) {
        closeLightbox();
      }
    });
    
    document.getElementById('prevButton').addEventListener('click', showPrevImage);
    document.getElementById('nextButton').addEventListener('click', showNextImage);
    
    document.addEventListener('keydown', function(e) {
      if (document.getElementById('lightbox').classList.contains('hidden')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    });

  // client feedback

        // Testimonial data (you can add more)
        const testimonials = [
            {
                id: 1,
                name: "Angelina Rose",
                role: "Traveller",
                text: "Solar panels adorn the roof, harnessing renewable energy to power the home and even feed excess electricity back into the grid. High-performance insulation and triple-glazed",
                rating: 5,
            },
            {
                id: 2,
                name: "Andrew Simon",
                role: "Traveller",
                text: "A home that perfectly blends sustainability with luxury until discovered Ecoland Residence. The moment I stepped community, I knew it was where I wanted to live.",
                rating: 5,
            },
            {
                id: 3,
                name: "Maria Doe",
                role: "Traveller",
                text: "The home boasts sleek, contemporary architecture with clean lines and expansive windows, allowing natural light to flood the interiors It incorporates passive design principles",
                rating: 5,
            },
            {
                id: 4,
                name: "John Smith",
                role: "Traveller",
                text: "The smart home features are seamlessly integrated, allowing control of temperature, lighting, and security with a simple voice command or smartphone app.",
                rating: 5,
            },
            {
                id: 5,
                name: "Emma Wilson",
                role: "Traveller",
                text: "From the recycled materials used in construction to the rainwater harvesting system, every aspect of this residence reflects thoughtful environmental stewardship.",
                rating: 5,
            },
            {
                id: 6,
                name: "Michael Brown",
                role: "Traveller",
                text: "Living here has transformed my lifestyle. I find myself more connected to nature while enjoying all the conveniences of modern sustainable technology.",
                rating: 5,
            }
        ];

        // Testimonial slider functionality
        let currentIndex = 0;
        let isAnimating = false;
        const slideTrack = document.getElementById('slideTrack');
        const dots = document.querySelectorAll('.dot');
        
        // Initialize slider with the first three testimonials
        function initSlider() {
            updateSlider();
            
            // Add click event listeners to dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    if (isAnimating) return; // Prevent clicks during animation
                    
                    currentIndex = index;
                    updateSlider();
                    updateDots();
                });
            });

            // Auto-advance the slider every 5 seconds with smoother animation
            setInterval(() => {
                if (isAnimating) return; // Skip if animation is already running
                autoAdvance();
            }, 5000);
            
            // Initial animation to make the first load smooth
            setTimeout(() => {
                document.querySelectorAll('.testimonial-card').forEach(card => {
                    card.style.opacity = '1';
                });
            }, 100);
        }
        
        // Auto advance with animation
        function autoAdvance() {
            isAnimating = true;
            
            // First fade out current cards
            const cards = document.querySelectorAll('.testimonial-card');
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px) scale(0.95)';
            });
            
            // After fade out, change the cards
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                updateSlider();
                updateDots();
                
                // Fade in new cards
                setTimeout(() => {
                    document.querySelectorAll('.testimonial-card').forEach(card => {
                        card.style.opacity = card.classList.contains('active') ? '1' : '0.8';
                        card.style.transform = card.classList.contains('active') ? 
                            'translateY(-20px) scale(1)' : 'translateY(0) scale(0.95)';
                    });
                    
                    // Animation is complete
                    setTimeout(() => {
                        isAnimating = false;
                    }, 800);
                }, 50);
            }, 400);
        }

        // Display the current testimonial and the ones before/after it
        function updateSlider() {
            // Remove all cards
            while (slideTrack.firstChild) {
                slideTrack.removeChild(slideTrack.firstChild);
            }

            // Calculate which testimonials to show (prev, current, next)
            const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            const nextIndex = (currentIndex + 1) % testimonials.length;
            
            // Create and add the three cards
            const cards = [
                createCard(testimonials[prevIndex], false),
                createCard(testimonials[currentIndex], true),
                createCard(testimonials[nextIndex], false)
            ];
            
            cards.forEach(card => slideTrack.appendChild(card));
        }

        // Create a testimonial card element
        function createCard(testimonial, isActive) {
            const card = document.createElement('div');
            card.className = `testimonial-card w-full md:w-1/3 p-6 mx-3 rounded-lg bg-surface/50 backdrop-blur-sm ${isActive ? 'active' : ''}`;
            card.style.opacity = '0';
            
            // Generate stars based on rating
            const stars = '★'.repeat(testimonial.rating);
            
            card.innerHTML = `
                <div class="flex items-center mb-4">
                    <img src="https://via.placeholder.com/60" alt="${testimonial.name}" class="w-12 h-12 rounded-full object-cover border-2 border-secondary">
                    <div class="ml-4">
                        <h3 class="font-bold text-textHeading">${testimonial.name}</h3>
                        <p class="text-sm text-textMain/70">${testimonial.role}</p>
                    </div>
                    <div class="rating-stars ml-auto">${stars}</div>
                </div>
                <p class="mb-4 text-textMain">"${testimonial.text}"</p>
                <div class="quote-icon text-4xl text-right text-secondary">❞</div>
            `;
            
            return card;
        }

        // Update the active dot
        function updateDots() {
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.remove('bg-surface');
                    dot.classList.add('bg-accent');
                } else {
                    dot.classList.remove('bg-accent');
                    dot.classList.add('bg-surface');
                }
            });
        }

        // Initialize the slider when the page loads
        window.addEventListener('DOMContentLoaded', initSlider);

    const imageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKGTGbxG8U4JL7ToKMVGIQ1Jno1a6gdOM2uQ&s";
    const count = 30;
    const carousel = document.getElementById("carousel");

    // Add images twice for looping effect
    for (let i = 0; i < count * 2; i++) {
      const img = document.createElement("img");
      img.src = imageURL;
      img.className = "h-32 w-auto object-contain grayscale hover:grayscale-0 transition duration-300";
      img.alt = "Sponsor";
      carousel.appendChild(img);
    }

    let scrollSpeed = 400;
    let isUserScrolling = false;
    let scrollPauseTimeout;

    function autoScroll() {
      if (!isUserScrolling) {
        carousel.scrollLeft += scrollSpeed;
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      requestAnimationFrame(autoScroll);
    }

    function pauseAutoScrollTemporarily() {
      isUserScrolling = true;
      clearTimeout(scrollPauseTimeout);
      scrollPauseTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 1500);
    }

    // Drag-scroll logic
    let isDragging = false;
    let startX;
    let scrollLeftStart;

    carousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      carousel.classList.add("cursor-grabbing");
      startX = e.pageX - carousel.offsetLeft;
      scrollLeftStart = carousel.scrollLeft;
      pauseAutoScrollTemporarily();
    });

    carousel.addEventListener("mouseleave", () => {
      isDragging = false;
      carousel.classList.remove("cursor-grabbing");
    });

    carousel.addEventListener("mouseup", () => {
      isDragging = false;
      carousel.classList.remove("cursor-grabbing");
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeftStart - walk;
      pauseAutoScrollTemporarily();
    });

    carousel.addEventListener("touchstart", pauseAutoScrollTemporarily);
    carousel.addEventListener("scroll", pauseAutoScrollTemporarily);

    autoScroll();

    // New & art
    
