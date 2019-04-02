import {Routes, RouterModule} from'@angular/router';

const APP_ROUTES:Routes=[

  { path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule' },
];
export const Routing = RouterModule.forRoot(APP_ROUTES);