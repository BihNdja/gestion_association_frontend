<template>
  <div>
    <!-- Le header fixe a été déplacé vers AppLayout.vue -->

    <!-- Contenu scrollable -->
    <div class="dashboard-container">
      <div class="scrollable-content">
        <!-- Cards principales -->
        <div class="cards-row">
          <!-- Carte 1 : Statistiques des membres -->
          <div class="dashboard-card">
            <div class="card-icon">
              <i class="bi bi-people-fill"></i>
            </div>
            <h3 class="card-title">Membres</h3>
            <p class="card-value">{{ totalMemberCount }}</p>
            <p class="card-description">Total des membres inscrits</p>
            <router-link to="/backoffice/membres" class="card-link">
              Voir les membres <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>

          <!-- Carte 2 : Cotisations -->
          <div class="dashboard-card cotisation-card">
            <div class="card-icon">
              <i class="bi bi-wallet2"></i>
            </div>
            <h3 class="card-title">Cotisations</h3>
            <p class="card-value">{{ monthlyCotisations[new Date().getMonth()] }} €</p>
            <p class="card-description">Total des cotisations ce mois</p>
          </div>
        </div>

        <!-- Graphiques des cotisations -->
        <div class="charts-row">
          <!-- Diagramme circulaire des cotisations -->
          <div class="dashboard-card chart-card">
            <h3 class="card-title">
              <i class="bi bi-pie-chart-fill"></i>
              Répartition des cotisations par mois
            </h3>
            <p class="card-description">Distribution des cotisations mensuelles en 2025</p>
            <div v-if="pieChartData.data.length === 0" class="chart-stats">
              <p>Aucune donnée de cotisation disponible pour 2025.</p>
            </div>
            <div v-else class="chart-container">
              <canvas id="cotisationsPieChart" class="chart-canvas"></canvas>
            </div>
            <!-- <div v-if="pieChartData.data.length > 0" class="chart-stats">
              <p><strong>Total annuel :</strong> {{ annualTotal }} €</p>
              <p>
                <strong>Mois le plus élevé :</strong> {{ maxMonth.name }} ({{ maxMonth.value }} €)
              </p>
              <p><strong>Variation annuelle :</strong> {{ yearOverYearChange }}%</p>
            </div>-->
          </div>

          <!-- Graphique en courbe des cotisations -->
          <div class="dashboard-card chart-card">
            <h3 class="card-title">
              <i class="bi bi-graph-up"></i>
              Évolution des cotisations
            </h3>
            <p class="card-description">Tendance des cotisations mensuelles en 2025</p>
            <div
              v-if="monthlyCotisations.every((val) => parseFloat(val) === 0)"
              class="chart-stats"
            >
              <p>Aucune donnée de cotisation disponible pour 2025.</p>
            </div>
            <div v-else class="chart-container">
              <canvas id="cotisationsLineChart" class="chart-canvas"></canvas>
            </div>
            <!-- <div v-if="monthlyCotisations.some((val) => parseFloat(val) > 0)" class="chart-stats">
              <p><strong>Moyenne mensuelle :</strong> {{ averageMonthly.toFixed(2) }} €</p>
              <p>
                <strong>Mois le plus bas :</strong> {{ minMonth.name }} ({{ minMonth.value }} €)
              </p>
              <p><strong>Mois actifs :</strong> {{ activeMonths }} mois</p>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'BackOfficeAccueil',
  props: {
    totalMemberCount: {
      type: Number,
      required: true,
    },
    totalCotisationsThisMonth: {
      type: String,
      required: true,
    },
    recentActivityCount: {
      type: Number,
      required: true,
    },
    cotisations: {
      type: Array,
      required: true,
    },
    activities: {
      type: Array,
      required: true,
    },
    formatDate: {
      type: Function,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pieChartInstance: null,
      lineChartInstance: null,
    }
  },
  computed: {
    monthlyCotisations() {
      const year = new Date().getFullYear()
      const monthlyTotals = Array(12).fill(0)

      this.cotisations.forEach((cotisation) => {
        if (!cotisation.date_paiement || !cotisation.montant) return

        const [cotisationYear, cotisationMonth] = cotisation.date_paiement.split('-')
        if (parseInt(cotisationYear) !== year) return

        const monthIndex = parseInt(cotisationMonth, 10) - 1
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyTotals[monthIndex] += parseFloat(cotisation.montant) || 0
        }
      })

      return monthlyTotals.map((total) => total.toFixed(2))
    },
    pieChartData() {
      const monthNames = [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Août',
        'Sept',
        'Oct',
        'Nov',
        'Déc',
      ]
      const labels = []
      const data = []
      const colors = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#C9CBCF',
        '#7BC043',
        '#E91E63',
        '#00BCD4',
        '#8BC34A',
        '#FF5722',
      ]

      this.monthlyCotisations.forEach((amount, index) => {
        const value = parseFloat(amount)
        if (value > 0) {
          labels.push(monthNames[index])
          data.push(value)
        }
      })

      return {
        labels,
        data,
        colors: colors.slice(0, labels.length),
      }
    },
    annualTotal() {
      return this.monthlyCotisations.reduce((sum, amount) => sum + parseFloat(amount), 0).toFixed(2)
    },
    averageMonthly() {
      const validMonths = this.monthlyCotisations.filter((amount) => parseFloat(amount) > 0)
      return validMonths.length > 0
        ? validMonths.reduce((sum, amount) => sum + parseFloat(amount), 0) / validMonths.length
        : 0
    },
    maxMonth() {
      const monthNames = [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Août',
        'Sept',
        'Oct',
        'Nov',
        'Déc',
      ]
      const maxValue = Math.max(...this.monthlyCotisations)
      const maxIndex = this.monthlyCotisations.indexOf(maxValue.toFixed(2))
      return {
        name: monthNames[maxIndex] || 'N/A',
        value: maxValue.toFixed(2),
        index: maxIndex,
      }
    },
    minMonth() {
      const monthNames = [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Août',
        'Sept',
        'Oct',
        'Nov',
        'Déc',
      ]
      const validMonths = this.monthlyCotisations.filter((amount) => parseFloat(amount) > 0)
      const minValue = validMonths.length > 0 ? Math.min(...validMonths) : 0
      const minIndex = this.monthlyCotisations.indexOf(minValue.toFixed(2))
      return {
        name: monthNames[minIndex] || 'N/A',
        value: minValue.toFixed(2),
        index: minIndex,
      }
    },
    activeMonths() {
      return this.monthlyCotisations.filter((amount) => parseFloat(amount) > 0).length
    },
    yearOverYearChange() {
      const currentYear = new Date().getFullYear()
      const previousYear = currentYear - 1
      let currentTotal = 0
      let previousTotal = 0

      this.cotisations.forEach((cotisation) => {
        if (!cotisation.date_paiement || !cotisation.montant) return
        const [cotisationYear] = cotisation.date_paiement.split('-')
        const amount = parseFloat(cotisation.montant) || 0
        if (parseInt(cotisationYear) === currentYear) {
          currentTotal += amount
        } else if (parseInt(cotisationYear) === previousYear) {
          previousTotal += amount
        }
      })

      return previousTotal > 0
        ? (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1)
        : 'N/A'
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.initializePieChart()
        this.initializeLineChart()
      }, 200)
    })
  },
  methods: {
    initializePieChart() {
      const canvas = document.getElementById('cotisationsPieChart')
      if (!canvas) {
        console.warn('Canvas cotisationsPieChart non trouvé')
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error("Impossible d'obtenir le contexte 2D du canvas")
        return
      }

      if (this.pieChartInstance) {
        this.pieChartInstance.destroy()
        this.pieChartInstance = null
      }

      try {
        this.pieChartInstance = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: this.pieChartData.labels,
            datasets: [
              {
                data: this.pieChartData.data,
                backgroundColor: this.pieChartData.colors,
                borderColor: '#fff',
                borderWidth: 2,
                hoverBorderWidth: 3,
                hoverBorderColor: '#fff',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              animateScale: true,
              animateRotate: true,
              duration: 1000,
              easing: 'easeOutQuart',
            },
            plugins: {
              legend: {
                display: false, // Désactiver la légende
              },
              tooltip: {
                backgroundColor: '#003d82',
                titleFont: { size: 12 },
                bodyFont: { size: 11 },
                cornerRadius: 5,
                callbacks: {
                  label: (context) => {
                    const label = context.label || ''
                    const value = context.parsed
                    const total = context.dataset.data.reduce((a, b) => a + b, 0)
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
                    const yearChange =
                      this.yearOverYearChange !== 'N/A'
                        ? `Variation annuelle: ${this.yearOverYearChange}%`
                        : "Données de l'année précédente indisponibles"
                    return [`${label}: ${value}€ (${percentage}%)`, yearChange]
                  },
                },
              },
              annotation: {
                annotations: {
                  totalLabel: {
                    type: 'label',
                    content: [`Total: ${this.annualTotal}€`],
                    position: 'center',
                    color: '#333',
                    font: { size: 14, weight: '600' },
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 5,
                    padding: 6,
                  },
                },
              },
            },
          },
        })
      } catch (error) {
        console.error('Erreur lors de la création du diagramme circulaire:', error)
        this.$emit('chart-error', 'Impossible de charger le diagramme circulaire')
      }
    },
    initializeLineChart() {
      const canvas = document.getElementById('cotisationsLineChart')
      if (!canvas) {
        console.warn('Canvas cotisationsLineChart non trouvé')
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error("Impossible d'obtenir le contexte 2D du canvas")
        return
      }

      if (this.lineChartInstance) {
        this.lineChartInstance.destroy()
        this.lineChartInstance = null
      }

      const maxValue = Math.max(...this.monthlyCotisations.map((v) => parseFloat(v)))
      const maxIndex = this.monthlyCotisations.indexOf(maxValue.toFixed(2))
      const monthNames = [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Août',
        'Sept',
        'Oct',
        'Nov',
        'Déc',
      ]

      try {
        this.lineChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: monthNames,
            datasets: [
              {
                label: 'Cotisations (€)',
                data: this.monthlyCotisations,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: monthNames.map((_, i) =>
                  i === maxIndex ? '#FF6384' : '#fff',
                ),
                pointBorderColor: monthNames.map((_, i) =>
                  i === maxIndex ? '#FF6384' : '#007bff',
                ),
                pointBorderWidth: 2,
                pointRadius: monthNames.map((_, i) => (i === maxIndex ? 7 : 5)),
                pointHoverRadius: 7,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1000,
              easing: 'easeOutQuart',
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Montant (€)',
                  font: { size: 12, weight: '600' },
                  color: '#333',
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)' },
                ticks: {
                  callback: (value) => `${value}€`,
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Mois (2025)',
                  font: { size: 12, weight: '600' },
                  color: '#333',
                },
                grid: { display: false },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: { font: { size: 11 }, color: '#333' },
              },
              tooltip: {
                backgroundColor: '#003d82',
                titleFont: { size: 12 },
                bodyFont: { size: 11 },
                cornerRadius: 5,
                callbacks: {
                  label: (context) => {
                    const value = context.parsed.y
                    const index = context.dataIndex
                    const avg = this.averageMonthly
                    const percentageDiff = avg > 0 ? (((value - avg) / avg) * 100).toFixed(1) : 0
                    const prevMonthValue =
                      index > 0 ? parseFloat(this.monthlyCotisations[index - 1]) : 0
                    const trend =
                      prevMonthValue > 0
                        ? (((value - prevMonthValue) / prevMonthValue) * 100).toFixed(1)
                        : 'N/A'
                    return [
                      `${context.dataset.label}: ${value}€`,
                      `Vs moyenne: ${percentageDiff > 0 ? '+' : ''}${percentageDiff}%`,
                      `Vs mois précédent: ${trend !== 'N/A' ? (trend > 0 ? '+' : '') + trend + '%' : 'N/A'}`,
                    ]
                  },
                },
              },
              annotation: {
                annotations: {
                  averageLine: {
                    type: 'line',
                    yMin: this.averageMonthly,
                    yMax: this.averageMonthly,
                    borderColor: '#36A2EB',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    label: {
                      content: `Moyenne: ${this.averageMonthly.toFixed(2)}€`,
                      enabled: true,
                      position: 'end',
                      backgroundColor: 'rgba(54, 162, 235, 0.8)',
                      color: '#fff',
                      font: { size: 10 },
                      padding: 4,
                    },
                  },
                  maxPoint: {
                    type: 'label',
                    xValue: maxIndex,
                    yValue: maxValue + maxValue * 0.1,
                    content: `Max: ${maxValue}€`,
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    color: '#fff',
                    font: { size: 10 },
                    padding: 4,
                    borderRadius: 3,
                  },
                  minPoint: {
                    type: 'label',
                    xValue: this.minMonth.index,
                    yValue: parseFloat(this.minMonth.value) + maxValue * 0.1,
                    content: `Min: ${this.minMonth.value}€`,
                    backgroundColor: 'rgba(40, 167, 69, 0.8)',
                    color: '#fff',
                    font: { size: 10 },
                    padding: 4,
                    borderRadius: 3,
                  },
                },
              },
            },
          },
        })
      } catch (error) {
        console.error('Erreur lors de la création du graphique en courbe:', error)
        this.$emit('chart-error', 'Impossible de charger le graphique en courbe')
      }
    },
  },
  beforeUnmount() {
    if (this.pieChartInstance) {
      this.pieChartInstance.destroy()
      this.pieChartInstance = null
    }
    if (this.lineChartInstance) {
      this.lineChartInstance.destroy()
      this.lineChartInstance = null
    }
  },
}
</script>

<style src="../assets/css/dashboard.css"></style>
