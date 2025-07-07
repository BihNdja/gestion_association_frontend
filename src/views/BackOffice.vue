<template>
  <div class="backoffice">
    <!-- Loader -->
    <div v-if="isLoading" class="loader-overlay">
      <div class="spinner">Chargement...</div>
    </div>

    <!-- Sidebar -->
    <div :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]">
      <div class="sidebar-header">
        <div class="navbar-brand">
          <button @click="toggleSidebar" class="navbar-toggle-btn">
            <span>{{ isCollapsed ? '→' : '←' }}</span>
          </button>
          <div class="navbar-title">Gescoti</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <router-link
          to="/backoffice/accueil"
          class="backoffice-nav-link"
          :class="{ active: $route.path === '/backoffice/accueil' }"
          :title="isCollapsed ? 'Accueil' : ''"
        >
          <i class="fa fa-home nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Dashboard</span>
          <span v-else class="nav-text-short">D</span>
        </router-link>
        <router-link
          to="/backoffice/membres"
          class="backoffice-nav-link"
          :class="{ active: $route.path === '/backoffice/membres' }"
          :title="isCollapsed ? 'Membres' : ''"
        >
          <i class="fa fa-users nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Membres</span>
          <span v-else class="nav-text-short">M</span>
        </router-link>
        <router-link
          to="/backoffice/cotisations"
          class="backoffice-nav-link"
          :class="{ active: $route.path === '/backoffice/cotisations' }"
          :title="isCollapsed ? 'Cotisations' : ''"
        >
          <i class="fa fa-money-bill nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Cotisations</span>
          <span v-else class="nav-text-short">C</span>
        </router-link>
        <router-link
          to="/backoffice/statistiques"
          class="backoffice-nav-link"
          :class="{ active: $route.path === '/backoffice/statistiques' }"
          :title="isCollapsed ? 'Statistiques' : ''"
        >
          <i class="fa fa-chart-bar nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Statistiques</span>
          <span v-else class="nav-text-short">S</span>
        </router-link>
        <router-link
          to="/backoffice/historique"
          class="backoffice-nav-link"
          :class="{ active: $route.path === '/backoffice/historique' }"
          :title="isCollapsed ? 'Historique' : ''"
        >
          <i class="fa fa-history nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Historique</span>
          <span v-else class="nav-text-short">H</span>
        </router-link>
        <router-link
          to="/backoffice/parametres"
          class="backoffice-nav-link"
          :class="{ active: $route.path === '/backoffice/parametres' }"
          :title="isCollapsed ? 'Paramètres' : ''"
        >
          <i class="fa fa-cog nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Paramètres</span>
          <span v-else class="nav-text-short">P</span>
        </router-link>
        <a
          href="#"
          class="backoffice-nav-link deconnexion"
          @click.prevent="logout"
          :title="isCollapsed ? 'Déconnexion' : ''"
        >
          <i class="fa fa-sign-out-alt nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Déconnexion</span>
          <span v-else class="nav-text-short">X</span>
        </a>
      </nav>
    </div>

    <!-- Contenu principal -->
    <div :class="['main-content', { 'main-content-collapsed': isCollapsed }]">
      <router-view
        v-model:newCotisation="newCotisation"
        :membres="membres"
        :errorMembres="errorMembres"
        :cotisations="cotisations"
        :errorCotisations="errorCotisations"
        :stats="stats"
        :errorStats="errorStats"
        :cotisationMessage="cotisationMessage"
        :cotisationSuccess="cotisationSuccess"
        v-model:searchQuery="searchQuery"
        :filteredCotisations="filteredCotisations"
        :userName="userName"
        :isCollapsed="isCollapsed"
        :totalMemberCount="totalMemberCount"
        :totalCotisationsThisMonth="totalCotisationsThisMonth"
        :recentActivityCount="recentActivityCount"
        :getMembreName="getMembreName"
        :formatDate="formatDate"
        :activities="activities"
        :openAddCotisationModal="openAddCotisationModal"
        @toggle-sidebar="toggleSidebar"
        @logout="logout"
        @add-cotisation="addCotisation"
        @edit-cotisation="openEditModal"
        @delete-cotisation="deleteCotisation"
        @delete-membre="deleteMembre"
      ></router-view>

      <!-- Modale de modification -->
      <div v-if="showEditModal" class="modal">
        <div class="modal-content">
          <h3>Modifier la cotisation</h3>
          <div class="modal-body">
            <form @submit.prevent="submitEditCotisation">
              <div class="form-columns">
                <!-- Colonne 1 -->
                <div class="form-column">
                  <div class="form-group">
                    <label for="editIdMembre">ID Membre :</label>
                    <input id="editIdMembre" v-model="editForm.idMembre" type="number" required />
                  </div>
                  <div class="form-group">
                    <label for="editMontant">Montant (€) :</label>
                    <input
                      id="editMontant"
                      v-model="editForm.montant"
                      type="number"
                      step="0.01"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="editDatePaiement">Date de paiement :</label>
                    <input
                      id="editDatePaiement"
                      v-model="editForm.datePaiement"
                      type="date"
                      required
                    />
                  </div>
                </div>
                <!-- Colonne 2 -->
                <div class="form-column">
                  <div class="form-group">
                    <label for="editModePaiement">Mode de paiement :</label>
                    <select id="editModePaiement" v-model="editForm.modePaiement" required>
                      <option value="mobile money">Mobile Money</option>
                      <option value="espèces">Espèces</option>
                      <option value="virement">Virement</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="editStatutPaiement">Statut de paiement :</label>
                    <select id="editStatutPaiement" v-model="editForm.statutPaiement" required>
                      <option value="en attente">En attente</option>
                      <option value="payé">Payé</option>
                      <option value="échoué">Échoué</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="editPeriode">Période (ex. 2025-04) :</label>
                    <input
                      id="editPeriode"
                      v-model="editForm.periode"
                      type="text"
                      placeholder="YYYY-MM"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-primary" @click="submitEditCotisation">
              Enregistrer
            </button>
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Annuler</button>
          </div>
        </div>
      </div>

      <!-- Modale "Ajouter une cotisation" -->
      <div v-if="showAddFromMemberModal" class="modal">
        <div class="modal-content">
          <h3>Ajouter une cotisation</h3>
          <div class="modal-body">
            <form @submit.prevent="submitAddCotisationFromMember">
              <div class="form-columns">
                <!-- Colonne 1 -->
                <div class="form-column">
                  <div class="form-group">
                    <label for="addFromMemberIdMembre">Membre :</label>
                    <select
                      id="addFromMemberIdMembre"
                      v-model="addFromMemberForm.idMembre"
                      required
                    >
                      <option value="" disabled>Sélectionnez un membre</option>
                      <option
                        v-for="membre in membres"
                        :key="membre.id_membre"
                        :value="membre.id_membre"
                      >
                        {{ membre.nom }} {{ membre.prenom }} (ID: {{ membre.id_membre }})
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="addFromMemberMontant">Montant (€) :</label>
                    <input
                      id="addFromMemberMontant"
                      v-model="addFromMemberForm.montant"
                      type="number"
                      step="0.01"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label for="addFromMemberDatePaiement">Date de paiement :</label>
                    <input
                      id="addFromMemberDatePaiement"
                      v-model="addFromMemberForm.datePaiement"
                      type="date"
                      required
                    />
                  </div>
                </div>
                <!-- Colonne 2 -->
                <div class="form-column">
                  <div class="form-group">
                    <label for="addFromMemberModePaiement">Mode de paiement :</label>
                    <select
                      id="addFromMemberModePaiement"
                      v-model="addFromMemberForm.modePaiement"
                      required
                    >
                      <option value="mobile money">Mobile Money</option>
                      <option value="espèces">Espèces</option>
                      <option value="virement">Virement</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="addFromMemberStatutPaiement">Statut de paiement :</label>
                    <select
                      id="addFromMemberStatutPaiement"
                      v-model="addFromMemberForm.statutPaiement"
                      required
                    >
                      <option value="en attente">En attente</option>
                      <option value="payé">Payé</option>
                      <option value="échoué">Échoué</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="addFromMemberPeriode">Période (ex. 2025-04) :</label>
                    <input
                      id="addFromMemberPeriode"
                      v-model="addFromMemberForm.periode"
                      type="text"
                      placeholder="YYYY-MM"
                      required
                    />
                  </div>
                </div>
              </div>
              <div
                v-if="cotisationMessage"
                :class="cotisationSuccess ? 'success' : 'error'"
                class="form-message"
              >
                {{ cotisationMessage }}
              </div>
            </form>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-primary" @click="submitAddCotisationFromMember">
              Enregistrer
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeAddCotisationFromMemberModal"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/BackOffice.css' // Importation du fichier CSS

export default {
  name: 'BackOffice',
  data() {
    return {
      membres: [],
      cotisations: [],
      stats: [],
      activities: [],
      newCotisation: {
        idMembre: '',
        montant: '',
        datePaiement: '',
        modePaiement: 'mobile money',
        statutPaiement: 'en attente',
        periode: '',
      },
      searchQuery: '',
      errorMembres: '',
      errorCotisations: '',
      errorStats: '',
      cotisationMessage: '',
      cotisationSuccess: false,
      isCollapsed: false,
      showEditModal: false,
      editForm: {
        idCotisation: null,
        idMembre: '',
        montant: '',
        datePaiement: '',
        modePaiement: 'mobile money',
        statutPaiement: 'payé',
        periode: '',
      },
      isLoading: false,
      userName: '',
      showAddFromMemberModal: false,
      addFromMemberForm: {
        idMembre: '',
        nomMembre: '',
        montant: '',
        datePaiement: '',
        modePaiement: 'mobile money',
        statutPaiement: 'en attente',
        periode: '',
      },
    }
  },
  computed: {
    filteredCotisations() {
      if (!this.searchQuery) {
        return this.cotisations
      }
      const query = this.searchQuery.toLowerCase()
      return this.cotisations.filter((cotisation) => {
        const membreName = this.getMembreName(cotisation.id_membre).toLowerCase()
        const montant = cotisation.montant.toString()
        const date = this.formatDate(cotisation.date_paiement).toLowerCase()
        const statut = cotisation.statut_paiement.toLowerCase()
        return (
          membreName.includes(query) ||
          montant.includes(query) ||
          date.includes(query) ||
          statut.includes(query)
        )
      })
    },
    totalMemberCount() {
      return this.membres.length || 0
    },
    totalCotisationsThisMonth() {
      const currentMonth = new Date().toISOString().slice(0, 7)
      const total = this.cotisations
        .filter((c) => c.periode && c.periode.startsWith(currentMonth))
        .reduce((sum, c) => sum + (parseFloat(c.montant) || 0), 0)
      return total.toFixed(2)
    },
    recentActivityCount() {
      const today = new Date().toISOString().slice(0, 10)
      return this.activities.filter((activity) => activity.date && activity.date.startsWith(today))
        .length
    },
  },
  watch: {
    $route(to) {
      console.log('Navigated to:', to.path)
    },
  },
  async created() {
    this.isLoading = true
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      this.userName = user ? user.name || user.email : 'Utilisateur'
      console.log('Current route:', this.$route.path)

      await Promise.all([
        this.fetchMembres(),
        this.fetchCotisations(),
        this.fetchStats(),
        this.fetchActivities(),
      ])

      console.log('Fetched cotisations:', this.cotisations)
    } catch (error) {
      console.error('Error during data fetch:', error)
    } finally {
      this.isLoading = false
    }
  },
  beforeUnmount() {},
  methods: {
    async fetchMembres() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.errorMembres = 'Utilisateur non connecté. Veuillez vous connecter.'
          this.$router.push('/login')
          return
        }
        const response = await fetch('http://localhost:8000/router/membres/all', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erreur lors de la récupération des membres')
        }
        this.membres = await response.json()
      } catch (error) {
        this.errorMembres = error.message
        console.error('Fetch membres error:', error)
        this.membres = []
        this.$router.push('/login')
      }
    },
    async fetchCotisations() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.errorCotisations = 'Utilisateur non connecté. Veuillez vous connecter.'
          this.$router.push('/login')
          return
        }
        const response = await fetch('http://localhost:8000/router/membres/cotisations', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erreur lors de la récupération des cotisations')
        }
        this.cotisations = await response.json()
        console.log('Cotisations fetched:', this.cotisations)
      } catch (error) {
        this.errorCotisations = error.message
        console.error('Fetch cotisations error:', error)
        this.cotisations = []
      }
    },
    async fetchStats() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.errorStats = 'Utilisateur non connecté. Veuillez vous connecter.'
          this.$router.push('/login')
          return
        }
        const response = await fetch('http://localhost:8000/router/membres/cotisation-stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Erreur lors de la récupération des statistiques')
        }
        this.stats = await response.json()
      } catch (error) {
        this.errorStats = error.message
        console.error('Fetch stats error:', error)
        this.stats = []
      }
    },
    async fetchActivities() {
      try {
        const token = localStorage.getItem('token')
        console.log('Token dans fetchActivities:', token)
        if (!token) {
          console.error('Utilisateur non connecté')
          return
        }

        const response = await fetch('http://localhost:8000/router/membres/activities', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const responseData = await response.json()
        console.log('Réponse de fetchActivities:', response.status, responseData)

        if (!response.ok) {
          throw new Error(responseData.message || 'Erreur lors de la récupération des activités')
        }

        this.activities = responseData
        console.log('Activités mises à jour:', this.activities)
      } catch (error) {
        console.error('Erreur dans fetchActivities:', error)
        this.activities = []
      }
    },
    async addActivity(activity) {
      try {
        const token = localStorage.getItem('token')
        console.log('Token dans addActivity:', token)
        console.log('Données envoyées à add-activity:', activity)

        const response = await fetch('http://localhost:8000/router/membres/add-activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(activity),
        })

        const responseData = await response.json()
        console.log('Réponse de add-activity:', response.status, responseData)

        if (!response.ok) {
          this.cotisationMessage = responseData.message || 'Erreur lors de l’ajout de l’activité'
          this.cotisationSuccess = false
          console.error("Erreur d'ajout d'activité:", responseData.message)
        } else {
          await this.fetchActivities()
          this.cotisationMessage = 'Activité enregistrée avec succès'
          this.cotisationSuccess = true
        }
      } catch (error) {
        this.cotisationMessage = 'Erreur serveur lors de l’enregistrement de l’activité'
        this.cotisationSuccess = false
        console.error('Erreur dans addActivity:', error)
      }
    },
    async addCotisation(cotisationData) {
      this.isLoading = true
      try {
        const token = localStorage.getItem('token')
        const newData = {
          idMembre: cotisationData.idMembre,
          montant: cotisationData.montant,
          datePaiement: cotisationData.datePaiement,
          modePaiement: cotisationData.modePaiement,
          statutPaiement: cotisationData.statutPaiement,
          periode: cotisationData.periode,
        }
        let validationError = ''
        if (!newData.idMembre) validationError = 'ID Membre requis.'
        else if (!newData.montant || isNaN(parseFloat(newData.montant)))
          validationError = 'Montant doit être un nombre valide.'
        else if (!newData.datePaiement) validationError = 'Date de paiement requise.'
        else if (!newData.modePaiement) validationError = 'Mode de paiement requis.'
        else if (!newData.statutPaiement) validationError = 'Statut de paiement requis.'
        else if (!newData.periode) validationError = 'Période requise.'

        if (validationError) {
          this.cotisationMessage = `Erreur de validation : ${validationError}`
          this.cotisationSuccess = false
          return
        }

        const response = await fetch('http://localhost:8000/router/membres/add-cotisation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newData),
        })
        const result = await response.json()
        if (response.ok) {
          this.cotisationMessage = result.message
          this.cotisationSuccess = true

          await this.addActivity({
            date: new Date().toISOString(),
            action: 'Ajout de cotisation',
            details: `Membre ${this.getMembreName(parseInt(newData.idMembre))} - ${newData.montant}€`,
            user_id: parseInt(newData.idMembre),
          })

          this.newCotisation = {
            idMembre: '',
            montant: '',
            datePaiement: '',
            modePaiement: 'mobile money',
            statutPaiement: 'en attente',
            periode: '',
          }
          this.addFromMemberForm = {
            idMembre: '',
            nomMembre: '',
            montant: '',
            datePaiement: '',
            modePaiement: 'mobile money',
            statutPaiement: 'en attente',
            periode: '',
          }
          await Promise.all([this.fetchCotisations(), this.fetchStats(), this.fetchActivities()])
        } else {
          throw new Error(result.message || 'Erreur lors de l’ajout')
        }
      } catch (error) {
        this.cotisationMessage = error.message
        this.cotisationSuccess = false
      } finally {
        this.isLoading = false
      }
    },
    async submitAddCotisationFromMember() {
      await this.addCotisation(this.addFromMemberForm)
      if (this.cotisationSuccess) {
        setTimeout(() => {
          this.closeAddCotisationFromMemberModal()
        }, 1000) // Attendre 1 seconde pour que l'utilisateur voie le message de succès
      }
    },
    openAddCotisationModal() {
      this.addFromMemberForm = {
        idMembre: '',
        nomMembre: '',
        montant: '',
        datePaiement: new Date().toISOString().slice(0, 10),
        modePaiement: 'mobile money',
        statutPaiement: 'en attente',
        periode: new Date().toISOString().slice(0, 7),
      }
      this.cotisationMessage = '' // Réinitialiser le message
      this.cotisationSuccess = false // Réinitialiser le statut
      this.showAddFromMemberModal = true
    },
    closeAddCotisationFromMemberModal() {
      this.showAddFromMemberModal = false
      this.addFromMemberForm = {
        idMembre: '',
        nomMembre: '',
        montant: '',
        datePaiement: '',
        modePaiement: 'mobile money',
        statutPaiement: 'en attente',
        periode: '',
      }
      this.cotisationMessage = '' // Réinitialiser le message
      this.cotisationSuccess = false // Réinitialiser le statut
    },
    openEditModal(cotisation) {
      this.editForm = {
        idCotisation: cotisation.id_cotisation,
        idMembre: cotisation.id_membre,
        montant: cotisation.montant,
        datePaiement: cotisation.date_paiement,
        modePaiement: cotisation.mode_paiement || 'mobile money',
        statutPaiement: cotisation.statut_paiement,
        periode: cotisation.periode || '',
      }
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
      this.editForm = {
        idCotisation: null,
        idMembre: '',
        montant: '',
        datePaiement: '',
        modePaiement: 'mobile money',
        statutPaiement: 'payé',
        periode: '',
      }
    },
    async submitEditCotisation() {
      const newData = {
        id_cotisation: this.editForm.idCotisation,
        id_membre: parseInt(this.editForm.idMembre),
        montant: parseFloat(this.editForm.montant),
        date_paiement: this.editForm.datePaiement,
        mode_paiement: this.editForm.modePaiement,
        statut_paiement: this.editForm.statutPaiement,
        periode: this.editForm.periode || this.editForm.datePaiement.slice(0, 7),
      }
      let validationError = ''
      if (!newData.id_cotisation) validationError = 'ID de cotisation requis.'
      else if (!newData.id_membre) validationError = 'ID Membre requis.'
      else if (isNaN(newData.montant)) validationError = 'Montant doit être un nombre valide.'
      else if (!newData.date_paiement) validationError = 'Date de paiement requise.'
      else if (!newData.mode_paiement) validationError = 'Mode de paiement requis.'
      else if (!newData.statut_paiement) validationError = 'Statut de paiement requis.'
      else if (!newData.periode) validationError = 'Période requise.'

      if (validationError) {
        this.cotisationMessage = `Erreur de validation : ${validationError}`
        this.cotisationSuccess = false
        return
      }

      this.isLoading = true
      const token = localStorage.getItem('token')
      try {
        console.log('Données envoyées pour mise à jour:', newData)
        const response = await fetch('http://localhost:8000/router/membres/update-cotisation', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newData),
        })
        const result = await response.json()
        console.log('Réponse du serveur:', result)
        if (response.ok) {
          this.cotisationMessage = result.message || 'Cotisation mise à jour avec succès.'
          this.cotisationSuccess = true

          await this.addActivity({
            date: new Date().toISOString(),
            action: 'Modification de cotisation',
            details: `Membre ${this.getMembreName(newData.id_membre)} - ${newData.montant}€`,
            user_id: newData.id_membre,
          })

          await this.fetchCotisations()
          this.closeEditModal()
        } else {
          throw new Error(
            result.message || `Erreur lors de la modification (statut ${response.status})`,
          )
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error)
        this.cotisationMessage = error.message
        this.cotisationSuccess = false
      } finally {
        this.isLoading = false
      }
    },
    async deleteCotisation(idCotisation) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette cotisation ?')) {
        return
      }
      this.isLoading = true
      try {
        const token = localStorage.getItem('token')
        console.log('Token dans deleteCotisation:', token)

        const deletedCotisation = this.cotisations.find((c) => c.id_cotisation === idCotisation)
        console.log('Cotisation supprimée:', deletedCotisation)

        const response = await fetch('http://localhost:8000/router/membres/delete-cotisation', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ idCotisation }),
        })
        const result = await response.json()
        console.log('Réponse delete-cotisation:', response.status, result)
        if (response.ok) {
          this.cotisationMessage = result.message || 'Cotisation supprimée avec succès.'
          this.cotisationSuccess = true

          if (deletedCotisation) {
            const activity = {
              date: new Date().toISOString(),
              action: 'Suppression de cotisation',
              details: `Membre ${this.getMembreName(deletedCotisation.id_membre)} - ${deletedCotisation.montant}€`,
              user_id: deletedCotisation.id_membre,
            }
            console.log('Activité à ajouter:', activity)
            await this.addActivity(activity)
          }

          await this.fetchCotisations()
        } else {
          throw new Error(result.message || 'Erreur lors de la suppression')
        }
      } catch (error) {
        this.cotisationMessage = error.message
        this.cotisationSuccess = false
        console.error('Erreur dans deleteCotisation:', error)
      } finally {
        this.isLoading = false
      }
    },
    async deleteMembre(idMembre) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
        return
      }
      this.isLoading = true
      try {
        const token = localStorage.getItem('token')

        const deletedMembre = this.membres.find((m) => m.id_membre === idMembre)

        const response = await fetch('http://localhost:8000/router/membres/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ idMembre }),
        })
        const result = await response.json()
        if (response.ok) {
          if (deletedMembre) {
            await this.addActivity({
              date: new Date().toISOString(),
              action: 'Suppression de membre',
              details: `Membre ${this.getMembreName(idMembre)}`,
            })
          }
          await this.fetchMembres()
          await this.fetchCotisations()
        } else {
          throw new Error(result.message || 'Erreur lors de la suppression du membre')
        }
      } catch (error) {
        this.errorMembres = error.message
        console.error('Delete membre error:', error)
      } finally {
        this.isLoading = false
      }
    },
    getMembreName(idMembre) {
      const membre = this.membres.find((m) => m.id_membre === idMembre)
      return membre ? `${membre.nom} ${membre.prenom}` : 'Inconnu'
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed
    },
  },
}
</script>
