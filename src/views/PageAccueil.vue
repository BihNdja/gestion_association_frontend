<style scoped>
/* RESET ET CORRECTIONS GLOBALES */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Conteneur principal */
.dashboard-container {
  width: 100%; /* Remplace 100vw */
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Container pour centrer le contenu */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

/* Menu de navigation */
.navbar {
  background-color: #003d82;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
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
  padding: 160px 0 80px;
  margin: 0;
  position: relative;
  top: 70px;
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
  flex: 1;
  position: relative;
}

.cards-section {
  margin-bottom: 80px;
}

.side-card-section {
  margin-bottom: 100px;
  position: relative;
  z-index: 2;
}

.additional-content {
  margin-bottom: 150px;
  position: relative;
  z-index: 2;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 2;
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
  margin: 0;
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
  text-decoration: none;
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
    margin-top: 120px;
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
