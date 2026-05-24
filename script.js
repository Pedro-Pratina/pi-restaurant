const MENU_SRC = '../assets/images/menu.svg';
const CLOSE_SRC = '../assets/images/x.svg';

function toggleMobileMenu() {
    const menuToggle = document.querySelector('.mobile .menu-toggle');
    const mobileMenu = document.querySelector('.mobile .menu_mobile');
    const menuIcon = menuToggle.querySelector('img');
    const isOpen = mobileMenu.classList.toggle('active');

    if (isOpen) {
        menuIcon.src = CLOSE_SRC;
        menuIcon.alt = 'Fechar menu';
        menuToggle.setAttribute('aria-label', 'Fechar menu');
    } else {
        menuIcon.src = MENU_SRC;
        menuIcon.alt = 'Menu';
        menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile .menu_mobile');
    const menuToggle = document.querySelector('.mobile .menu-toggle');
    const menuIcon = menuToggle.querySelector('img');

    mobileMenu.classList.remove('active');
    menuIcon.src = MENU_SRC;
    menuIcon.alt = 'Menu';
    menuToggle.setAttribute('aria-label', 'Abrir menu');
}

function setCurrentPageInStorage() {
    const path = window.location.pathname.toLowerCase();
    let current = 'home';

    if (path.includes('/pages/cardapio.html')) {
        current = 'cardapio';
    } else if (path.includes('/pages/carrinho.html')) {
        current = 'carrinho';
    } else if (path.includes('/pages/login.html')) {
        current = 'login';
    } else if (path.endsWith('/index.html') || path === '/' || path.endsWith('/')) {
        current = 'home';
    }

    localStorage.setItem('pag_at', current);
    return current;
}

function highlightDeskNav(currentPage) {
    const deskLinks = document.querySelectorAll('.desk .paginas a');
    const shouldHighlight = currentPage === 'home' || currentPage === 'cardapio';

    deskLinks.forEach((link) => {
        const pageName = link.dataset.page;
        if (shouldHighlight) {
            link.classList.toggle('active', pageName === currentPage);
        } else {
            link.classList.remove('active');
        }
    });
}

function initMenu() {
    const menuToggle = document.querySelector('.mobile .menu-toggle');
    const mobileLinks = document.querySelectorAll('.mobile .menu_mobile a');

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    mobileLinks.forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function initPageTracking() {
    const currentPage = setCurrentPageInStorage();
    highlightDeskNav(currentPage);
}

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initPageTracking();
});