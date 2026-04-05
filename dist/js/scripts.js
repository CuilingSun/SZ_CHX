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

});
