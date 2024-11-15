// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Home from './views/Home.vue';
import Register from "./views/Register.vue";
import Search from "./views/SearchResults.vue";
import SearchResults from "./views/SearchResults.vue";

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        props: (route) => ({ ngodName: route.query.ngod || '' }),
    },
    { path: '/register', component: Register },
    {
        path: '/search',
        name: 'SearchResults',
        component: SearchResults,
        props: (route) => ({ searchQuery: route.query.q })
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
