// src/js/main.js - Orquestrador SPA

import { loginView } from './views/loginView.js';
import { registroView } from './views/registroView.js';
import { catalogoView } from './views/catalogoView.js';
import { perfilView } from './views/perfilView.js';
import { detalhesView } from './views/detalhesView.js';

class SPA {
    constructor() {
        this.routes = {
            '#/login': { view: loginView, title: 'Login' },
            '#/registro': { view: registroView, title: 'Registro' },
            '#/catalogo': { view: catalogoView, title: 'Catálogo' },
            '#/perfil': { view: perfilView, title: 'Perfil' },
            '#/detalhes/:id': { view: detalhesView, title: 'Detalhes' }
        };
        this.currentView = null;
    }

    init() {
        window.addEventListener('hashchange', () => this.loadView(window.location.hash));
        
        // Logout
        document.addEventListener('click', (e) => {
            if (e.target.closest('a[href="#/logout"]')) {
                e.preventDefault();
                localStorage.clear();
                window.location.hash = '#/login';
            }
        });

        this.loadView(window.location.hash || '#/login');
    }

    loadView(hash) {
        if (this.currentView?.destroy) {
            this.currentView.destroy();
        }

        const route = hash.split('/')[1] || 'login';
        const viewKey = Object.keys(this.routes).find(k => k.includes(route));
        
        if (!viewKey) {
            console.error('Rota não encontrada:', hash);
            return;
        }

        const { view, title } = this.routes[viewKey];
        document.title = `LetterBoxed - ${title}`;

        const container = document.querySelector('#app-content');
        const filmId = hash.split('/')[2];
        
        container.innerHTML = view.template(filmId);
        view.init(this, filmId);
        this.currentView = view;
    }

    updateNav(items) {
        const nav = document.querySelector('#app-nav');
        nav.classList.remove('nav-hidden');
        nav.innerHTML = items.map(item => `
            <a href="${item.href}" class="${item.active ? 'active' : ''}">${item.label}</a>
        `).join('');
    }
}

// Iniciar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new SPA();
    app.init();
});
