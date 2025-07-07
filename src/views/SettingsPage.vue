-- scroll --

<template>
  <div class="settings-page">
    <!-- Card avec défilement interne -->
    <div class="settings-card">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <div class="header-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              />
            </svg>
          </div>
          <h1>Paramètres</h1>
        </div>
        <button class="back-btn" @click="$router.push('/')" aria-label="Retour">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Retour
        </button>
      </div>

      <!-- Profil -->
      <section class="section">
        <div class="section-header">
          <div class="section-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2>Profil</h2>
        </div>

        <div v-if="profileLoading" class="loading">
          <div class="spinner"></div>
          <span>Chargement...</span>
        </div>

        <div v-else-if="profileError" class="error">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {{ profileMessage }}
        </div>

        <form v-else @submit.prevent="updateProfile" class="form">
          <div class="form-grid">
            <div class="form-group">
              <label for="nom">Nom</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="nom"
                  v-model="localUser.nom"
                  :disabled="!isAdmin"
                  required
                  :class="{ disabled: !isAdmin }"
                />
                <svg
                  v-if="!isAdmin"
                  class="lock-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <small v-if="!isAdmin" class="help-text">Réservé aux administrateurs</small>
            </div>

            <div class="form-group">
              <label for="prenom">Prénom</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="prenom"
                  v-model="localUser.prenom"
                  :disabled="!isAdmin"
                  required
                  :class="{ disabled: !isAdmin }"
                />
                <svg
                  v-if="!isAdmin"
                  class="lock-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <small v-if="!isAdmin" class="help-text">Réservé aux administrateurs</small>
            </div>

            <div class="form-group full-width">
              <label for="email">Email</label>
              <div class="input-wrapper">
                <input
                  type="email"
                  id="email"
                  v-model="localUser.email"
                  :disabled="!isAdmin"
                  required
                  :class="{ disabled: !isAdmin }"
                />
                <svg
                  class="input-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  ></path>
                  <polyline points="22 6 12 13 2 6"></polyline>
                </svg>
                <svg
                  v-if="!isAdmin"
                  class="lock-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <small v-if="!isAdmin" class="help-text">Réservé aux administrateurs</small>
            </div>

            <div class="form-group">
              <label for="role">Rôle</label>
              <div class="select-wrapper">
                <select
                  id="role"
                  v-model="localUser.role"
                  :disabled="!isAdmin"
                  :class="{ disabled: !isAdmin }"
                >
                  <option value="membre">Membre</option>
                  <option value="admin">Admin</option>
                </select>
                <svg
                  class="select-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <div class="form-group">
              <label for="photo">Photo de profil</label>
              <div class="photo-section">
                <div v-if="localUser.photo || photoPreview" class="photo-preview">
                  <img :src="photoPreview || localUser.photo" alt="Photo de profil" />
                  <div class="photo-overlay">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                      ></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                </div>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  @change="handlePhotoChange"
                  :disabled="!isAdmin"
                  class="file-input"
                />
                <label for="photo" class="file-label" :class="{ disabled: !isAdmin }">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Choisir une photo
                </label>
              </div>
            </div>
          </div>

          <div v-if="profileMessage" class="message" :class="{ error: profileError }">
            <svg
              v-if="profileError"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {{ profileMessage }}
          </div>

          <button v-if="isAdmin" type="submit" class="btn-primary" :disabled="profileLoading">
            <svg
              v-if="profileLoading"
              class="spinner-sm"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            {{ profileLoading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </form>
      </section>

      <!-- Mot de passe -->
      <section class="section">
        <div class="section-header">
          <div class="section-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2>Sécurité</h2>
        </div>

        <form @submit.prevent="changePassword" class="form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="oldPassword">Ancien mot de passe</label>
              <div class="input-wrapper">
                <input
                  type="password"
                  id="oldPassword"
                  v-model="password.old"
                  required
                  placeholder="Entrez votre mot de passe actuel"
                />
                <svg
                  class="input-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>

            <div class="form-group">
              <label for="newPassword">Nouveau mot de passe</label>
              <div class="input-wrapper">
                <input
                  type="password"
                  id="newPassword"
                  v-model="password.new"
                  required
                  placeholder="Nouveau mot de passe"
                />
                <svg
                  class="input-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1.1 0-3-1.1-3-3s1.9-3 3-3 3 1.1 3 3-1.9 3-3 3"></path>
                  <path d="M3 12c1.1 0 3-1.1 3-3s-1.9-3-3-3-3 1.1-3 3 1.9 3 3 3"></path>
                </svg>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <div class="input-wrapper">
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="password.confirm"
                  required
                  placeholder="Confirmer le mot de passe"
                />
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 28">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1.1 0-3-1.1-3-3s1.9-3 3-3 3 1.1 3 3-1.9 3-3 3"></path>
                  <path d="M3 12c1.1 0 3-1.1 3-3s-1.9-3-3-3-3 1.1-3 3 1.9 3 3 3"></path>
                </svg>
              </div>
            </div>
          </div>

          <div v-if="passwordMessage" class="message" :class="{ error: passwordError }">
            <svg
              v-if="passwordError"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {{ passwordMessage }}
          </div>

          <button type="submit" class="btn-primary" :disabled="passwordLoading">
            <svg
              v-if="passwordLoading"
              class="spinner-sm"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            {{ passwordLoading ? 'Modification...' : 'Changer le mot de passe' }}
          </button>
        </form>
      </section>

      <!-- Gestion des utilisateurs (admin uniquement) -->
      <section v-if="isAdmin" class="section">
        <div class="section-header">
          <div class="section-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h2>Gestion des utilisateurs</h2>
        </div>

        <div v-if="usersLoading" class="loading">
          <div class="spinner"></div>
          <span>Chargement des utilisateurs...</span>
        </div>

        <div v-else-if="usersError" class="error">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {{ usersMessage }}
        </div>

        <div v-else-if="users.length === 0" class="empty">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p>Aucun utilisateur trouvé.</p>
        </div>

        <div v-else class="user-management-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="selectedUser">Sélectionner un utilisateur</label>
              <div class="select-wrapper">
                <select
                  id="selectedUser"
                  v-model="selectedUserId"
                  @change="resetSelectedRole"
                  :disabled="usersLoading"
                >
                  <option value="" disabled>Sélectionnez un utilisateur</option>
                  <option v-for="user in users" :key="user.id_membre" :value="user.id_membre">
                    {{ user.nom }} {{ user.prenom }} ({{ user.email }})
                  </option>
                </select>
                <svg
                  class="select-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <div class="form-group">
              <label for="selectedRole">Rôle</label>
              <div class="select-wrapper">
                <select
                  id="selectedRole"
                  v-model="selectedRole"
                  :disabled="!selectedUserId || usersLoading"
                >
                  <option value="membre">Membre</option>
                  <option value="admin">Admin</option>
                </select>
                <svg
                  class="select-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <button
              class="btn-primary"
              :disabled="!selectedUserId || !selectedRole || usersLoading"
              @click="showRoleConfirmModal"
            >
              <svg
                v-if="usersLoading"
                class="spinner-sm"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              {{ usersLoading ? 'Mise à jour...' : 'Attribuer le rôle' }}
            </button>
          </div>

          <div v-if="usersMessage" class="message" :class="{ error: usersError }">
            <svg
              v-if="usersError"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {{ usersMessage }}
          </div>
        </div>
      </section>
    </div>

    <!-- Modale de confirmation -->
    <div v-if="showModal" class="modal-overlay" @click="cancelRoleChange">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Confirmer le changement</h3>
        </div>
        <p>
          Êtes-vous sûr de vouloir changer le rôle de
          <strong>{{ selectedUser?.nom }} {{ selectedUser?.prenom }}</strong> en
          <strong>"{{ selectedRole }}"</strong> ?
        </p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="cancelRoleChange">Annuler</button>
          <button class="btn-primary" @click="confirmRoleChange">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage',
  data() {
    return {
      localUser: {
        id_membre: null,
        nom: '',
        prenom: '',
        oral: '',
        role: 'membre',
        photo: '',
      },
      photoPreview: null,
      photoFile: null,
      password: {
        old: '',
        new: '',
        confirm: '',
      },
      users: [],
      profileMessage: '',
      profileError: false,
      profileLoading: true,
      passwordMessage: '',
      passwordError: false,
      passwordLoading: false,
      usersMessage: '',
      usersError: false,
      usersLoading: false,
      isAdmin: false,
      showModal: false,
      selectedUser: null,
      selectedUserId: '',
      selectedRole: '',
      previousRole: null,
    }
  },
  async created() {
    await this.fetchUserData()
    if (this.isAdmin) {
      await this.fetchUsers()
    }
  },
  methods: {
    async fetchUserData() {
      try {
        this.profileLoading = true
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Utilisateur non connecté')
        }
        const response = await fetch('http://localhost:8000/router/membres/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.message || 'Erreur lors de la récupération des données utilisateur',
          )
        }
        const userData = await response.json()
        this.localUser = {
          id_membre: userData.id_membre,
          nom: userData.nom || '',
          prenom: userData.prenom || '',
          email: userData.email || '',
          role: userData.role || 'membre',
          photo: userData.photo || '',
        }
        this.isAdmin = this.localUser.role === 'admin'
        localStorage.setItem('user', JSON.stringify(this.localUser))
      } catch (error) {
        this.profileMessage = error.message
        this.profileError = true
      } finally {
        this.profileLoading = false
      }
    },
    async fetchUsers() {
      try {
        this.usersLoading = true
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Utilisateur non connecté')
        }
        const response = await fetch('http://localhost:8000/router/membres/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erreur lors de la récupération des utilisateurs')
        }
        this.users = await response.json()
      } catch (error) {
        this.usersMessage = error.message
        this.usersError = true
      } finally {
        this.usersLoading = false
      }
    },

    handlePhotoChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.photoFile = file
        this.photoPreview = URL.createObjectURL(file)
      }
    },
    async updateProfile() {
      try {
        this.profileLoading = true
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Utilisateur non connecté')
        }
        if (!this.isAdmin) {
          throw new Error('Seuls les administrateurs peuvent modifier le profil')
        }
        const payload = {
          idMembre: this.localUser.id_membre,
          nom: this.localUser.nom,
          prenom: this.localUser.prenom,
          email: this.localUser.email,
          role: this.localUser.role,
        }
        const response = await fetch('http://localhost:8000/router/membres/update', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil')
        }
        localStorage.setItem('user', JSON.stringify(this.localUser))
        this.profileMessage = 'Profil mis à jour avec succès'
        this.profileError = false
        this.photoPreview = null
        this.photoFile = null
      } catch (error) {
        this.profileMessage = error.message
        this.profileError = true
      } finally {
        this.profileLoading = false
      }
    },
    async changePassword() {
      try {
        this.passwordLoading = true
        if (this.password.new !== this.password.confirm) {
          throw new Error('Les nouveaux mots de passe ne correspondent pas')
        }
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Utilisateur non connecté')
        }
        const response = await fetch('http://localhost:8000/router/membres/change-password', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldPassword: this.password.old,
            newPassword: this.password.new,
          }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erreur lors du changement de mot de passe')
        }
        this.passwordMessage = 'Mot de passe changé avec succès'
        this.passwordError = false
        this.password.old = ''
        this.password.new = ''
        this.password.confirm = ''
      } catch (error) {
        this.passwordMessage = error.message
        this.passwordError = true
      } finally {
        this.passwordLoading = false
      }
    },
    resetSelectedRole() {
      const selectedUser = this.users.find((user) => user.id_membre === this.selectedUserId)
      this.selectedRole = selectedUser ? selectedUser.role : ''
    },
    showRoleConfirmModal() {
      const user = this.users.find((user) => user.id_membre === this.selectedUserId)
      if (!user) return
      this.selectedUser = { ...user, role: this.selectedRole }
      this.previousRole = user.role
      this.showModal = true
    },
    cancelRoleChange() {
      if (this.selectedUser) {
        this.selectedUser.role = this.previousRole
      }
      this.showModal = false
      this.selectedUser = null
      this.previousRole = null
      this.selectedUserId = ''
      this.selectedRole = ''
    },
    async confirmRoleChange() {
      if (!this.selectedUser) return
      try {
        this.usersLoading = true
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Utilisateur non connecté')
        }
        const response = await fetch('http://localhost:8000/router/membres/update', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idMembre: this.selectedUser.id_membre,
            nom: this.selectedUser.nom,
            prenom: this.selectedUser.prenom,
            email: this.selectedUser.email,
            role: this.selectedUser.role,
          }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erreur lors de la mise à jour du rôle')
        }
        const updatedUserIndex = this.users.findIndex(
          (user) => user.id_membre === this.selectedUser.id_membre,
        )
        if (updatedUserIndex !== -1) {
          this.users.splice(updatedUserIndex, 1, { ...this.selectedUser })
        }
        this.usersMessage = `Rôle de ${this.selectedUser.nom} ${this.selectedUser.prenom} mis à jour avec succès`
        this.usersError = false
      } catch (error) {
        this.usersMessage = error.message
        this.usersError = true
      } finally {
        this.usersLoading = false
        this.showModal = false
        this.selectedUser = null
        this.previousRole = null
        this.selectedUserId = ''
        this.selectedRole = ''
      }
    },
  },
}
</script>

<style scoped>
html,
body,
#app {
  height: auto;
  overflow-y: auto; /* Permet le défilement global si nécessaire */
}

.settings-page {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh; /* Assure que la page couvre toute la hauteur */
}

.settings-card {
  max-width: 800px;
  width: 100%;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Défilement interne dans la carte */
  max-height: calc(100vh - 4rem); /* Hauteur max = hauteur de la fenêtre - padding */
}

.settings-card::-webkit-scrollbar {
  width: 8px;
}

.settings-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.settings-card::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.settings-card::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem 2rem 0; /* Ajout de padding en haut uniquement */
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  display: flex;
  align-items: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  color: #333;
}

.back-btn:hover {
  background-color: #f0f0f0;
}

.section {
  margin-bottom: 2rem;
  padding: 0 2rem; /* Padding latéral pour le contenu */
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.section-icon {
  display: flex;
  align-items: center;
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.form {
  max-width: 600px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  font-size: 1rem;
}

input:disabled,
select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input-icon,
.lock-icon {
  position: absolute;
  right: 0.5rem;
  color: #666;
}

.lock-icon {
  right: 2rem;
}

.help-text {
  color: #666;
  font-size: 0.875rem;
}

.select-wrapper {
  position: relative;
}

.select-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.photo-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.photo-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.photo-preview:hover .photo-overlay {
  opacity: 1;
}

.file-input {
  display: none;
}

.file-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border-radius: 0.25rem;
  cursor: pointer;
}

.file-label.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: #28a745;
}

.message.error {
  color: #dc3545;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.user-management-form {
  max-width: 600px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .settings-page {
    padding: 1rem;
  }

  .settings-card {
    max-height: calc(100vh - 2rem); /* Ajustement pour le padding réduit */
  }

  .header {
    padding: 1rem 1rem 0;
  }

  .section {
    padding: 0 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .settings-page {
    padding: 0.5rem;
  }

  .settings-card {
    max-height: calc(100vh - 1rem);
  }

  .header {
    padding: 0.5rem 0.5rem 0;
  }

  .section {
    padding: 0 0.5rem;
  }
}
</style>
