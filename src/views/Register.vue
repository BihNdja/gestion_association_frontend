<template>
  <div class="page-login d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-7">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <!-- Titre et sous-titre -->
              <h1 class="welcome-text">Inscription</h1>
              <h3 class="interface-title">Créer un nouveau compte</h3>

              <!-- Formulaire d'inscription -->
              <form @submit.prevent="register" class="d-flex flex-column align-items-center">
                <!-- Ligne 1 : Nom et Prénom côte à côte -->
                <div class="row w-100 mb-3">
                  <div class="col-6 position-relative">
                    <label for="nom" class="form-label d-block">Nom</label>
                    <i class="bi bi-person input-icon"></i>
                    <input
                      v-model="nom"
                      type="text"
                      class="form-control with-icon"
                      id="nom"
                      placeholder="Entrez votre nom"
                      required
                    />
                  </div>
                  <div class="col-6 position-relative">
                    <label for="prenom" class="form-label d-block">Prénom</label>
                    <i class="bi bi-person input-icon"></i>
                    <input
                      v-model="prenom"
                      type="text"
                      class="form-control with-icon"
                      id="prenom"
                      placeholder="Entrez votre prénom"
                      required
                    />
                  </div>
                </div>

                <!-- Ligne 2 : Téléphone et Email côte à côte -->
                <div class="row w-100 mb-3">
                  <div class="col-6 position-relative">
                    <label for="phone" class="form-label d-block">Téléphone</label>
                    <i class="bi bi-telephone input-icon"></i>
                    <input
                      v-model="phone"
                      type="tel"
                      class="form-control with-icon"
                      id="phone"
                      placeholder="Numéro de téléphone"
                      required
                    />
                  </div>
                  <div class="col-6 position-relative">
                    <label for="email" class="form-label d-block">Email</label>
                    <i class="bi bi-envelope input-icon"></i>
                    <input
                      v-model="email"
                      type="email"
                      class="form-control with-icon"
                      id="email"
                      placeholder="Entrez votre email"
                      required
                    />
                  </div>
                </div>

                <!-- Ligne 3 : Mot de passe (pleine largeur) -->
                <div class="mb-3 w-100 position-relative">
                  <label for="motDePasse" class="form-label d-block">Mot de passe</label>
                  <i class="bi bi-lock input-icon"></i>
                  <input
                    v-model="motDePasse"
                    type="password"
                    class="form-control with-icon"
                    id="motDePasse"
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                </div>

                <!-- Bouton S'inscrire -->
                <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Inscription...' : 'S’inscrire' }}
                </button>

                <!-- Lien vers la page de connexion -->
                <div class="text-center mt-3">
                  <router-link to="/login" class="register-link">
                    Déjà un compte ? Connectez-vous
                  </router-link>
                </div>
              </form>

              <!-- Messages de succès ou d'erreur -->
              <p
                v-if="message"
                class="mt-3 text-center"
                :class="{ 'text-success': success, 'text-danger': !success }"
              >
                {{ message }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_ENDPOINTS } from '@/api'

export default {
  name: 'UserRegister',
  data() {
    return {
      nom: '',
      prenom: '',
      phone: '',
      email: '',
      motDePasse: '',
      message: '',
      success: false,
      isLoading: false,
    }
  },
  methods: {
    async register() {
      this.message = ''
      this.success = false
      this.isLoading = true

      if (!this.nom || !this.prenom || !this.phone || !this.email || !this.motDePasse) {
        this.success = false
        this.message = 'Veuillez remplir tous les champs.'
        this.isLoading = false
        return
      }

      if (!/^\d{10,}$/.test(this.phone)) {
        this.success = false
        this.message = 'Veuillez entrer un numéro de téléphone valide (au moins 10 chiffres).'
        this.isLoading = false
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.success = false
        this.message = 'Veuillez entrer un email valide.'
        this.isLoading = false
        return
      }

      if (this.motDePasse.length < 8) {
        this.success = false
        this.message = 'Le mot de passe doit contenir au moins 8 caractères.'
        this.isLoading = false
        return
      }

      try {
        const response = await axios.post(API_ENDPOINTS.REGISTER, {
          nom: this.nom,
          prenom: this.prenom,
          phone: this.phone,
          email: this.email,
          motDePasse: this.motDePasse,
        })

        this.success = true
        this.message =
          response.data.message ||
          'Inscription réussie ! Vous serez redirigé vers la page de connexion.'
        this.nom = ''
        this.prenom = ''
        this.phone = ''
        this.email = ''
        this.motDePasse = ''

        setTimeout(() => this.$router.push('/login'), 2000)
      } catch (error) {
        this.success = false
        this.message = error.response?.data?.message || 'Erreur lors de l’inscription.'
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style src="../assets/css/register.css"></style>
