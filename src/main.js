import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import PrimeVue from 'primevue/config'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Aura from '@primevue/themes/aura'

const app = createApp(App);
app.use(router);
app.use(PrimeVue,{ripple:true,
        theme:{preset:Aura, options:
                {prefix:'p', darkModeSelector:'system', cssLayer:false}
        }
    }
);
app.component ('pv-toolbar', Toolbar);
app.component ('pv-button', Button);
app.component ('pv-card', Card);
app.mount('#app');
