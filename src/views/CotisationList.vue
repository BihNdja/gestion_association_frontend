<template>
  <div class="cotisations">
    <!-- En-tête de la page avec recherche intégrée -->
    <div class="page-header">
      <div class="header-left">
        <h2>Cotisations</h2>
        <p>Nombre total de cotisations : {{ cotisations.length }}</p>
      </div>
      <div class="header-right">
        <div class="search-container">
          <label for="search">Rechercher :</label>
          <input
            id="search"
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            type="text"
            placeholder="Rechercher par membre, montant, date ou statut..."
          />
        </div>
      </div>
    </div>

    <div v-if="errorCotisations" class="text-danger">{{ errorCotisations }}</div>
    <div v-else>
      <!-- Card du tableau -->
      <div class="table-card">
        <div class="card-header">
          <h3>Liste des cotisations</h3>
        </div>
        <div class="card-body">
          <div class="table-scroll-container">
            <table class="cotisation-table">
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Membre</th>
                  <th>Montant</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(cotisation, index) in filteredCotisations"
                  :key="cotisation.id_cotisation"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ safeGetMembreName(cotisation.id_membre) }}</td>
                  <td>{{ cotisation.montant }} €</td>
                  <td>{{ safeFormatDate(cotisation.date_paiement) }}</td>
                  <td>{{ cotisation.statut_paiement }}</td>
                  <td>
                    <button class="edit-btn" @click="$emit('edit-cotisation', cotisation)">
                      Modifier
                    </button>
                    <button
                      class="delete-btn"
                      @click="$emit('delete-cotisation', cotisation.id_cotisation)"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CotisationList',
  props: {
    cotisations: {
      type: Array,
      default: () => [],
    },
    errorCotisations: {
      type: String,
      default: '',
    },
    searchQuery: {
      type: String,
      default: '',
    },
    filteredCotisations: {
      type: Array,
      default: () => [],
    },
    getMembreName: {
      type: Function,
      required: true,
    },
    formatDate: {
      type: Function,
      required: true,
    },
  },
  emits: ['update:searchQuery', 'edit-cotisation', 'delete-cotisation'],
  mounted() {
    this.$nextTick(() => {
      this.updateTableHeight()
      window.addEventListener('resize', this.updateTableHeight)
    })
    console.log('CotisationList props received:', {
      cotisations: this.cotisations,
      errorCotisations: this.errorCotisations,
      searchQuery: this.searchQuery,
      filteredCotisations: this.filteredCotisations,
      getMembreName: this.getMembreName,
      formatDate: this.formatDate,
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateTableHeight)
  },
  methods: {
    updateTableHeight() {
      this.$nextTick(() => {
        const tableContainer = this.$el.querySelector('.table-scroll-container')
        const tableCard = this.$el.querySelector('.table-card')
        if (!tableContainer || !tableCard) return

        const pageHeader = this.$el.querySelector('.page-header')
        const tableHeader = this.$el.querySelector('.table-card .card-header')
        const errorMessage = this.$el.querySelector('.text-danger')
        const margins = 20 // Marges réduites pour optimiser l'espace

        const totalOffset =
          (pageHeader ? pageHeader.offsetHeight : 0) +
          (tableHeader ? tableHeader.offsetHeight : 0) +
          (errorMessage ? errorMessage.offsetHeight : 0) +
          margins

        // Calculer la hauteur disponible pour la carte
        const availableHeight = window.innerHeight * 0.8 - totalOffset // Limiter à 80% de la hauteur de la fenêtre
        tableCard.style.maxHeight = `${availableHeight + tableHeader.offsetHeight}px`
        tableContainer.style.maxHeight = `${availableHeight}px`
      })
    },
    safeGetMembreName(idMembre) {
      try {
        if (typeof this.getMembreName !== 'function') {
          console.error('getMembreName is not a function:', this.getMembreName)
          return 'Inconnu'
        }
        const result = this.getMembreName(idMembre)
        return result || 'Inconnu'
      } catch (error) {
        console.error('Error in safeGetMembreName:', error)
        return 'Inconnu'
      }
    },
    safeFormatDate(dateString) {
      try {
        if (typeof this.formatDate !== 'function') {
          console.error('formatDate is not a function:', this.formatDate)
          return 'N/A'
        }
        const result = this.formatDate(dateString)
        return result || 'N/A'
      } catch (error) {
        console.error('Error in safeFormatDate:', error)
        return 'N/A'
      }
    },
  },
}
</script>

<style scoped>
/* Alternative si vous connaissez les valeurs exactes */
.cotisations-alt {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 65px); /* 60px = hauteur du header */
  max-height: calc(100vh - 65px);
  overflow: hidden;
  padding: 10px;
  gap: 10px;
  position: fixed;
  top: 65px; /* Hauteur exacte de votre header */
  left: 250px; /* Largeur exacte de votre sidebar */
  right: 0;
  bottom: 0;
  z-index: 100;
  background: #f5f5f5;
}

.page-header {
  background: #fff;
  padding: 2px; /* Réduire le padding */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.header-left h2 {
  margin: 0 0 5px 0;
  color: #003d82;
  font-size: 1.3rem; /* Réduire légèrement la taille */
  font-weight: 600;
}

.header-left p {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.header-right {
  flex-shrink: 0;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-container label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.search-container input {
  width: 280px; /* Réduire la largeur pour compacter */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.7rem;
  transition: border-color 0.3s ease;
}

.search-container input:focus {
  outline: none;
  border-color: #003d82;
  box-shadow: 0 0 0 3px rgba(0, 61, 130, 0.1);
}

.text-danger {
  color: red;
  background: #fff;
  padding: 10px; /* Réduire le padding */
  border-radius: 8px;
  border: 1px solid #ffcdd2;
  background-color: #ffebee;
  flex-shrink: 0;
}

/* Card du tableau */
.table-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #e9ecef;
  overflow: hidden;
  flex: 1;
}

.table-card .card-header {
  background: linear-gradient(135deg, #003d82 0%, #0056b3 100%);
  color: #fff;
  padding: 4px 8px; /* Réduire le padding */
  border-bottom: 2px solid #dee2e6;
  flex-shrink: 0;
}

.table-card .card-header h3 {
  margin: 0;
  font-size: 1.1rem; /* Réduire la taille */
  font-weight: 600;
}

.table-card .card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

.table-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #dee2e6;
  border-top: none;
}

/* Personnalisation de la scrollbar */
.table-scroll-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-scroll-container::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 5px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
  background: #6c757d;
  border-radius: 5px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #495057;
}

.cotisation-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.85rem; /* Réduire légèrement la taille de la police */
  color: #333;
  min-width: 600px;
}

.cotisation-table th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  color: #003d82;
  font-weight: 600;
  padding: 6px; /* Réduire le padding */
  text-align: left;
  border-bottom: 2px solid #003d82;
  border-right: 1px solid #dee2e6;
  z-index: 10;
}

.cotisation-table th:last-child {
  border-right: none;
}

.cotisation-table td {
  padding: 6px 10px; /* Réduire le padding */
  text-align: left;
  border-bottom: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
  vertical-align: middle;
}

.cotisation-table td:last-child {
  border-right: none;
}

.cotisation-table tbody tr {
  transition: background-color 0.2s ease;
}

.cotisation-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.cotisation-table tbody tr:hover {
  background-color: #e3f2fd;
}

.edit-btn {
  background-color: #007bff;
  color: white;
  padding: 5px 10px; /* Réduire le padding */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 6px;
  font-size: 0.8rem; /* Réduire la taille */
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  padding: 5px 10px; /* Réduire le padding */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem; /* Réduire la taille */
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background-color: #b02a37;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .cotisations {
    padding: 10px;
    gap: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 10px;
  }

  .header-left h2 {
    font-size: 1.4rem;
  }

  .search-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container input {
    width: 100%;
  }

  .cotisation-table {
    font-size: 0.75rem;
    min-width: 100%;
  }

  .cotisation-table th,
  .cotisation-table td {
    padding: 8px;
  }

  .edit-btn,
  .delete-btn {
    padding: 4px 8px;
    font-size: 0.7rem;
    margin-right: 4px;
  }
}
</style>
