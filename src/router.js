// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Home from './views/Home.vue';

const routes = [
    { path: '/', redirect: '/login' },  // Redirige a login por defecto
    { path: '/login', component: Login },
    { path: '/home', component: Home },
];

const router = createRouter({
    history: createWebHistory(), // Modo historial, sin hash en las URLs
    routes, // Las rutas definidas arriba
});

export default router;
