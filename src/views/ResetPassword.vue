<template>
  <div class="reset-password-container">
    <h2>Réinitialisation du mot de passe</h2>
    <p>Veuillez entrer votre nouveau mot de passe.</p>

    <form @submit.prevent="handleResetPassword">
      <div class="form-group">
        <label for="password">Nouveau mot de passe :</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Entrez votre nouveau mot de passe"
          required
        />
      </div>

      <div class="form-group">
        <label for="confirm-password">Confirmez le mot de passe :</label>
        <input
          type="password"
          id="confirm-password"
          v-model="confirmPassword"
          placeholder="Confirmez votre nouveau mot de passe"
          required
        />
      </div>

      <!-- Afficher les erreurs ou messages de succès -->
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
      </button>
    </form>

    <p class="back-to-login">
      <router-link to="/login">Retour à la connexion</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

export default {
  name: 'ResetPassword',
  setup() {
    const route = useRoute()
    const token = ref(route.query.token || '') // Récupère le jeton depuis l'URL
    const password = ref('')
    const confirmPassword = ref('')
    const error = ref('')
    const success = ref('')
    const isLoading = ref(false)

    const handleResetPassword = async () => {
      // Réinitialiser les messages d'erreur et de succès
      error.value = ''
      success.value = ''

      // Valider les champs
      if (!password.value || !confirmPassword.value) {
        error.value = 'Veuillez remplir tous les champs.'
        return
      }

      if (password.value !== confirmPassword.value) {
        error.value = 'Les mots de passe ne correspondent pas.'
        return
      }

      // Validation supplémentaire du mot de passe (par exemple, longueur minimale)
      if (password.value.length < 8) {
        error.value = 'Le mot de passe doit contenir au moins 8 caractères.'
        return
      }

      isLoading.value = true

      try {
        // Envoyer une requête au backend pour réinitialiser le mot de passe
        const response = await axios.post('http://localhost:8000/router/membres/reset-password', {
          token: token.value,
          newPassword: password.value,
        })

        success.value =
          response.data.message ||
          'Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.'
        // Réinitialiser les champs
        password.value = ''
        confirmPassword.value = ''

        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          route.router.push('/login')
        }, 3000)
      } catch (err) {
        error.value =
          err.response?.data?.message ||
          'Une erreur est survenue lors de la réinitialisation. Le lien est peut-être expiré ou invalide.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      token,
      password,
      confirmPassword,
      error,
      success,
      isLoading,
      handleResetPassword,
    }
  },
}
</script>

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

p {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  text-align: center;
  margin-bottom: 15px;
}

.success-message {
  color: green;
  text-align: center;
  margin-bottom: 15px;
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
}

.back-to-login a {
  color: #007bff;
  text-decoration: none;
}

.back-to-login a:hover {
  text-decoration: underline;
}
</style>
