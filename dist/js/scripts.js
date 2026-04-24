/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2026 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {
    const languageStorageKey = 'site-language';
    const productReturnStorageKey = 'product-page-return-context';
    const productRestoreParam = 'restore-product-scroll';
    const languageToggle = document.getElementById('languageToggle');

    const applyLanguage = function (language) {
        const normalizedLanguage = language === 'zh' ? 'zh' : 'en';
        document.documentElement.lang = normalizedLanguage === 'zh' ? 'zh-CN' : 'en';

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const translation = normalizedLanguage === 'zh' ? element.dataset.zh : element.dataset.en;
            if (translation) {
                element.textContent = translation;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            const translation = normalizedLanguage === 'zh' ? element.dataset.placeholderZh : element.dataset.placeholderEn;
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });

        if (languageToggle) {
            languageToggle.textContent = normalizedLanguage === 'zh' ? languageToggle.dataset.labelZh : languageToggle.dataset.labelEn;
        }

        if (document.body.dataset.titleEn && document.body.dataset.titleZh) {
            document.title = normalizedLanguage === 'zh' ? document.body.dataset.titleZh : document.body.dataset.titleEn;
        }

        localStorage.setItem(languageStorageKey, normalizedLanguage);
        document.documentElement.classList.remove('language-pending');
    };

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    const savedLanguage = localStorage.getItem(languageStorageKey);
    applyLanguage(savedLanguage || 'en');

    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            const nextLanguage = document.documentElement.lang === 'zh-CN' ? 'en' : 'zh';
            applyLanguage(nextLanguage);
        });
    }

    let setProductDirectoryActive = null;

    const productDirectoryLinks = document.querySelectorAll('[data-product-directory-link]');
    const productSections = document.querySelectorAll('[data-product-section]');

    if (productDirectoryLinks.length && productSections.length) {
        const productSectionMap = new Map(
            Array.from(productDirectoryLinks).map((link) => [link.dataset.productDirectoryLink, link])
        );
        const productSectionsArray = Array.from(productSections);

        let isClickScroll = false;
        let clickScrollTimer = null;
        let clickScrollEndHandler = null;

        const releaseClickScroll = function () {
            isClickScroll = false;
            clearTimeout(clickScrollTimer);
            if (clickScrollEndHandler) {
                document.removeEventListener('scroll', clickScrollEndHandler);
                clickScrollEndHandler = null;
            }
        };

        setProductDirectoryActive = function (key) {
            productDirectoryLinks.forEach((link) => {
                link.classList.toggle('is-active', link.dataset.productDirectoryLink === key);
            });
        };

        const updateProductDirectoryByScroll = function () {
            if (isClickScroll) return;
            const activationOffset = 200;
            let activeSection = productSectionsArray[0];

            productSectionsArray.forEach((section) => {
                const sectionTop = section.getBoundingClientRect().top;

                if (sectionTop <= activationOffset) {
                    activeSection = section;
                }
            });

            if (activeSection) {
                setProductDirectoryActive(activeSection.dataset.productSection);
            }
        };

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                if (isClickScroll) return;
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visibleEntries.length) {
                    setProductDirectoryActive(visibleEntries[0].target.dataset.productSection);
                }
            },
            {
                rootMargin: '-18% 0px -60% 0px',
                threshold: [0.15, 0.35, 0.6],
            }
        );

        productSections.forEach((section) => {
            sectionObserver.observe(section);
        });

        document.addEventListener('scroll', updateProductDirectoryByScroll, { passive: true });

        productDirectoryLinks.forEach((link) => {
            link.addEventListener('click', () => {
                setProductDirectoryActive(link.dataset.productDirectoryLink);

                releaseClickScroll();
                isClickScroll = true;

                clickScrollEndHandler = function () {
                    clearTimeout(clickScrollTimer);
                    clickScrollTimer = setTimeout(releaseClickScroll, 200);
                };
                document.addEventListener('scroll', clickScrollEndHandler, { passive: true });

                // Safety: release immediately if the section was already in view
                clickScrollTimer = setTimeout(releaseClickScroll, 300);
            });
        });

        const initialHash = window.location.hash.replace('#', '');

        if (productSectionMap.has(initialHash)) {
            setProductDirectoryActive(initialHash);
        } else {
            setProductDirectoryActive(productSections[0].dataset.productSection);
        }

        updateProductDirectoryByScroll();
    }

    const productCardsForReturn = document.querySelectorAll('.product-directory-content .product-card');

    if (document.body.dataset.page === 'products' && productCardsForReturn.length) {
        const captureProductReturnContext = function () {
            const activeDirectoryLink = document.querySelector('[data-product-directory-link].is-active');
            const activeKey = activeDirectoryLink ? activeDirectoryLink.dataset.productDirectoryLink : '';
            const returnContext = {
                path: 'products.html',
                activeKey,
                scrollY: window.scrollY,
            };

            sessionStorage.setItem(productReturnStorageKey, JSON.stringify(returnContext));
        };

        productCardsForReturn.forEach((card) => {
            card.addEventListener('click', captureProductReturnContext);
        });

        const restoreRequested = new URLSearchParams(window.location.search).get(productRestoreParam);
        const savedReturnContext = sessionStorage.getItem(productReturnStorageKey);

        if (restoreRequested && savedReturnContext) {
            try {
                const returnContext = JSON.parse(savedReturnContext);
                const restoreUrl = returnContext.activeKey ? `${returnContext.path}#${returnContext.activeKey}` : returnContext.path;

                window.requestAnimationFrame(() => {
                    window.scrollTo({ top: Number(returnContext.scrollY) || 0, behavior: 'auto' });

                    if (returnContext.activeKey && setProductDirectoryActive) {
                        setProductDirectoryActive(returnContext.activeKey);
                    }

                    window.history.replaceState({}, '', restoreUrl);
                    sessionStorage.removeItem(productReturnStorageKey);
                });
            } catch (error) {
                sessionStorage.removeItem(productReturnStorageKey);
            }
        }
    }

    const productBackLink = document.querySelector('[data-product-back-link]');

    if (productBackLink) {
        productBackLink.addEventListener('click', (clickEvent) => {
            const savedReturnContext = sessionStorage.getItem(productReturnStorageKey);

            if (!savedReturnContext) {
                return;
            }

            clickEvent.preventDefault();

            try {
                const returnContext = JSON.parse(savedReturnContext);
                const hash = returnContext.activeKey ? `#${returnContext.activeKey}` : '';
                window.location.href = `${returnContext.path}?${productRestoreParam}=1${hash}`;
            } catch (error) {
                sessionStorage.removeItem(productReturnStorageKey);
                window.location.href = productBackLink.getAttribute('href') || 'products.html';
            }
        });
    }

    const productFilterButtons = document.querySelectorAll('[data-product-filter]');
    const productCards = document.querySelectorAll('[data-product-category]');

    if (productFilterButtons.length && productCards.length) {
        const validFilters = new Set(Array.from(productFilterButtons).map((button) => button.dataset.productFilter));

        const setProductFilter = function (filter) {
            productFilterButtons.forEach((button) => {
                button.classList.toggle('active', button.dataset.productFilter === filter);
            });

            productCards.forEach((card) => {
                const matches = filter === 'all' || card.dataset.productCategory === filter;
                card.hidden = !matches;
            });
        };

        const queryFilter = new URLSearchParams(window.location.search).get('filter');
        const initialFilter = validFilters.has(queryFilter) ? queryFilter : 'all';
        setProductFilter(initialFilter);

        productFilterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                setProductFilter(button.dataset.productFilter);
            });
        });
    }

    if (document.body.dataset.page === 'products') {
        const legacyProductTargets = {
            'o-rings': 'sealing-rings',
            'x-rings': 'sealing-rings',
            'v-rings': 'oil-seals',
            'y-rings': 'hydraulic-seals',
            'flat-washers': 'industrial-parts',
            'rubber-products': 'industrial-parts',
        };
        const queryFilter = new URLSearchParams(window.location.search).get('filter');
        const targetId = legacyProductTargets[queryFilter];

        if (targetId) {
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                if (setProductDirectoryActive) {
                    setProductDirectoryActive(targetId);
                }
                targetSection.classList.add('is-targeted');
                window.setTimeout(() => {
                    targetSection.classList.remove('is-targeted');
                }, 2500);
                window.requestAnimationFrame(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
        }
    }

});
