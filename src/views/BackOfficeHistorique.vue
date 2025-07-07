<template>
  <div class="historique-container">
    <!-- En-tête -->
    <header class="historique-header">
      <h1 class="historique-title">Historique des Activités</h1>
      <p class="historique-subtitle">Suivez toutes les actions effectuées</p>
    </header>

    <!-- Tableau de l'historique -->
    <div class="row g-4">
      <div class="col-12">
        <div class="historique-card full-width">
          <table class="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(activity, index) in activities" :key="index">
                <td>{{ formatDate(activity.date) }}</td>
                <td>{{ activity.action }}</td>
                <td>{{ activity.details }}</td>
              </tr>
              <tr v-if="activities.length === 0">
                <td colspan="3" class="no-data">Aucune activité enregistrée.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackOfficeHistorique',
  props: {
    activities: {
      type: Array,
      required: true,
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
}
</script>

<style scoped>
.historique-container {
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  min-height: 100vh;
}

.historique-header {
  text-align: center;
  margin-bottom: 40px;
}

.historique-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.historique-subtitle {
  font-size: 1rem;
  color: #003d82;
  font-weight: 400;
}

.historique-card {
  background: #fff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.history-table th,
.history-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.history-table th {
  background-color: #0056b3;
  color: white;
}

.history-table tr:hover {
  background-color: #f1f1f1;
}

.no-data {
  text-align: center;
  color: #666;
  padding: 20px;
}

.full-width {
  text-align: left;
}
</style>
