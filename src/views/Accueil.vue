<template>
  <div class="dashboard-container">
    <!-- Menu de navigation -->
    <nav class="navbar" :class="{ 'navbar-hidden': isHidden }">
      <div class="navbar-content">
        <div class="logo">
          <img src="../assets/images/LOGO_ST.jpg" alt="Logo" class="logo-img" />
        </div>
        <ul class="nav-links">
          <li><router-link to="/" class="nav-link">Accueil</router-link></li>
          <li><router-link to="/formations" class="nav-link">Nos formations</router-link></li>
          <li><router-link to="/about" class="nav-link">À propos de nous</router-link></li>
          <li><router-link to="/contact" class="nav-link">Nous contacter</router-link></li>
          <li><a href="#" class="nav-link" @click.prevent="logout">Déconnexion</a></li>
        </ul>
      </div>
    </nav>

    <!-- En-tête avec section "Venez vous former avec nous" -->
    <header class="hero-section">
      <div class="container">
        <h1 class="hero-title">Bienvenue, {{ user.prenom }} !</h1>
        <div class="hero-content">
          <h2 class="hero-subtitle">Venez vous former avec nous</h2>
          <p class="hero-description">
            Lorem Ipsum est tout simplement un texte factice de l'industrie de l'impression et de la
            composition. Lorem Ipsum est le texte factice standard de l'industrie depuis les années
            1500, lorsqu'un imprimeur inconnu a pris une galère de caractères et l'a brouillée pour
            en faire un livre de spécimens de caractères.
          </p>
          <button class="hero-button">Découvrez nos formations</button>
        </div>
      </div>
    </header>

    <!-- Contenu principal centré -->
    <main class="main-content">
      <div class="container">
        <!-- Première grille de cartes -->
        <section class="cards-section">
          <div class="row">
            <!-- Carte 1 : Formation & sensibilisation -->
            <div class="col">
              <div class="dashboard-card">
                <div class="card-image">
                  <img src="../assets/images/compta.jpg" alt="Formation & sensibilisation" />
                  <p class="image-description">Un groupe de participants en formation</p>
                </div>
                <h3 class="card-title">Formation & sensibilisation</h3>
                <p class="card-description">
                  Le morceau standard de Lorem Ipsum utilisé depuis les années 1500 est reproduit
                  ci-dessous pour ceux qui sont intéressés. Les sections 1.10.32 et 1.10.33 de « de
                  Finibus Bonorum et Malorum » de Cicéron sont également reproduites dans leur forme
                  originale exacte.
                </p>
              </div>
            </div>

            <!-- Carte 2 : Conseil juridique -->
            <div class="col">
              <div class="dashboard-card">
                <div class="card-image">
                  <img src="../assets/images/gestfin.jpg" alt="Conseil juridique" />
                  <p class="image-description">Un avocat en consultation</p>
                </div>
                <h3 class="card-title">Conseil juridique</h3>
                <p class="card-description">
                  Le morceau standard de Lorem Ipsum utilisé depuis les années 1500 est reproduit
                  ci-dessous pour ceux qui sont intéressés. Les sections 1.10.32 et 1.10.33 de « de
                  Finibus Bonorum et Malorum » de Cicéron sont également reproduites dans leur forme
                  originale exacte.
                </p>
              </div>
            </div>

            <!-- Carte 3 : Gestion des contentieux -->
            <div class="col">
              <div class="dashboard-card">
                <div class="card-image">
                  <img src="../assets/images/coTisation.jpg" alt="Gestion des contentieux" />
                  <p class="image-description">Une salle d'audience</p>
                </div>
                <h3 class="card-title">Gestion des contentieux</h3>
                <p class="card-description">
                  Le morceau standard de Lorem Ipsum utilisé depuis les années 1500 est reproduit
                  ci-dessous pour ceux qui sont intéressés. Les sections 1.10.32 et 1.10.33 de « de
                  Finibus Bonorum et Malorum » de Cicéron sont également reproduites dans leur forme
                  originale exacte.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section avec image à gauche et texte à droite -->
        <section class="side-card-section">
          <div class="side-card">
            <div class="side-card-image">
              <img src="../assets/images/fond_1.jpg" alt="Domaine juridique" />
            </div>
            <div class="side-card-content">
              <h3 class="side-card-title">Domaine juridique</h3>
              <p class="side-card-description">
                C'est un fait établi depuis longtemps qu'un lecteur sera distrait par le contenu
                lisible d'une page lorsqu'il regardera sa mise en page. L'intérêt d'utiliser Lorem
                Ipsum est qu'il a une distribution plus ou moins normale des lettres, par opposition
                à l'utilisation de « Contenu ici, contenu ici », ce qui le fait ressembler à de
                l'anglais lisible. De nombreux progiciels de publication assistée par ordinateur et
                éditeurs de pages Web utilisent désormais Lorem Ipsum comme texte modèle par défaut.
              </p>
            </div>
          </div>
        </section>

        <!-- Section additionnelle pour forcer le scroll -->
        <section class="additional-content">
          <div class="content-block">
            <h3>Nos Formations Spécialisées</h3>
            <p>
              Découvrez notre large gamme de formations professionnelles adaptées à vos besoins.
              Nous offrons des programmes complets dans différents domaines pour vous accompagner
              dans votre développement professionnel.
            </p>
          </div>
          <div class="content-block">
            <h3>Expertise et Accompagnement</h3>
            <p>
              Notre équipe d'experts vous accompagne tout au long de votre parcours de formation.
              Bénéficiez d'un suivi personalisé et de conseils adaptés à votre secteur d'activité.
            </p>
          </div>
          <div class="content-block">
            <h3>Certification et Reconnaissance</h3>
            <p>
              Toutes nos formations sont certifiées et reconnues par les organismes compétents.
              Obtenez des qualifications qui valoriseront votre profil professionnel.
            </p>
          </div>
          <!-- CONTENU SUPPLÉMENTAIRE POUR TESTER LE SCROLL -->
          <div class="content-block">
            <h3>Section Test 1</h3>
            <p>
              Cette section est ajoutée pour tester le scroll. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
              ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div class="content-block">
            <h3>Section Test 2</h3>
            <p>
              Une autre section pour augmenter la hauteur de la page. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>
          <div class="content-block">
            <h3>Section Test 3</h3>
            <p>
              Encore du contenu pour forcer le scroll. Sed ut perspiciatis unde omnis iste natus
              error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
              explicabo.
            </p>
          </div>
          <div class="content-block">
            <h3>Section Test 4</h3>
            <p>
              Plus de contenu pour garantir le scroll. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt.
            </p>
          </div>
          <div class="content-block">
            <h3>Section Test 5</h3>
            <p>
              Dernière section de test. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
              amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut
              labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
              nostrum exercitationem ullam corporis suscipit laboriosam.
            </p>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Nos Services</h4>
          <ul>
            <li>Formation & sensibilisation</li>
            <li>Gestion des contentieux</li>
            <li>Conseil juridique</li>
            <li>Rédaction de documents juridiques</li>
            <li>Relations avec les institutions</li>
            <li>Montage et pilotage budgétaire</li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contactez-nous</h4>
          <p><i class="bi bi-envelope"></i> info@synchrone-techno.ci</p>
          <p><i class="bi bi-telephone"></i> +225 06 38 24 07 / +33 6 13 50 09 98</p>
          <p><i class="bi bi-geo-alt"></i> Abidjan, Côte d'Ivoire</p>
        </div>
        <div class="footer-section">
          <h4>À propos</h4>
          <p>Votre partenaire pour la réussite.</p>
          <p>Suivez-nous :</p>
          <div class="social-icons">
            <a href="#"><i class="bi bi-facebook"></i></a>
            <a href="#"><i class="bi bi-twitter"></i></a>
            <a href="#"><i class="bi bi-linkedin"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Synchrone Formation. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PageAccueil',
  data() {
    return {
      user: { prenom: 'Utilisateur' },
      isHidden: false,
      lastScrollPosition: 0,
      hideThreshold: 50,
      showThreshold: 300,
    }
  },
  created() {
    this.loadUserData()
  },
  mounted() {
    // Forcer le scroll à fonctionner
    this.ensureScrollable()
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.ensureScrollable)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.ensureScrollable)
  },
  methods: {
    loadUserData() {
      const userData = localStorage.getItem('user')
      if (userData) {
        this.user = JSON.parse(userData)
      } else {
        console.log('Aucune donnée utilisateur trouvée')
      }
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    ensureScrollable() {
      // Forcer le scroll à fonctionner
      const body = document.body
      const html = document.documentElement

      // Réinitialiser les styles qui pourraient bloquer le scroll
      body.style.overflow = 'auto'
      body.style.height = 'auto'
      body.style.maxHeight = 'none'
      html.style.overflow = 'auto'
      html.style.height = 'auto'
      html.style.maxHeight = 'none'

      // S'assurer que le contenu dépasse la hauteur de la fenêtre
      const container = this.$el
      if (container) {
        const minHeight = window.innerHeight + 1000 // Ajouter 1000px pour forcer le scroll
        container.style.minHeight = `${minHeight}px`
      }
    },
    handleScroll() {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop

      if (currentScrollPosition < 0) return

      if (currentScrollPosition <= this.hideThreshold) {
        this.isHidden = false
      } else if (
        currentScrollPosition > this.lastScrollPosition &&
        currentScrollPosition > this.hideThreshold &&
        currentScrollPosition < this.showThreshold
      ) {
        this.isHidden = true
      } else if (currentScrollPosition >= this.showThreshold) {
        this.isHidden = false
      }

      this.lastScrollPosition = currentScrollPosition
    },
  },
}
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.dashboard-container/* CORRECTION GLOBALE DU SCROLL */
* {
  box-sizing: border-box;
}

/* Forcer le scroll sur le body et html */
:global(html) {
  overflow: auto !important;
  height: auto !important;
  max-height: none !important;
}

:global(body) {
  overflow: auto !important;
  height: auto !important;
  max-height: none !important;
  margin: 0;
  padding: 0;
}

/* Conteneur principal */
.dashboard-container {
  width: 100%;
  min-height: 100vh; /* Forcer une hauteur minimale importante */
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  overflow: visible;
}

/* Container pour centrer le contenu */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

/* Menu de navigation */
.navbar {
  background-color: #003d82;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.navbar-hidden {
  transform: translateY(-100%);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  width: 60px;
  height: auto;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #d4af37;
}

/* Section héroïque */
.hero-section {
  background: #003d82;
  color: #fff;
  text-align: center;
  padding: 120px 0 80px;
  margin-top: 0;
  margin-top: 70px;
}

.hero-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #d4af37;
}

.hero-subtitle {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 30px;
}

.hero-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.hero-button:hover {
  background-color: #0056b3;
}

/* Contenu principal */
.main-content {
  padding: 80px 0 120px;
  min-height: calc(100vh - 180px);
  overflow: visible; /* Assurer une hauteur minimale */
}

.cards-section {
  margin-bottom: 80px;
}

.side-card-section {
  margin-bottom: 80px;
}

.additional-content {
  margin-bottom: 80px;
}

/* Grille de cartes */
.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.col {
  display: flex;
}

/* Cartes */
.dashboard-card {
  background: #fff;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex: 1;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.image-description {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #003d82;
  margin-bottom: 15px;
}

.card-description {
  font-size: 0.95rem;
  color: #333;
  line-height: 1.5;
}

/* Carte latérale */
.side-card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  padding: 30px;
  gap: 30px;
  align-items: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.side-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.side-card-image {
  flex: 0 0 45%;
}

.side-card-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.side-card-content {
  flex: 1;
}

.side-card-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #003d82;
  margin-bottom: 20px;
}

.side-card-description {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
}

/* Contenu additionnel */
.content-block {
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.content-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.content-block h3 {
  color: #003d82;
  font-size: 1.4rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.content-block p {
  color: #333;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Footer */
.footer {
  background: linear-gradient(90deg, #003d82, #0056b3);
  color: #fff;
  padding: 50px 0 20px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section h4 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #d4af37;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.footer-section p {
  margin: 10px 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.footer-section p i {
  margin-right: 10px;
}

.social-icons a {
  color: #fff;
  margin-right: 15px;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.social-icons a:hover {
  color: #d4af37;
}

.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 30px;
}

.footer-bottom p {
  font-size: 0.85rem;
  color: #ccc;
  margin: 0;
}

/* Media queries */
@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }

  .hero-section {
    padding: 140px 0 60px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 2rem;
  }

  .side-card {
    flex-direction: column;
    text-align: center;
  }

  .side-card-image {
    flex: none;
    width: 100%;
  }

  .side-card-image img {
    height: 200px;
  }

  .row {
    grid-template-columns: 1fr;
  }
}
</style>
