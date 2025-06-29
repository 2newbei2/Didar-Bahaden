document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    const originalItems = Array.from(carousel.children);
    const gap = 24;
    
    let isTransitioning = false;

    // --- 1. CLONE ITEMS FOR INFINITE LOOP ---
    // We clone items to prepend and append to create a seamless loop effect.
    const itemsToCloneCount = Math.max(1, Math.floor(carousel.clientWidth / (originalItems[0].clientWidth + gap)));

    originalItems.slice(-itemsToCloneCount).reverse().forEach(item => {
        carousel.prepend(item.cloneNode(true));
    });
    originalItems.slice(0, itemsToCloneCount).forEach(item => {
        carousel.append(item.cloneNode(true));
    });

    const allItems = Array.from(carousel.children);
    
    // --- 2. LOGIC TO UPDATE ACTIVE STATE ---
    // This function finds which item is closest to the center and gives it the 'is-active' class.
    const updateActiveState = () => {
        const carouselCenter = carousel.getBoundingClientRect().left + carousel.offsetWidth / 2;
        let minDistance = Infinity;
        let activeItem = allItems[0];
        let activeIndexInAll = 0;

        allItems.forEach((item, index) => {
            const itemCenter = item.getBoundingClientRect().left + item.offsetWidth / 2;
            const distance = Math.abs(carouselCenter - itemCenter);

            if (distance < minDistance) {
                minDistance = distance;
                activeItem = item;
                activeIndexInAll = index;
            }
        });

        // Remove active class from all and add to the center one
        allItems.forEach(item => item.classList.remove('is-active'));
        activeItem.classList.add('is-active');
    };

    // --- 3. INITIAL SETUP ---
    // This function positions the carousel to the first "real" item on load.
    const initialScroll = () => {
        carousel.style.scrollBehavior = 'auto'; // Disable smooth scroll for setup
        const itemWidth = allItems[itemsToCloneCount].offsetWidth;
        const scrollLeft = allItems[itemsToCloneCount].offsetLeft - carousel.offsetLeft - (carousel.offsetWidth / 2) + (itemWidth / 2);
        carousel.scrollLeft = scrollLeft;
        setTimeout(() => {
            carousel.style.scrollBehavior = 'smooth'; // Re-enable
            updateActiveState();
        }, 50);
    };

    // --- 4. EVENT LISTENERS ---
    const scrollCarousel = (direction) => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        const currentActiveElem = document.querySelector('.carousel .is-active') || allItems[itemsToCloneCount];
        const activeElemIndex = allItems.indexOf(currentActiveElem);
        const targetIndex = activeElemIndex + direction;
        
        if (targetIndex >= 0 && targetIndex < allItems.length) {
            const targetItem = allItems[targetIndex];
            const scrollLeft = targetItem.offsetLeft - carousel.offsetLeft - (carousel.offsetWidth / 2) + (targetItem.offsetWidth / 2);
            carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }

        // Prevent multiple quick clicks
        setTimeout(() => { isTransitioning = false; }, 400); 
    };
    
    const handleInfiniteScroll = () => {
        const currentActiveElem = document.querySelector('.carousel .is-active');
        if (!currentActiveElem) return;
        const activeElemIndex = allItems.indexOf(currentActiveElem);
        
        const isAtEnd = activeElemIndex >= itemsToCloneCount + originalItems.length;
        const isAtStart = activeElemIndex < itemsToCloneCount;
        
        if (isAtEnd || isAtStart) {
            carousel.style.scrollBehavior = 'auto';
            const targetOriginalIndex = (activeElemIndex - itemsToCloneCount + originalItems.length) % originalItems.length;
            const newTargetIndex = targetOriginalIndex + itemsToCloneCount;
            const targetItem = allItems[newTargetIndex];
            const scrollLeft = targetItem.offsetLeft - carousel.offsetLeft - (carousel.offsetWidth / 2) + (targetItem.offsetWidth / 2);
            carousel.scrollLeft = scrollLeft;
            carousel.style.scrollBehavior = 'smooth';
        }
    };
    
    nextButton.addEventListener('click', () => scrollCarousel(1));
    prevButton.addEventListener('click', () => scrollCarousel(-1));

    // Use a timeout on scroll end to update state and check for infinite loop
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveState();
            handleInfiniteScroll();
        }, 150);
    });
    
    // Recalculate on resize and initialize
    window.addEventListener('resize', initialScroll);
    initialScroll();
});