import {createRouter, createWebHistory} from "vue-router";
import LocalFilesView from "../views/LocalFilesView.vue";

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
          path: '/',
          name: 'setup',
          component: () => import('../views/SetupView.vue'),
          meta: {
              label: 'Setup',
              icon: 'setup',
              on_tabs: false
            },
        },
        {
            path: '/local-files',
            name: 'local-files',
            component: () => import('../views/LocalFilesView.vue'),
            meta: {
                label: 'Local Files',
                icon: 'local',
                on_tabs: true
            },
        },
        {
            path: '/cloud-files',
            name: 'cloud-files',
            component: () => import('../views/CloudFilesView.vue'),
            meta: {
                label: 'Cloud Files',
                icon: 'cloud',
                on_tabs: true
            },
        }
    ],
})

export default router
