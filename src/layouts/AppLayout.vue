<template>
  <div class="layout" :class="{ dashboard: isBackOfficeRoute, 'sidebar-active': isSidebarActive }">
    <!-- Barre de navigation globale (visible si non connecté, sauf sur /login) -->
    <nav v-if="!isLoggedIn && showGlobalNav && $route.path !== '/login'" class="navbar">
      <div class="navbar-brand">
        <img
          src="../assets/images/logo_ST.jpg"
          alt="Logo Synchrone-technologie"
          class="navbar-logo"
        />
      </div>
      <div class="navbar-links">
        <router-link to="/">Gestion Membres</router-link>
        <router-link to="/login">Connexion</router-link>
        <router-link to="/register">Inscription</router-link>
      </div>
    </nav>

    <!-- Header fixe du backoffice (visible uniquement dans les pages backoffice) -->
    <div
      v-if="isLoggedIn && isBackOfficeRoute"
      class="fixed-header"
      :class="{ 'sidebar-active': isSidebarActive }"
    >
      <div class="row g-2">
        <div class="col-12 col-md-8">
          <div class="dashboard-banner">
            <div class="banner-left">
              <h2 class="banner-title">{{ pageTitle }}</h2>
              <div class="banner-options">
                <div @click="logClick('General')">
                  <router-link to="/backoffice" class="banner-option">General</router-link>
                </div>
                <span class="option-divider">/</span>
                <div @click="logClick('Vision par membre')">
                  <router-link to="/backoffice/membres" class="banner-option"
                    >Vision par membre</router-link
                  >
                </div>
              </div>
            </div>
            <div class="banner-center">
              <div class="member-card">
                <p class="member-label">Nb total membre</p>
                <p class="member-value">{{ totalMemberCount }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="user-card">
            <div class="user-info">
              <div class="user-name-container">
                <!-- Avatar avec options multiples -->
                <div class="user-avatar-container">
                  <!-- Avatar avec photo si disponible -->
                  <div v-if="user.photo" class="user-avatar-photo">
                    <img
                      :src="user.photo"
                      :alt="`Photo de ${user.nom}`"
                      class="avatar-image"
                      @error="handleImageError"
                    />
                    <div class="avatar-status-indicator"></div>
                  </div>

                  <!-- Avatar avec initiales si pas de photo mais nom disponible -->
                  <div v-else-if="user.nom && user.prenom" class="user-avatar-initials">
                    <span class="initials-text">
                      {{ getInitials(user.nom, user.prenom) }}
                    </span>
                    <div class="avatar-status-indicator"></div>
                  </div>

                  <!-- Avatar par défaut avec icône -->
                  <div v-else class="user-avatar-icon">
                    <i class="bi bi-person-circle"></i>
                    <div class="avatar-status-indicator"></div>
                    <div class="avatar-pulse-ring"></div>
                  </div>

                  <!-- Menu dropdown au hover/click -->
                  <div class="avatar-dropdown" v-show="showDropdown">
                    <div class="dropdown-item" @click="viewProfile">
                      <i class="bi bi-person"></i>
                      <span>Mon Profil</span>
                    </div>
                    <div class="dropdown-item" @click="editProfile">
                      <i class="bi bi-gear"></i>
                      <span>Paramètres</span>
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item logout-item" @click="logout">
                      <i class="bi bi-box-arrow-right"></i>
                      <span>Déconnexion</span>
                    </div>
                  </div>
                </div>

                <div class="user-text-info">
                  <p class="user-name" @click="toggleDropdown">
                    {{ user.nom || 'Utilisateur' }}
                    <i class="bi bi-chevron-down" :class="{ rotated: showDropdown }"></i>
                  </p>
                  <p class="user-role" v-if="user.role">{{ user.role }}</p>
                </div>
              </div>
              <p class="user-last-login">Dernière connexion : {{ currentDate }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu de la page avec padding-top si header fixe -->
    <div :class="{ 'with-fixed-header': isLoggedIn && isBackOfficeRoute }">
      <router-view :user="user" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  data() {
    return {
      isLoggedIn: false,
      user: {},
      totalMemberCount: 0,
      currentDate: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      showDropdown: false,
      imageError: false,
    }
  },
  computed: {
    showGlobalNav() {
      const publicRoutes = ['/', '/register', '/forgot-password']
      return publicRoutes.includes(this.$route.path)
    },
    showUserNav() {
      const protectedRoutes = ['/accueil', '/backoffice']
      return protectedRoutes.includes(this.$route.path)
    },
    isBackOfficeRoute() {
      return this.$route.path.startsWith('/backoffice')
    },
    isSidebarActive() {
      return this.$route.path.startsWith('/backoffice') && this.$route.path !== '/backoffice'
    },
    pageTitle() {
      return 'Tableau de bord des membres'
    },
  },
  watch: {
    $route() {
      this.checkLoginStatus()
      if (this.isBackOfficeRoute) {
        this.loadMemberCount()
      }
    },
  },
  created() {
    this.checkLoginStatus()
    if (this.isBackOfficeRoute) {
      this.loadMemberCount()
    }
    this.$router.afterEach(() => {
      this.checkLoginStatus()
      if (this.isBackOfficeRoute) {
        this.loadMemberCount()
      }
    })
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      this.isLoggedIn = !!token
      const userData = localStorage.getItem('user')
      if (userData) {
        this.user = JSON.parse(userData)
      } else {
        this.user = {}
      }
    },
    async loadMemberCount() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token manquant. Utilisateur non connecté.')
          this.totalMemberCount = 0
          return
        }

        const response = await fetch('http://localhost:8000/router/membres/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erreur lors de la récupération des membres')
        }

        const membres = await response.json()
        console.log('Membres récupérés:', membres)

        this.totalMemberCount = membres.length || 0
      } catch (error) {
        console.error('Erreur lors du chargement du nombre de membres:', error)
        this.totalMemberCount = 0
      }
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.isLoggedIn = false
      this.user = {}
      this.$router.push('/login')
    },
    getInitials(nom, prenom) {
      const nomInitial = nom ? nom.charAt(0).toUpperCase() : ''
      const prenomInitial = prenom ? prenom.charAt(0).toUpperCase() : ''
      return nomInitial + prenomInitial
    },
    handleImageError() {
      this.imageError = true
      console.warn("Erreur lors du chargement de l'image de profil")
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    viewProfile() {
      this.showDropdown = false
      this.$router.push('/profile')
    },
    editProfile() {
      this.showDropdown = false
      this.$router.push('/settings')
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showDropdown = false
      }
    },
    logClick(link) {
      console.log(`Clic sur le lien : ${link}`)
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>

<style scoped>
/* Corrections pour les liens dans les banner-options */
.banner-options {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin: 0.2rem 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: 500;
}

.banner-options > div,
.banner-options > span {
  display: flex;
  align-items: center;
}

.banner-option {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition:
    color 0.3s ease,
    transform 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  line-height: 1;
}

.banner-option:hover {
  color: #ffffff;
  transform: translateY(-1px);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.banner-option.disabled {
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  pointer-events: none;
}

.option-divider {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0.1rem;
  font-weight: 300;
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

/* Amélioration du container banner-left pour éviter les décalages */
.banner-left {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.banner-left h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;
  line-height: 1.2;

  background: linear-gradient(45deg, #fff, #fff, #ffffff80, #fff);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
}

/* Ajustements pour le dashboard-banner */
.dashboard-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex: 1;
  width: 100%;
}

/* Correction pour les cartes membres - DÉPLACÉE VERS LA GAUCHE ET VERS LE HAUT */
.banner-center {
  display: flex;
  align-items: flex-start; /* Alignement en haut */
  justify-content: flex-start;
  margin-left: -8rem;
  height: 100%;
}

/* Carte membre avec effet néon - POSITIONNEMENT MODIFIÉ */
.member-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.8rem 1rem;
  border-radius: 12px;
  text-align: center;
  min-width: 110px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  animation: cardPulse 4s ease-in-out infinite;
  transition: all 0.3s ease;
  margin-left: -12rem;
  position: relative;
  z-index: 1;
  transform: translateY(-8px); /* Déplacement vers le haut */
}

/* Carte utilisateur stylisée - POSITIONNEMENT MODIFIÉ */
.user-card {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.7rem 4rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-8px); /* Déplacement vers le haut */
}

/* Ajustement de l'en-tête fixe pour ajouter de l'espace en bas */
.fixed-header {
  position: fixed;
  top: 10px;
  left: 205px;
  right: 15px;
  z-index: 1100;
  background: linear-gradient(145deg, #4a609e 0%, #3b82f6 50%, #1d4ed8 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 1px 0 rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  height: 104px;
  display: flex;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.25, 0.3, 0.25, 1);
  margin-bottom: 10px; /* Espace en bas */
}

/* Ajustement du padding-top pour le contenu */
.with-fixed-header {
  padding-top: 125px; /* Augmenté pour compenser margin-bottom et translateY */
}

/* Responsive amélioré */
@media (max-width: 767px) {
  .dashboard-banner {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .banner-center {
    margin-left: -2rem;
  }

  .member-card {
    margin-left: -4rem;
    transform: translateY(-5px); /* Moins de déplacement sur mobile */
  }

  .user-card {
    transform: translateY(-5px); /* Moins de déplacement sur mobile */
  }

  .fixed-header {
    left: 10px;
    right: 10px;
    top: 10px;
    padding: 1.2rem;
    height: 120px;
    border-radius: 15px;
    margin-bottom: 8px; /* Espace réduit sur mobile */
  }

  .with-fixed-header {
    padding-top: 140px; /* Ajusté pour mobile */
  }
}

/* Style pour les liens actifs dans le header */
.banner-option.router-link-active {
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.banner-option.router-link-exact-active {
  color: #ffffff;
  font-weight: 700;
  position: relative;
}

.banner-option.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1px;
}

.layout {
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: 0;
}

.layout.dashboard {
  min-height: 100vh;
  height: 100vh;
  overflow-y: hidden;
}

/* Styles de la navbar */
.navbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem 2rem;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 55px;
  font-family: 'Roboto', sans-serif;
}

.navbar-brand {
  display: flex;
  align-items: center;
  margin-left: 80px;
}

.navbar-logo {
  height: 40px;
  width: auto;
}

.navbar-links {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.navbar-links a {
  margin-left: 1.5rem;
  text-decoration: none;
  color: #333;
  font-weight: 700;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.navbar-links a:hover {
  color: goldenrod;
  text-decoration: underline;
}

/* Effet de hover pour toute la barre */
.fixed-header:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.2),
    0 6px 20px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Effet de particules flottantes */
.fixed-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size:
    300px 300px,
    200px 200px,
    400px 400px;
  pointer-events: none;
  opacity: 0.6;
}

@keyframes floatingParticles {
  0%,
  100% {
    background-position:
      0% 0%,
      0% 0%,
      0% 0%;
  }
  33% {
    background-position:
      30% 30%,
      -30% 30%,
      30% -30%;
  }
  66% {
    background-position:
      -30% 30%,
      30% -30%,
      -30% -30%;
  }
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -1rem;
  width: 110%;
  height: 100%;
  align-items: center;
}

.g-2 > * {
  padding: 0.5rem;
}

.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

@media (min-width: 768px) {
  .col-md-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
    display: flex;
    align-items: center;
    height: 100%;
  }

  .col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
  }
}

.banner-left h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;

  background: linear-gradient(45deg, #fff, #fff, #ffffff80, #fff);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%,
  100% {
    background-position: -200% 0;
  }
  50% {
    background-position: 200% 0;
  }
}

.member-card:hover {
  transform: translateY(-13px) scale(1.05); /* Ajusté pour compenser translateY initial */
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(255, 255, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

@keyframes cardPulse {
  0%,
  100% {
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 0 15px rgba(255, 255, 255, 0.2);
  }
}

.member-label {
  margin: 0;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.member-value {
  margin: 0.1rem 0 0 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  background: linear-gradient(45deg, #00f5ff, #ffffff, #00f5ff);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: textGlow 2s ease-in-out infinite alternate;
}

@keyframes textGlow {
  0% {
    background-position: 0% 50%;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  100% {
    background-position: 100% 50%;
    text-shadow:
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 10px rgba(0, 245, 255, 0.5);
  }
}

.user-card:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-12px); /* Ajusté pour compenser translateY initial */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.user-name-container {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.user-avatar-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.user-avatar-photo {
  position: relative;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e5e7eb;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 0 0 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.user-avatar-photo:hover {
  transform: scale(1.1);
  border-color: #ffffff;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(255, 255, 255, 0.6),
    0 0 0 3px rgba(255, 255, 255, 0.2);
}

.user-avatar-photo:hover .avatar-image {
  transform: scale(1.05);
}

.user-avatar-initials {
  position: relative;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.initials-text {
  font-size: 0.6rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
}

.user-avatar-initials:hover {
  transform: scale(1.1);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  border-color: #ffffff;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(255, 255, 255, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.user-avatar-icon {
  position: relative;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(243, 244, 246, 0.8);
  backdrop-filter: blur(10px);
  overflow: visible;
}

.user-avatar-icon i {
  font-size: 1.4rem;
  color: #6b7280;
  transition: all 0.3s ease;
}

.user-avatar-icon:hover {
  transform: scale(1.1);
  border-color: #ffffff;
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(255, 255, 255, 0.5);
}

.user-avatar-icon:hover i {
  color: #ffffff;
  transform: scale(1.1);
}

.avatar-pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 45px;
  height: 45px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: avatarPulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes avatarPulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

.avatar-status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #10b981;
  border: 2px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: statusBlink 3s ease-in-out infinite;
}

@keyframes statusBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.avatar-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 180px;
  z-index: 1200;
  animation: dropdownSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: top right;
}

@keyframes dropdownSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
  font-weight: 500;
  font-size: 0.9rem;
}

.dropdown-item i {
  margin-right: 0.5rem;
  font-size: 1rem;
  width: 16px;
  color: #6b7280;
}

.dropdown-item:hover {
  background: rgba(79, 172, 254, 0.1);
  color: #1f2937;
}

.dropdown-item:hover i {
  color: #4facfe;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.logout-item:hover i {
  color: #dc2626;
}

.dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
}

.user-text-info {
  margin-left: 0.3rem;
}

.user-role {
  margin: 0.1rem 0 0 0;
  font-size: 0.6rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bi-chevron-down.rotated {
  transform: rotate(180deg);
}

.user-name-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.user-name {
  margin: 0;
  font-weight: 600;
  font-size: 0.8rem;
  color: #374151;
  text-shadow: none;
}

.user-last-login {
  margin: 0.2rem 0 0 0;
  font-size: 0.6rem;
  color: #9ca3af;
  font-weight: 500;
}

.bi-chevron-down {
  transition: transform 0.3s ease;
  color: #6b7280;
}

.user-name:hover .bi-chevron-down {
  transform: rotate(180deg);
  color: #374151;
}

@media (max-width: 767px) {
  .user-avatar-photo,
  .user-avatar-initials,
  .user-avatar-icon {
    width: 40px;
    height: 40px;
  }

  .avatar-pulse-ring {
    width: 40px;
    height: 40px;
  }

  .avatar-dropdown {
    right: -10px;
    min-width: 160px;
  }
}

@media (min-width: 768px) {
  .fixed-header.sidebar-collapsed {
    left: 90px;
  }

  .fixed-header.sidebar-wide {
    left: 290px;
  }
}
</style>
