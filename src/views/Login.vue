<template>
  <div class="page-login d-flex justify-content-center align-items-center">
    <div class="card shadow-sm">
      <div class="card-body p-4">
        <!-- Formulaire de connexion -->
        <div v-if="!showForgotPasswordForm">
          <h1 class="welcome-text">Bienvenue</h1>
          <h3 class="interface-title">Connexion à l'interface de gestion</h3>
        </div>

        <!-- Formulaire de réinitialisation -->
        <div v-else>
          <h1 class="welcome-text">Réinitialisation du mot de passe</h1>
          <p class="reset-subtitle">Renseignez l'adresse e-mail de votre compte ci-dessous :</p>
        </div>

        <!-- Formulaire de connexion -->
        <form
          v-if="!showForgotPasswordForm"
          @submit.prevent="login"
          class="d-flex flex-column align-items-center"
        >
          <div class="mb-3 w-100 position-relative">
            <label for="email" class="form-label d-block">Login</label>
            <i class="bi bi-person input-icon"></i>
            <input
              v-model="email"
              type="email"
              class="form-control with-icon"
              id="email"
              placeholder="Entrez votre email"
              required
            />
          </div>
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
          <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="isLoading">
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
          <div class="text-center">
            <a href="#" @click.prevent="showForgotPasswordForm = true" class="forgot-password-link">
              Mot de passe oublié ?
            </a>
          </div>
          <!-- Lien vers /register -->
          <div class="text-center mt-3">
            <router-link to="/register" class="register-link">
              Pas de compte ? Inscrivez-vous
            </router-link>
          </div>
        </form>

        <!-- Formulaire de réinitialisation -->
        <form v-else @submit.prevent="requestReset" class="d-flex flex-column align-items-center">
          <div class="mb-3 w-100 position-relative">
            <label for="resetEmail" class="form-label d-block visually-hidden"
              >Renseignez l'adresse e-mail de votre compte ci-dessous:</label
            >
            <i class="bi bi-envelope input-icon"></i>
            <input
              v-model="resetEmail"
              type="email"
              class="form-control with-icon"
              id="resetEmail"
              placeholder="Entrez votre email"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="isLoading">
            {{ isLoading ? 'Envoi...' : 'Envoyer un lien de réinitialisation' }}
          </button>
          <div class="text-center">
            <a href="#" @click.prevent="showForgotPasswordForm = false" class="back-to-login-link">
              Retour à la connexion
            </a>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_ENDPOINTS } from '@/api' // Importer les endpoints centralisés

export default defineComponent({
  name: 'UserLogin', // Renommé pour corriger l'erreur ESLint
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      email: '',
      motDePasse: '',
      resetEmail: '',
      message: '',
      success: false,
      showForgotPasswordForm: false,
      isLoading: false,
    }
  },
  methods: {
    async login() {
      this.isLoading = true
      this.message = ''
      this.success = false

      if (!this.email || !this.motDePasse) {
        this.success = false
        this.message = 'Veuillez remplir tous les champs.'
        this.isLoading = false
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.success = false
        this.message = 'Veuillez entrer un email valide.'
        this.isLoading = false
        return
      }

      try {
        const response = await axios.post(API_ENDPOINTS.LOGIN, {
          email: this.email,
          motDePasse: this.motDePasse,
        })
        const data = response.data
        console.log('Login.vue - Réponse API:', data)
        if (response.status === 200) {
          const userData = {
            id_membre: data.data.id_membre,
            nom: data.data.nom,
            prenom: data.data.prenom,
            email: data.data.email,
            role: data.data.role,
          }
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('token', data.data.token)

          console.log('Token stocké:', data.data.token)
          console.log('User stocké:', userData)

          this.success = true
          this.message = 'Connexion réussie ! Redirection...'

          setTimeout(() => {
            if (userData.role === 'admin') {
              this.router.push('/backoffice')
            } else {
              this.router.push('/accueil')
            }
          }, 1000)
        }
      } catch (error) {
        console.error('Login.vue - Erreur lors de la connexion:', error)
        this.success = false
        this.message =
          error.response?.data?.message || 'Erreur de connexion. Vérifiez vos identifiants.'
      } finally {
        this.isLoading = false
      }
    },
    async requestReset() {
      this.isLoading = true
      this.message = ''
      this.success = false

      if (!this.resetEmail) {
        this.success = false
        this.message = 'Veuillez entrer votre email.'
        this.isLoading = false
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.resetEmail)) {
        this.success = false
        this.message = 'Veuillez entrer un email valide.'
        this.isLoading = false
        return
      }

      try {
        const response = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, {
          email: this.resetEmail,
        })
        if (response.status === 200) {
          this.success = true
          this.message =
            response.data.message ||
            'Un lien de réinitialisation a été envoyé à votre email. Vérifiez votre boîte de réception (et vos spams).'
          this.resetEmail = ''
          setTimeout(() => {
            this.showForgotPasswordForm = false
            this.message = ''
          }, 5000)
        }
      } catch (error) {
        this.success = false
        this.message =
          error.response?.data?.message || 'Erreur lors de la demande de réinitialisation.'
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>

<style src="../assets/css/login.css"></style>
