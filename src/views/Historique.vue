<template>
  <div class="historique">
    <div class="header-section">
      <h2>Historique des Activités</h2>
      <!-- Bouton pour exporter en PDF -->
      <button @click="exportToPDF" class="export-btn">
        Exporter en PDF <i class="bi bi-file-earmark-pdf"></i>
      </button>
    </div>

    <!-- Card contenant le tableau avec scroll interne -->
    <div class="activity-card">
      <div class="card-header">
        <h3>Liste des activités</h3>
      </div>
      <div class="card-body">
        <div class="table-scroll-container" v-if="activities.length > 0">
          <table class="activity-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Détails</th>
                <th>Utilisateur</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in activities" :key="activity.id_activity">
                <td>{{ formatDate(activity.date) }}</td>
                <td>{{ activity.action }}</td>
                <td>{{ activity.details || 'N/A' }}</td>
                <td>{{ getUserName(activity.user_id) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="no-activities">
          <i class="bi bi-inbox"></i>
          <p>Aucune activité trouvée.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'ActivityHistory',
  props: {
    activities: { type: Array, default: () => [] },
    membres: { type: Array, default: () => [] },
    formatDate: { type: Function, required: true },
  },
  mounted() {
    // Empêche le défilement de la page principale
    document.body.style.overflow = 'hidden'
    console.log('Activités reçues dans ActivityHistory:', this.activities)
    console.log('Membres reçues dans ActivityHistory:', this.membres)
  },
  beforeUnmount() {
    // Restaure le défilement de la page principale
    document.body.style.overflow = ''
  },
  methods: {
    getUserName(userId) {
      const membre = this.membres.find((m) => m.id_membre === userId)
      return membre ? `${membre.nom} ${membre.prenom}` : 'Inconnu'
    },
    exportToPDF() {
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.text('Historique des Activités', 14, 22)
      doc.setFontSize(11)
      doc.text(
        `Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
        14,
        30,
      )
      const tableData = this.activities.map((activity) => [
        this.formatDate(activity.date),
        activity.action,
        activity.details || 'N/A',
        this.getUserName(activity.user_id),
      ])
      doc.autoTable({
        startY: 40,
        head: [['Date', 'Action', 'Détails', 'Utilisateur']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [0, 61, 130], textColor: 'white' },
        styles: { fontSize: 10, cellPadding: 3 },
      })
      doc.save(`historique_activites_${new Date().toISOString().slice(0, 10)}.pdf`)
    },
  },
}
</script>

<style scoped>
.historique {
  position: fixed;
  top: 120px;
  left: 200px;
  right: 15px;
  bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 100; /* Augmenté pour passer au-dessus de la sidebar */
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-shrink: 0;
}

.header-section h2 {
  color: #003d82;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.activity-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  overflow: hidden;
  width: 100%;
}

.card-header {
  background: linear-gradient(135deg, #003d82 0%, #0056b3 100%);
  color: white;
  padding: 16px 20px;
  border-bottom: 1px solid #dee2e6;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-scroll-container {
  flex: 1;
  overflow-y: auto;
  width: 100%;
}

.table-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.table-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  color: #333;
  table-layout: fixed;
  overflow-wrap: break-word;
}

.activity-table th {
  position: sticky;
  top: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #003d82;
  font-weight: 600;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  z-index: 10;
}

.activity-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.activity-table tbody tr {
  transition: background-color 0.2s ease;
}

.activity-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.activity-table tbody tr:hover {
  background-color: #e3f2fd;
  transform: scale(1.001);
}

.no-activities {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #6c757d;
  padding: 40px 20px;
}

.no-activities i {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-activities p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .historique {
    top: 100px;
    left: 0px;
    right: 10px;
    padding: 10px;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .header-section h2 {
    font-size: 1.5rem;
  }

  .export-btn {
    font-size: 0.9rem;
    padding: 8px 16px;
  }

  .activity-table {
    font-size: 0.8rem;
  }

  .activity-table th,
  .activity-table td {
    padding: 10px;
  }

  .no-activities {
    padding: 30px 15px;
  }
}

@media (max-width: 480px) {
  .historique {
    top: 80px;
    left: 0px;
    right: 5px;
    padding: 8px;
  }

  .header-section h2 {
    font-size: 1.2rem;
  }

  .export-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  .activity-table th,
  .activity-table td {
    padding: 8px;
    font-size: 0.75rem;
  }

  .no-activities {
    padding: 20px 10px;
  }

  .no-activities i {
    font-size: 2rem;
  }

  .no-activities p {
    font-size: 0.9rem;
  }
}
</style>
