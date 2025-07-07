<template>
  <div class="stats-container">
    <header class="stats-header">
      <h2 class="stats-title">Statistiques des cotisations</h2>
      <div class="filter-section">
        <label for="filterYear">Année : </label>
        <select v-model="selectedYear" @change="filterStats" id="filterYear" class="filter-select">
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
        <label for="filterMonth">Mois : </label>
        <select
          v-model="selectedMonth"
          @change="filterStats"
          id="filterMonth"
          class="filter-select"
        >
          <option value="">Tous les mois</option>
          <option v-for="(name, index) in monthNames" :key="index" :value="index + 1">
            {{ name }}
          </option>
        </select>
        <label for="filterStatus">Statut : </label>
        <select
          v-model="selectedStatus"
          @change="filterStats"
          id="filterStatus"
          class="filter-select"
        >
          <option value="">Tous</option>
          <option value="payé">Payé</option>
          <option value="en attente">En attente</option>
          <option value="échoué">Échoué</option>
        </select>
      </div>
    </header>

    <div v-if="errorStats" class="error-message">{{ errorStats }}</div>
    <div v-else-if="noDataToDisplay" class="no-data-message">
      Aucune donnée disponible pour l'année {{ selectedYear }}
      {{ selectedMonth ? 'et le mois de ' + monthNames[selectedMonth - 1] : '' }}.
    </div>
    <div v-else>
      <!-- Carte de résumé optimisée -->

      <div class="summary-card compact">
        <h3 class="compact-title">
          Résumé {{ selectedYear }}{{ selectedMonth ? ' - ' + monthNames[selectedMonth - 1] : '' }}
        </h3>
        <div class="summary-info compact-grid">
          <div class="summary-stat compact-stat">
            <div class="stat-value compact-value">
              {{ formatCurrency(annualStats.totalAmount) }}
            </div>
            <div class="stat-label compact-label">
              Total{{ selectedMonth ? ' du mois' : ' annuel' }}
            </div>
          </div>
          <div class="summary-stat compact-stat">
            <div class="stat-value compact-value">{{ annualStats.totalPayments }}</div>
            <div class="stat-label compact-label">Paiements</div>
          </div>
          <div
            class="summary-stat compact-stat"
            v-for="(count, status) in annualStats.statusCounts"
            :key="status"
          >
            <div class="stat-value compact-value" :class="`status-${status}`">{{ count }}</div>
            <div class="stat-label compact-label">{{ capitalizeStatus(status) }}</div>
          </div>
        </div>
      </div>

      <!-- Graphiques optimisés -->
      <div class="charts-row">
        <div class="chart-card compact-chart">
          <h3 class="chart-title compact-chart-title">
            {{ selectedMonth ? 'Détails du mois' : 'Évolution par mois' }}
          </h3>
          <div v-if="hasChartData" class="chart-wrapper">
            <canvas id="mainChart" class="chart-canvas compact-canvas"></canvas>
          </div>
          <div v-else class="no-chart-data compact-no-data">
            Aucune donnée à afficher pour ce graphique
          </div>
        </div>

        <div class="chart-card compact-chart">
          <h3 class="chart-title compact-chart-title">
            Répartition par statut{{ selectedMonth ? ' - ' + monthNames[selectedMonth - 1] : '' }}
          </h3>
          <div v-if="hasStatusData" class="chart-wrapper">
            <canvas id="statusPieChart" class="chart-canvas compact-canvas"></canvas>
          </div>
          <div v-else class="no-chart-data compact-no-data">
            Aucune donnée à afficher pour ce graphique
          </div>
        </div>
      </div>

      <!-- Tableau récapitulatif optimisé -->
      <!-- <div class="monthly-table-container compact-table">
        <h3 class="chart-title compact-chart-title">Récapitulatif mensuel</h3>
        <div v-if="displayedMonthlyStats.length > 0" class="table-wrapper">
          <table class="monthly-table compact-monthly-table">
            <thead>
              <tr>
                <th>Mois</th>
                <th>Total</th>
                <th>Paiements</th>
                <th>Payés</th>
                <th>En attente</th>
                <th>Échoués</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="month in displayedMonthlyStats" :key="month.month">
                <td class="month-cell">{{ month.monthName }}</td>
                <td class="amount-cell">{{ formatCurrency(month.totalAmount) }}</td>
                <td class="count-cell">{{ month.totalPayments }}</td>
                <td class="status-cell status-payé">{{ month.statusCounts.payé || 0 }}</td>
                <td class="status-cell status-en">{{ month.statusCounts['en attente'] || 0 }}</td>
                <td class="status-cell status-échoué">{{ month.statusCounts.échoué || 0 }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <th>{{ formatCurrency(annualStats.totalAmount) }}</th>
                <th>{{ annualStats.totalPayments }}</th>
                <th class="status-payé">{{ annualStats.statusCounts.payé || 0 }}</th>
                <th class="status-en">{{ annualStats.statusCounts['en attente'] || 0 }}</th>
                <th class="status-échoué">{{ annualStats.statusCounts.échoué || 0 }}</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div v-else class="no-data">Aucune donnée mensuelle disponible</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'StatsView',
  props: {
    stats: {
      type: Array,
      default: () => [],
    },
    errorStats: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedYear: new Date().getFullYear().toString(),
      selectedMonth: '',
      selectedStatus: '',
      mainChartInstance: null,
      statusPieChartInstance: null,
      isChartLoading: false,
      monthNames: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ],
    }
  },
  computed: {
    noDataToDisplay() {
      return this.filteredStats.length === 0
    },
    availableYears() {
      const currentYear = new Date().getFullYear()
      const startYear = 2020 // Années disponibles
      const years = []
      for (let year = currentYear; year >= startYear; year--) {
        years.push(year.toString())
      }
      return years
    },
    filteredStats() {
      return this.stats.filter((stat) => {
        const yearMatch = stat.periode.startsWith(this.selectedYear)
        const statusMatch = !this.selectedStatus || stat.statut_paiement === this.selectedStatus
        let monthMatch = true
        if (this.selectedMonth) {
          const monthStr = stat.periode.split('-')[1]
          monthMatch = monthStr === this.formatMonthNumber(this.selectedMonth)
        }
        return yearMatch && statusMatch && monthMatch
      })
    },
    monthlyStats() {
      const months = {}
      this.monthNames.forEach((name, index) => {
        const monthNumber = index + 1
        months[monthNumber] = {
          month: monthNumber,
          monthName: name,
          totalAmount: 0,
          totalPayments: 0,
          statusCounts: {
            payé: 0,
            'en attente': 0,
            échoué: 0,
          },
        }
      })

      this.filteredStats.forEach((stat) => {
        const monthStr = stat.periode.split('-')[1]
        const month = parseInt(monthStr, 10)
        if (months[month]) {
          months[month].totalAmount += parseFloat(stat.total_montant || 0)
          months[month].totalPayments += parseInt(stat.nombre_paiements || 0)
          if (months[month].statusCounts[stat.statut_paiement] !== undefined) {
            months[month].statusCounts[stat.statut_paiement] += parseInt(stat.nombre_paiements || 0)
          }
        }
      })

      return Object.values(months)
        .filter((month) =>
          this.selectedStatus
            ? month.statusCounts[this.selectedStatus] > 0
            : month.totalPayments > 0,
        )
        .sort((a, b) => a.month - b.month)
    },
    displayedMonthlyStats() {
      if (this.selectedMonth) {
        return this.monthlyStats.filter((month) => month.month === parseInt(this.selectedMonth))
      }
      return this.monthlyStats
    },
    annualStats() {
      const totalAmount = this.monthlyStats.reduce((sum, month) => sum + month.totalAmount, 0)
      const totalPayments = this.monthlyStats.reduce((sum, month) => sum + month.totalPayments, 0)
      const statusCounts = {
        payé: 0,
        'en attente': 0,
        échoué: 0,
      }
      this.monthlyStats.forEach((month) => {
        Object.keys(statusCounts).forEach((status) => {
          statusCounts[status] += month.statusCounts[status] || 0
        })
      })
      return {
        totalAmount,
        totalPayments,
        statusCounts,
      }
    },
    hasChartData() {
      return this.monthlyStats.length > 0 && this.monthlyStats.some((m) => m.totalPayments > 0)
    },
    hasStatusData() {
      return Object.values(this.annualStats.statusCounts).some((count) => count > 0)
    },
  },
  watch: {
    filteredStats: {
      handler() {
        this.debounceUpdateCharts()
      },
      immediate: false,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeCharts()
    })
  },
  methods: {
    filterStats() {
      this.debounceUpdateCharts()
    },
    debounceUpdateCharts() {
      if (this.chartUpdateTimeout) {
        clearTimeout(this.chartUpdateTimeout)
      }
      this.chartUpdateTimeout = setTimeout(() => {
        this.updateCharts()
      }, 300)
    },
    capitalizeStatus(status) {
      return status.charAt(0).toUpperCase() + status.slice(1)
    },
    formatMonthNumber(month) {
      return month.toString().padStart(2, '0')
    },
    formatCurrency(amount) {
      return (
        new Intl.NumberFormat('fr-FR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount) + ' €'
      )
    },
    initializeCharts() {
      if (this.noDataToDisplay) {
        console.log('No data to display, skipping chart initialization')
        return
      }

      this.isChartLoading = true

      try {
        if (this.hasChartData) {
          this.initializeMainChart()
        }
        if (this.hasStatusData) {
          this.initializeStatusPieChart()
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation des graphiques:", error)
      } finally {
        this.isChartLoading = false
      }
    },
    initializeMainChart() {
      this.destroyChart('mainChartInstance')

      const mainChartCanvas = document.getElementById('mainChart')
      if (!mainChartCanvas) return

      const ctx = mainChartCanvas.getContext('2d')
      if (!ctx) return

      const chartConfig = this.selectedMonth
        ? this.getMonthlyChartConfig()
        : this.getAnnualChartConfig()

      this.mainChartInstance = new Chart(ctx, chartConfig)
    },
    getMonthlyChartConfig() {
      const selectedMonthData = this.monthlyStats.find(
        (m) => m.month === parseInt(this.selectedMonth),
      )

      if (!selectedMonthData) return null

      return {
        type: 'bar',
        data: {
          labels: ['Payé', 'En attente', 'Échoué'],
          datasets: [
            {
              label: this.monthNames[this.selectedMonth - 1],
              data: [
                selectedMonthData.statusCounts.payé || 0,
                selectedMonthData.statusCounts['en attente'] || 0,
                selectedMonthData.statusCounts.échoué || 0,
              ],
              backgroundColor: ['#1e40af', '#3b82f6', '#60a5fa'],
              borderRadius: 4,
            },
          ],
        },
        options: this.getChartOptions('Nombre de paiements'),
      }
    },
    getAnnualChartConfig() {
      return {
        type: 'bar',
        data: {
          labels: this.monthlyStats.map((month) => month.monthName),
          datasets: [
            {
              label: 'Payé',
              data: this.monthlyStats.map((month) => month.statusCounts.payé || 0),
              backgroundColor: '#1e40af',
              stack: 'Stack 0',
              borderRadius: 2,
            },
            {
              label: 'En attente',
              data: this.monthlyStats.map((month) => month.statusCounts['en attente'] || 0),
              backgroundColor: '#3b82f6',
              stack: 'Stack 0',
              borderRadius: 2,
            },
            {
              label: 'Échoué',
              data: this.monthlyStats.map((month) => month.statusCounts.échoué || 0),
              backgroundColor: '#60a5fa',
              stack: 'Stack 0',
              borderRadius: 2,
            },
          ],
        },
        options: {
          ...this.getChartOptions('Nombre de paiements'),
          scales: {
            ...this.getChartOptions('Nombre de paiements').scales,
            x: {
              ...this.getChartOptions('Nombre de paiements').scales.x,
              stacked: true,
            },
            y: {
              ...this.getChartOptions('Nombre de paiements').scales.y,
              stacked: true,
            },
          },
        },
      }
    },
    getChartOptions(yAxisLabel) {
      return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: yAxisLabel,
              color: '#475569',
              font: { size: 10, weight: 'bold' },
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.1)',
              lineWidth: 1,
            },
            ticks: {
              font: { size: 9 },
              color: '#64748b',
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 9 },
              color: '#64748b',
              maxRotation: 45,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 9 },
              color: '#1e293b',
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: 'rgba(30, 64, 175, 0.9)',
            titleFont: { size: 10, weight: 'bold' },
            bodyFont: { size: 9 },
            borderColor: '#1e40af',
            borderWidth: 1,
            cornerRadius: 6,
            displayColors: true,
          },
        },
        elements: {
          bar: {
            borderWidth: 0,
          },
        },
      }
    },
    initializeStatusPieChart() {
      this.destroyChart('statusPieChartInstance')

      const statusPieChartCanvas = document.getElementById('statusPieChart')
      if (!statusPieChartCanvas) return

      const ctx = statusPieChartCanvas.getContext('2d')
      if (!ctx) return

      const statusLabels = ['Payé', 'En attente', 'Échoué']
      const statusKeys = ['payé', 'en attente', 'échoué']
      const statusColors = ['#1e40af', '#3b82f6', '#60a5fa']
      const statCounts = this.annualStats.statusCounts
      const data = statusKeys.map((key) => statCounts[key] || 0)

      if (data.every((val) => val === 0)) return

      this.statusPieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: statusLabels,
          datasets: [
            {
              data: data,
              backgroundColor: statusColors,
              borderColor: '#ffffff',
              borderWidth: 2,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '50%',
          plugins: {
            legend: {
              display: true,
              position: 'right',
              labels: {
                font: { size: 9 },
                color: '#1e293b',
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 15,
              },
            },
            tooltip: {
              backgroundColor: 'rgba(30, 64, 175, 0.9)',
              titleFont: { size: 10, weight: 'bold' },
              bodyFont: { size: 9 },
              borderColor: '#1e40af',
              borderWidth: 1,
              cornerRadius: 6,
              callbacks: {
                label: function (context) {
                  const label = context.label || ''
                  const value = context.raw || 0
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = total > 0 ? Math.round((value / total) * 100) : 0
                  return `${label}: ${value} (${percentage}%)`
                },
              },
            },
          },
        },
      })
    },
    destroyChart(chartInstanceName) {
      if (this[chartInstanceName]) {
        this[chartInstanceName].destroy()
        this[chartInstanceName] = null
      }
    },
    updateCharts() {
      this.$nextTick(() => {
        this.initializeCharts()
      })
    },
  },
  beforeUnmount() {
    if (this.chartUpdateTimeout) {
      clearTimeout(this.chartUpdateTimeout)
    }

    try {
      this.destroyChart('mainChartInstance')
      this.destroyChart('statusPieChartInstance')
    } catch (error) {
      console.error('Erreur lors de la destruction des graphiques:', error)
    }
  },
}
</script>

<style src="../assets/css/stats.css"></style>
