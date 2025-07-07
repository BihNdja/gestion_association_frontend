<template>
  <div class="member-container">
    <div class="header-section">
      <h2>Membres</h2>
      <p>Nombre total de membres : {{ membres.length }}</p>
    </div>

    <div class="main-section">
      <div class="table-card">
        <div v-if="errorMembres" class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ errorMembres }}</span>
        </div>
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Rôle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="membre in membres" :key="membre.id_membre">
                <td>{{ membre.id_membre }}</td>
                <td>{{ membre.nom }}</td>
                <td>{{ membre.prenom }}</td>
                <td>{{ membre.email }}</td>
                <td>{{ membre.role }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="membres.length === 0" class="empty-state">
            <i class="fas fa-users"></i>
            <h3>Aucun membre trouvé</h3>
            <p>Commencez par ajouter des membres à votre organisation.</p>
          </div>
        </div>
        <div class="table-footer">
          <span>{{ membres.length }} membre(s) au total</span>
          <span v-if="membres.length > 10" class="scroll-hint">
            <i class="fas fa-arrows-alt-v"></i> Défilez pour voir plus
          </span>
        </div>
      </div>

      <div class="actions-card">
        <div class="member-actions">
          <button @click="openAddCotisationModal" class="btn btn-primary add-cotisation-btn">
            <i class="fas fa-plus"></i> Cotisation
          </button>
          <div class="export-container">
            <button @click="toggleExportMenu" class="btn btn-secondary">
              <i class="fas fa-download"></i>
            </button>
            <div v-if="showExportMenu" class="export-menu">
              <button @click="selectExport('csv')">CSV</button>
              <button @click="selectExport('excel')">Excel</button>
              <button @click="selectExport('pdf')">PDF</button>
            </div>
          </div>
          <div class="import-container">
            <label for="importFile" class="btn btn-secondary">
              <i class="fas fa-upload"></i> Import
            </label>
            <input
              id="importFile"
              type="file"
              accept=".csv,.xlsx"
              @change="handleFileUpload"
              style="display: none"
            />
          </div>
        </div>
        <div
          v-if="importMessage"
          :class="{ success: importSuccess, error: !importSuccess }"
          class="form-message"
        >
          {{ importMessage }}
        </div>
      </div>
    </div>

    <!-- Modal pour ajouter une cotisation -->
    <div v-if="showAddCotisationModal" class="modal-overlay" @click.self="closeAddCotisationModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Ajouter une cotisation</h3>
          <button class="close-btn" @click="closeAddCotisationModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="submitCotisation" class="modal-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="membre" class="form-label"> <i class="fas fa-user"></i> Membre </label>
              <select
                id="membre"
                v-model="newCotisation.idMembre"
                class="form-control"
                required
                aria-label="Sélectionnez un membre"
              >
                <option value="" disabled>Sélectionnez un membre</option>
                <option v-for="membre in membres" :value="membre.id_membre" :key="membre.id_membre">
                  {{ membre.nom }} {{ membre.prenom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="montant" class="form-label">
                <i class="fas fa-euro-sign"></i> Montant (€)
              </label>
              <input
                id="montant"
                v-model.number="newCotisation.montant"
                type="number"
                step="0.01"
                min="0"
                class="form-control"
                placeholder="Ex: 50.00"
                required
                aria-label="Montant de la cotisation"
              />
            </div>
            <div class="form-group">
              <label for="datePaiement" class="form-label">
                <i class="fas fa-calendar-alt"></i> Date de paiement
              </label>
              <input
                id="datePaiement"
                v-model="newCotisation.datePaiement"
                type="date"
                class="form-control"
                required
                aria-label="Date de paiement"
              />
            </div>
            <div class="form-group">
              <label for="modePaiement" class="form-label">
                <i class="fas fa-credit-card"></i> Mode de paiement
              </label>
              <select
                id="modePaiement"
                v-model="newCotisation.modePaiement"
                class="form-control"
                required
                aria-label="Mode de paiement"
              >
                <option value="" disabled>Sélectionnez</option>
                <option value="mobile money">Mobile Money</option>
                <option value="carte bancaire">Carte bancaire</option>
                <option value="espèces">Espèces</option>
              </select>
            </div>
            <div class="form-group">
              <label for="statutPaiement" class="form-label">
                <i class="fas fa-info-circle"></i> Statut
              </label>
              <select
                id="statutPaiement"
                v-model="newCotisation.statutPaiement"
                class="form-control"
                required
                aria-label="Statut du paiement"
              >
                <option value="" disabled>Sélectionnez</option>
                <option value="en attente">En attente</option>
                <option value="payé">Payé</option>
                <option value="échoué">Échoué</option>
              </select>
            </div>
            <div class="form-group">
              <label for="periode" class="form-label">
                <i class="fas fa-calendar"></i> Période
              </label>
              <input
                id="periode"
                v-model="newCotisation.periode"
                type="month"
                class="form-control"
                required
                aria-label="Période de cotisation"
              />
            </div>
          </div>
          <div
            v-if="cotisationMessage"
            :class="{ 'success-message': cotisationSuccess, 'error-message': !cotisationSuccess }"
            class="form-message"
          >
            {{ cotisationMessage }}
          </div>
        </form>
        <div class="modal-footer">
          <button
            type="button"
            @click="closeAddCotisationModal"
            class="btn btn-secondary modal-btn"
          >
            <i class="fas fa-times"></i> Annuler
          </button>
          <button
            type="submit"
            @click="submitCotisation"
            class="btn btn-primary modal-btn"
            :disabled="isSubmitting"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
            {{ isSubmitting ? 'Ajout...' : 'Ajouter' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

export default {
  name: 'MemberList',
  props: {
    membres: {
      type: Array,
      required: true,
    },
    errorMembres: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showExportMenu: false,
      importMessage: '',
      importSuccess: false,
      showAddCotisationModal: false,
      newCotisation: {
        idMembre: '',
        montant: null,
        datePaiement: '',
        modePaiement: '',
        statutPaiement: '',
        periode: '',
      },
      cotisationMessage: '',
      cotisationSuccess: false,
      isSubmitting: false,
    }
  },
  methods: {
    toggleExportMenu() {
      this.showExportMenu = !this.showExportMenu
    },
    selectExport(format) {
      this.showExportMenu = false
      if (format === 'csv') this.downloadCSV()
      else if (format === 'excel') this.downloadExcel()
      else if (format === 'pdf') this.downloadPDF()
    },
    downloadCSV() {
      const headers = ['ID,Nom,Prénom,Email,Rôle']
      const rows = this.membres.map((membre) => {
        return `${membre.id_membre},${membre.nom},${membre.prenom},${membre.email},${membre.role}`
      })
      const csvContent = headers.join('\n') + '\n' + rows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'membres.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    downloadExcel() {
      const data = this.membres.map((membre) => ({
        ID: membre.id_membre,
        Nom: membre.nom,
        Prénom: membre.prenom,
        Email: membre.email,
        Rôle: membre.role,
      }))
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Membres')
      XLSX.writeFile(workbook, 'membres.xlsx')
    },
    downloadPDF() {
      try {
        const doc = new jsPDF()
        const bodyData = this.membres.map((membre) => [
          membre.id_membre,
          membre.nom || 'N/A',
          membre.prenom || 'N/A',
          membre.email || 'N/A',
          membre.role || 'N/A',
        ])
        doc.autoTable({
          head: [['ID', 'Nom', 'Prénom', 'Email', 'Rôle']],
          body: bodyData,
        })
        doc.save('membres.pdf')
      } catch (error) {
        console.error('Erreur lors de la génération du PDF :', error)
        alert(
          'Une erreur est survenue lors de la génération du PDF. Vérifiez la console pour plus de détails.',
        )
      }
    },
    async handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.importMessage = 'Traitement du fichier...'
      this.importSuccess = false

      try {
        let data
        if (file.name.endsWith('.csv')) {
          const text = await file.text()
          data = await this.parseCSV(text)
        } else if (file.name.endsWith('.xlsx')) {
          const arrayBuffer = await file.arrayBuffer()
          const workbook = XLSX.read(arrayBuffer, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
        } else {
          throw new Error('Format de fichier non pris en charge. Utilisez .csv ou .xlsx.')
        }

        const membersToImport = data.map((row) => ({
          id_membre: row.ID || row.id_membre,
          nom: row.Nom || row.nom,
          prenom: row.Prénom || row.prenom,
          email: row.Email || row.email,
          role: row.Rôle || row.role,
        }))
        await this.importMembers(membersToImport)
      } catch (error) {
        this.importMessage = `Erreur lors de l'importation : ${error.message}`
        this.importSuccess = false
      }

      event.target.value = ''
    },
    parseCSV(text) {
      const rows = text.split('\n').filter((row) => row.trim())
      const headers = rows[0].split(',').map((header) => header.trim())
      const data = rows.slice(1).map((row) => {
        const values = row.split(',').map((value) => value.trim())
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || ''
          return obj
        }, {})
      })
      return data
    },
    async importMembers(members) {
      const token = localStorage.getItem('token')
      if (!token) {
        this.importMessage = 'Utilisateur non connecté. Veuillez vous connecter.'
        this.importSuccess = false
        return
      }

      try {
        const response = await fetch('http://localhost:8000/router/membres/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(members),
        })

        const result = await response.json()
        if (response.ok) {
          const importedCount = result.membres?.length || 0
          const skippedCount = result.skipped?.length || 0
          this.importMessage = `Importation terminée : ${importedCount} membres importés/mis à jour${skippedCount > 0 ? `, ${skippedCount} ignorés` : ''}.`
          this.importSuccess = true
          this.$emit('update:membres', result.membres)
        } else {
          throw new Error(result.message || "Erreur lors de l'importation")
        }
      } catch (error) {
        this.importMessage = `Erreur : ${error.message}`
        this.importSuccess = false
      }
    },
    openAddCotisationModal() {
      this.showAddCotisationModal = true
      this.newCotisation = {
        idMembre: '',
        montant: null,
        datePaiement: '',
        modePaiement: '',
        statutPaiement: '',
        periode: '',
      }
      this.cotisationMessage = ''
      this.cotisationSuccess = false
    },
    closeAddCotisationModal() {
      this.showAddCotisationModal = false
      this.newCotisation = {
        idMembre: '',
        montant: null,
        datePaiement: '',
        modePaiement: '',
        statutPaiement: '',
        periode: '',
      }
      this.cotisationMessage = ''
      this.cotisationSuccess = false
    },
    async submitCotisation() {
      if (!this.newCotisation.idMembre) {
        this.cotisationMessage = 'Veuillez sélectionner un membre.'
        this.cotisationSuccess = false
        return
      }
      if (!this.newCotisation.montant || this.newCotisation.montant <= 0) {
        this.cotisationMessage = 'Veuillez entrer un montant valide.'
        this.cotisationSuccess = false
        return
      }
      if (!this.newCotisation.datePaiement) {
        this.cotisationMessage = 'Veuillez sélectionner une date de paiement.'
        this.cotisationSuccess = false
        return
      }
      if (!this.newCotisation.modePaiement) {
        this.cotisationMessage = 'Veuillez sélectionner un mode de paiement.'
        this.cotisationSuccess = false
        return
      }
      if (!this.newCotisation.statutPaiement) {
        this.cotisationMessage = 'Veuillez sélectionner un statut.'
        this.cotisationSuccess = false
        return
      }
      if (!this.newCotisation.periode) {
        this.cotisationMessage = 'Veuillez sélectionner une période.'
        this.cotisationSuccess = false
        return
      }

      this.isSubmitting = true
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Utilisateur non connecté.')
        }

        const cotisationData = {
          idMembre: this.newCotisation.idMembre,
          montant: this.newCotisation.montant,
          datePaiement: this.newCotisation.datePaiement,
          modePaiement: this.newCotisation.modePaiement,
          statutPaiement: this.newCotisation.statutPaiement,
          periode: this.newCotisation.periode,
        }

        console.log("Envoi des données à l'API:", cotisationData)

        const response = await fetch('http://localhost:8000/router/membres/add-cotisation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cotisationData),
        })

        console.log("Réponse de l'API:", {
          status: response.status,
          statusText: response.statusText,
        })

        const result = await response.json()
        console.log('Contenu de la réponse:', result)

        if (response.ok) {
          this.cotisationMessage = 'Cotisation ajoutée avec succès.'
          this.cotisationSuccess = true
          this.$emit('cotisationAdded')
          setTimeout(() => this.closeAddCotisationModal(), 2000)
        } else {
          throw new Error(result.message || `Erreur ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de la cotisation:", error)
        this.cotisationMessage = `Erreur : ${error.message}`
        this.cotisationSuccess = false
      } finally {
        this.isSubmitting = false
      }
    },
  },
}
</script>

<style scoped>
/* Conteneur principal */
.member-container {
  position: fixed;
  top: 120px;
  left: 250px;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 10px;
  overflow-y: hidden;
  z-index: 1;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

/* Section header */
.header-section {
  text-align: left;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.header-section h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 5px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-section p {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
}

/* Section principale */
.main-section {
  display: flex;
  flex: 1;
  gap: 10px;
  min-height: 0;
}

/* Card pour le tableau */
.table-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Card pour les actions */
.actions-card {
  background: white;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.member-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  position: relative;
  z-index: 10;
  width: 100%;
}

/* Container du tableau avec scroll interne */
.table-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
  min-height: 0;
}

/* Styles du tableau */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  background-color: white;
  font-size: 0.9rem;
}

thead {
  position: sticky;
  top: 0;
  z-index: 5;
}

th {
  padding: 15px 12px;
  background: linear-gradient(135deg, #343a40 0%, #495057 100%);
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  text-align: left;
  border-bottom: 3px solid #6c757d;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f1f3f4;
  background-color: white;
  font-size: 0.85rem;
  color: #495057;
  transition: all 0.2s ease;
}

tbody tr {
  transition: all 0.3s ease;
}

tbody tr:hover {
  background: linear-gradient(135deg, #e8f4f8 0%, #f0f8ff 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

tbody tr:nth-child(even):hover {
  background: linear-gradient(135deg, #e8f4f8 0%, #f0f8ff 100%);
}

/* Footer du tableau */
.table-footer {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-top: 2px solid #dee2e6;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  min-height: 35px;
  flex-shrink: 0;
}

.scroll-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #17a2b8;
  font-size: 0.75rem;
}

/* États d'erreur et vide */
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 25px;
  color: #dc3545;
  font-size: 0.95rem;
  font-weight: 500;
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border-radius: 8px;
  margin: 15px;
}

.error-state i {
  font-size: 1.2rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 25px;
  color: #6c757d;
  text-align: center;
  min-height: 200px;
}

.empty-state i {
  font-size: 2.5rem;
  color: #dee2e6;
  margin-bottom: 12px;
}

.empty-state h3 {
  font-size: 1.2rem;
  color: #495057;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.empty-state p {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
}

/* Styles des boutons */
.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  width: 100%;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.add-cotisation-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: 2px solid transparent;
}

.add-cotisation-btn:hover {
  background: linear-gradient(135deg, #218838, #1abc9c);
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d, #5a6268);
  color: white;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #5a6268, #495057);
  box-shadow: 0 4px 10px rgba(108, 117, 125, 0.3);
}

/* Menu d'exportation */
.export-container {
  position: relative;
  width: 100%;
}

.export-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  min-width: 100px;
  overflow: hidden;
  margin-top: 4px;
  backdrop-filter: blur(10px);
}

.export-menu button {
  padding: 6px 10px;
  background-color: white;
  color: #495057;
  border: none;
  text-align: left;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: auto;
  justify-content: flex-start;
  box-shadow: none;
}

.export-menu button:hover {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  transform: none;
  box-shadow: none;
}

/* Import container */
.import-container .btn {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
}

.import-container .btn:hover {
  background: linear-gradient(135deg, #138496, #117a8b);
  box-shadow: 0 4px 10px rgba(23, 162, 184, 0.3);
}

/* Messages */
.form-message {
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 8px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
  position: relative;
  z-index: 5;
  max-width: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.success {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border: 2px solid #28a745;
  color: #155724;
}

.error {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  border: 2px solid #dc3545;
  color: #721c24;
}

/* Styles du modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 3000;
  overflow-y: auto;
  padding-top: 120px; /* Décalage pour éviter le header */
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px; /* Réduit pour compacter */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 15px 0;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #343a40 0%, #495057 100%);
  color: white;
  border-bottom: 2px solid #6c757d;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem; /* Réduit */
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1rem; /* Réduit */
  cursor: pointer;
  padding: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #dc3545;
  transform: rotate(90deg);
}

.modal-form {
  padding: 12px 16px; /* Réduit */
  display: flex;
  flex-direction: column;
  gap: 12px; /* Réduit */
  max-height: 50vh; /* Réduit pour défilement */
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px; /* Réduit */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px; /* Réduit */
}

.form-label {
  font-size: 0.8rem; /* Réduit */
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-label i {
  color: #6c757d;
  font-size: 0.9rem; /* Réduit */
}

.form-control {
  padding: 8px 10px; /* Réduit */
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.8rem; /* Réduit */
  color: #495057;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 6px rgba(40, 167, 69, 0.3);
  background: white;
}

.form-control::placeholder {
  color: #6c757d;
  font-style: italic;
}

.form-control:invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 6px rgba(220, 53, 69, 0.2);
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236c757d'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px; /* Réduit */
}

input[type='date']::-webkit-calendar-picker-indicator,
input[type='month']::-webkit-calendar-picker-indicator {
  filter: invert(40%) sepia(20%) saturate(500%) hue-rotate(180deg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px; /* Réduit */
  padding: 12px 16px; /* Réduit */
  border-top: 1px solid #dee2e6;
  background: #f8f9fa;
}

.modal-btn {
  padding: 6px 12px; /* Réduit */
  font-size: 0.75rem; /* Réduit */
  max-width: 100px; /* Réduit la largeur */
  width: auto;
}

.form-message {
  padding: 8px 10px; /* Réduit */
  border-radius: 4px;
  font-size: 0.75rem; /* Réduit */
  font-weight: 500;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.success-message {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border: 1px solid #28a745;
  color: #155724;
}

.error-message {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  border: 1px solid #dc3545;
  color: #721c24;
}

/* Responsive design */
@media (max-width: 768px) {
  .member-container {
    top: 100px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    padding: 8px;
  }

  .main-section {
    flex-direction: column;
    gap: 8px;
  }

  .actions-card {
    max-width: none;
    padding: 8px;
  }

  .member-actions {
    flex-direction: row;
    justify-content: center;
    gap: 8px;
  }

  .btn {
    padding: 8px 10px;
    font-size: 0.75rem;
    width: auto;
  }

  th,
  td {
    padding: 10px 6px;
    font-size: 0.8rem;
  }

  .table-footer {
    padding: 6px 10px;
    font-size: 0.75rem;
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }

  .scroll-hint {
    justify-content: center;
  }

  .modal-overlay {
    padding-top: 100px; /* Réduit pour mobile */
  }

  .modal-content {
    max-width: 90%;
  }

  .form-grid {
    grid-template-columns: 1fr; /* Une colonne sur mobile */
  }

  .modal-btn {
    max-width: 80px; /* Encore plus compact */
  }
}

@media (max-width: 480px) {
  .member-container {
    padding: 6px;
    top: 80px;
    height: calc(100vh - 80px);
  }

  .header-section h2 {
    font-size: 1.2rem;
  }

  .actions-card {
    padding: 6px;
  }

  .member-actions {
    flex-direction: column;
    align-items: stretch;
  }

  th,
  td {
    padding: 8px 4px;
    font-size: 0.75rem;
  }

  .empty-state {
    padding: 20px 12px;
    min-height: 150px;
  }

  .modal-overlay {
    padding-top: 80px; /* Réduit pour petit écran */
  }

  .modal-header {
    padding: 10px 12px;
  }

  .modal-form {
    padding: 10px 12px;
    max-height: 45vh; /* Plus compact */
  }

  .modal-footer {
    padding: 10px 12px;
    flex-direction: column;
    gap: 6px;
  }

  .modal-btn {
    max-width: 100%;
    padding: 6px 10px;
  }
}

/* Adaptations pour différentes tailles de sidebar */
@media (min-width: 769px) and (max-width: 1024px) {
  .member-container {
    left: 200px;
    right: 15px;
    bottom: 10px;
  }
}

@media (min-width: 1025px) {
  .member-container {
    left: 200px;
    right: 15px;
    bottom: 20px;
  }
}
</style>
