<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="ajouter-cotisation">
      <h2 class="title">
        <span>Ajouter cotisation</span>
      </h2>
      <form @submit.prevent="$emit('add-cotisation')" class="cotisation-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="membre" class="form-label">Membre</label>
            <select
              id="membre"
              :value="newCotisation.idMembre"
              @input="
                $emit('update:newCotisation', { ...newCotisation, idMembre: $event.target.value })
              "
              required
              class="form-control"
            >
              <option value="" disabled>Sélectionner</option>
              <option v-for="membre in membres" :value="membre.id_membre" :key="membre.id_membre">
                {{ membre.nom }} {{ membre.prenom }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="montant" class="form-label">Montant</label>
            <input
              id="montant"
              :value="newCotisation.montant"
              @input="
                $emit('update:newCotisation', {
                  ...newCotisation,
                  montant: Number($event.target.value),
                })
              "
              type="number"
              step="0.01"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="datePaiement" class="form-label">Date</label>
            <input
              id="datePaiement"
              :value="newCotisation.datePaiement"
              @input="
                $emit('update:newCotisation', {
                  ...newCotisation,
                  datePaiement: $event.target.value,
                })
              "
              type="date"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="modePaiement" class="form-label">Mode de paiement</label>
            <select
              id="modePaiement"
              :value="newCotisation.modePaiement"
              @input="
                $emit('update:newCotisation', {
                  ...newCotisation,
                  modePaiement: $event.target.value,
                })
              "
              class="form-control"
            >
              <option value="mobile money">Mobile Money</option>
              <option value="carte bancaire">Carte Bancaire</option>
              <option value="espèces">Espèces</option>
            </select>
          </div>
          <div class="form-group">
            <label for="statut" class="form-label">Statut</label>
            <select
              id="statut"
              :value="newCotisation.statutPaiement"
              @input="
                $emit('update:newCotisation', {
                  ...newCotisation,
                  statutPaiement: $event.target.value,
                })
              "
              required
              class="form-control"
            >
              <option value="en attente">En attente</option>
              <option value="payé">Payé</option>
              <option value="échoué">Échoué</option>
            </select>
          </div>
          <div class="form-group">
            <label for="periode" class="form-label">Période</label>
            <input
              id="periode"
              :value="newCotisation.periode"
              @input="
                $emit('update:newCotisation', { ...newCotisation, periode: $event.target.value })
              "
              type="month"
              required
              class="form-control"
            />
          </div>
        </div>
        <button type="submit" class="btn-submit">
          <span>Ajouter</span>
        </button>
      </form>
      <p
        v-if="cotisationMessage"
        :class="{ 'text-success': cotisationSuccess, 'text-danger': !cotisationSuccess }"
        class="message"
      >
        {{ cotisationMessage }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AjouterCotisation',
  props: {
    membres: Array,
    newCotisation: Object,
    cotisationMessage: String,
    cotisationSuccess: Boolean,
  },
  emits: ['update:newCotisation', 'add-cotisation', 'close'],
}
</script>

<style scoped>
/* Conteneur modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000; /* Supérieur au header */
}

/* Conteneur principal */
.ajouter-cotisation {
  padding: 25px;
  max-width: 500px;
  margin: 0 auto; /* Supprime margin pour centrer dans la modal */
  background: #f8fafc;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(29, 78, 216, 0.3);
  position: relative;
  font-family: 'Orbitron', sans-serif;
  overflow: hidden;
  z-index: 1; /* Assure que le contenu est au-dessus du fond animé */
}

/* Fond animé */
.ajouter-cotisation::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #f1f5f9, #e2e8f0, #f1f5f9);
  background-size: 200%;
  opacity: 0.3;
  animation: gradientShift 15s ease infinite;
}

/* Titre */
.title {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.title span {
  color: #003d82;
  font-size: 1.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow:
    0 0 10px #1d4ed8,
    0 0 20px #1d4ed8,
    0 0 30px #1d4ed8;
  animation: neonFlicker 3s infinite alternate;
}

/* Formulaire */
.cotisation-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

/* Grille pour deux colonnes */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  position: relative;
  z-index: 1;
}

/* Groupe de formulaire */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Labels */
.form-label {
  font-size: 0.9rem;
  color: #1e40af;
  font-weight: 500;
  text-transform: capitalize;
  letter-spacing: 1px;
  text-shadow: 0 0 5px #60a5fa;
}

/* Champs de formulaire */
.form-control {
  padding: 10px 12px;
  width: 100%;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: rgba(255, 255, 255, 0.8);
  color: #1e293b;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #db2777;
  box-shadow: 0 0 15px rgba(219, 39, 119, 0.5);
  background-color: rgba(255, 255, 255, 1);
}

/* Style spécifique pour les champs de type date et mois */
input[type='date'],
input[type='month'],
select {
  color: #1e293b;
}

input[type='date']::-webkit-calendar-picker-indicator,
input[type='month']::-webkit-calendar-picker-indicator {
  filter: invert(30%) sepia(50%) saturate(500%) hue-rotate(200deg);
}

/* Bouton */
.btn-submit {
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  align-self: center;
  position: relative;
  transition: all 0.3s ease;
}

.btn-submit span {
  display: inline-block;
  padding: 10px 30px;
  background: linear-gradient(90deg, #1d4ed8, #db2777);
  color: #fff;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.btn-submit:hover span {
  background: linear-gradient(90deg, #2563eb, #ec4899);
  box-shadow: 0 0 20px rgba(219, 39, 119, 0.7);
  transform: scale(1.05);
}

/* Effet de scan sur le bouton */
.btn-submit::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: scan 2s infinite;
}

/* Message de retour */
.message {
  margin-top: 20px;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  text-shadow: 0 0 5px #60a5fa;
  animation: fadeIn 0.5s ease-in;
}

.text-danger {
  color: #dc2626;
  text-shadow: 0 0 5px #f87171;
}

.text-success {
  color: #15803d;
  text-shadow: 0 0 5px #34d399;
}

/* Animations */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes neonFlicker {
  0% {
    text-shadow:
      0 0 10px #1d4ed8,
      0 0 20px #1d4ed8,
      0 0 30px #1d4ed8;
  }
  50% {
    text-shadow:
      0 0 5px #1d4ed8,
      0 0 10px #1d4ed8,
      0 0 20px #1d4ed8;
  }
  100% {
    text-shadow:
      0 0 10px #1d4ed8,
      0 0 20px #1d4ed8,
      0 0 30px #1d4ed8;
  }
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 600px) {
  .ajouter-cotisation {
    padding: 20px;
    margin: 0;
  }

  .title span {
    font-size: 1.8rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-control {
    font-size: 0.9rem;
    padding: 8px;
  }

  .btn-submit span {
    font-size: 0.95rem;
    padding: 8px 25px;
  }
}
</style>
