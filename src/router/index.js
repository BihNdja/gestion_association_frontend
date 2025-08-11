import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import BackOffice from '@/views/BackOffice.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import BackOfficeAccueil from '@/views/BackOfficeAccueil.vue'
import MemberList from '@/views/MemberList.vue'
import AddCotisation from '@/views/AddCotisation.vue'
import CotisationList from '@/views/CotisationList.vue'
import StatsView from '@/views/StatsView.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import Accueil from '@/views/PageAccueil.vue'
import ActivityHistory from '@/views/Historique.vue' // Ajusté pour correspondre au fichier

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: Login,
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: Register,
  },
  {
    path: '/accueil',
    name: 'Accueil',
    component: Accueil,
    meta: { requiresAuth: true },
  },
  {
    path: '/backoffice',
    name: 'BackOffice',
    component: BackOffice,
    meta: { requiresAuth: true, requiresAdmin: true },
    redirect: { name: 'BackOfficeAccueil' },
    children: [
      {
        path: 'accueil',
        name: 'BackOfficeAccueil',
        component: BackOfficeAccueil,
      },
      {
        path: 'membres',
        name: 'BackOfficeMembres',
        component: MemberList,
      },
      {
        path: 'ajouter-cotisation',
        name: 'BackOfficeAjouterCotisation',
        component: AddCotisation,
      },
      {
        path: 'cotisations',
        name: 'BackOfficeCotisations',
        component: CotisationList,
      },
      {
        path: 'statistiques',
        name: 'BackOfficeStatistiques',
        component: StatsView,
      },
      {
        path: 'parametres',
        name: 'BackOfficeParametres',
        component: SettingsPage,
      },
      {
        path: 'historique',
        name: 'BackOfficeHistorique',
        component: ActivityHistory, // Utilise le composant renommé
      },
    ],
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ResetPassword,
    meta: { requiresAuth: false },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresAuth: false },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  console.log('Route:', to.path, 'User:', user, 'Token:', token)

  if (to.meta.requiresAuth && (!user || !token)) {
    next('/login')
    return
  }

  if (to.meta.requiresAdmin && user && user.role !== 'admin') {
    next('/login')
    return
  }

  if (
    (to.name === 'UserLogin' ||
      to.name === 'UserRegister' ||
      to.name === 'ForgotPassword' ||
      to.name === 'ResetPassword') &&
    user &&
    token
  ) {
    if (user.role === 'admin') {
      next('/backoffice')
    } else {
      next('/accueil')
    }
    return
  }

  next()
})

export default router
