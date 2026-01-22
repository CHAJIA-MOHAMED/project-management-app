<template>
  <div class="box">
    <div class="container">
      <!-- Navbar -->
      <div class="container-fluid py-3">
        <nav class="navbar navbar-expand-lg navbar-dark rounded shadow mb-0 px-3">
          <a class="navbar-brand fw-bold" href="/statistiqueMothly/">Statistic</a>
          <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link" href="/statistiqueMothly/">/ Statistics</a>
              </li>
            </ul>
            <div class="d-flex ms-auto gap-4">
              <div class="date-filter d-flex flex-column">
                <label for="start-date" class="mb-1">Start Date:</label>
                <input type="date" id="start-date" v-model="startDate" @change="loadStats"/>
              </div>
              <div class="date-filter d-flex flex-column">
                <label for="end-date" class="mb-1">End Date:</label>
                <input type="date" id="end-date" v-model="endDate" @change="loadStats"/>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <!-- Filters -->
      <div class="filters d-flex mb-3 gap-4">
        <div class="wallet-filter d-flex flex-column"
             @focusin="isWalletFocused = true"
             @focusout="isWalletFocused = false">
          <label class="mb-1">Wallets:</label>

          <div class="wallet-input">
            <!-- Tags -->
            <div class="wallet-tag" v-for="w in selectedWallets" :key="w.id">
              {{ w.name }}
              <span class="remove" @click="removeWallet(w.id)">×</span>
            </div>

            <!-- Input -->
            <input
              ref="walletInput"
              type="text"
              v-model="walletInput"
              placeholder="Type wallet name..."
              @input="filterWallets"
            />
          </div>

          <!-- Suggestions -->
          <div v-if="suggestions.length && isWalletFocused" class="suggestions">
            <div class="suggestion-item"
                 v-for="w in suggestions"
                 :key="w.id"
                 @mousedown.prevent="addWallet(w)">
              {{ w.name }}
            </div>
          </div>
        </div>

        <div class="d-flex align-items-start">
          <button class="btn btn-secondary mt-4" @click="downloadPdf">
            Télécharger PDF
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="table table-hover table-bordered table-striped text-center">
          <thead class="thead-dark">
            <tr>
              <th>Année</th>
              <th>Mois</th>
              <th>tockens crées</th>
              <th>tockens échoués</th>
              <th>tockens actifs</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in stats" :key="`${stat.year}-${stat.month}`">
              <td>{{ stat.year }}</td>
              <td>{{ monthName(stat.month) }}</td>
              <td>{{ stat.success || 0 }}</td>
              <td>{{ (stat.failed || 0) + (stat.declined || 0) }}</td>
              <td>{{ stat.success || 0 }}</td>
              <td>{{ stat.total || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      stats: [],
      startDate: "",
      endDate: "",
      walletOptions: [
        { id: 103, name: "Apple" },
        { id: 216, name: "Google" },
        { id: 327, name: "M4M" },
        { id: 642, name: "Issuer Wallet" }
      ],
      selectedWallets: [],
      walletInput: "",
      suggestions: [],
      isWalletFocused: false
    };
  },

  mounted() {
    this.loadStats();
  },

  methods: {
    filterWallets() {
      const query = this.walletInput.toLowerCase();
      this.suggestions = this.walletOptions.filter(
        w => w.name.toLowerCase().includes(query)
             && !this.selectedWallets.some(sw => sw.id === w.id)
      );
    },

    addWallet(wallet) {
      if (this.selectedWallets.some(w => w.id === wallet.id)) return;

      this.selectedWallets.push(wallet);
      this.suggestions = this.suggestions.filter(w => w.id !== wallet.id);
      this.walletInput = "";
      this.loadStats();

      // Keep focus on input
      this.$nextTick(() => {
        this.$refs.walletInput.focus();
      });
    },

    removeWallet(id) {
      this.selectedWallets = this.selectedWallets.filter(w => w.id !== id);
      this.filterWallets();
      this.loadStats();
    },

    async loadStats() {
      try {
        const res = await axios.get("/api/logsTable/monthly", {
          params: {
            start: this.startDate || undefined,
            end: this.endDate || undefined,
            wallets: this.selectedWallets.map(w => w.id).join(",")
          }
        });

        this.stats = res.data.data;
      } catch (err) {
        console.error("Stats error:", err);
      }
    },

    monthName(m) {
      return [
        "", "Janvier","Février","Mars","Avril","Mai","Juin",
        "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
      ][m];
    },

    downloadPdf() {
      // placeholder function
      alert("Téléchargement PDF déclenché !");
    }
  }
};
</script>

<style scoped>
* { box-sizing: border-box; }

.box {
  width: 100%;
  height: 100vh;
  padding-top: 60px;
  padding-left: 280px;
  background-color: rgba(240, 238, 238, 0.87);
  color: #4A4A4A;
}

.container { width: 100%; height: 100%; padding: 0 20px; overflow: auto; }

.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid #ccc;
  background-color: #fff;
}

.table { width: 100%; table-layout: auto; font-size: 0.8rem; background: #fff; }
.table thead { background: #4A4A4A; color: #fff; }
.table-striped tbody tr:nth-of-type(odd) { background: #f9f9f9; }
.table td, .table th { padding: 6px 8px; font-size: 0.9rem; vertical-align: middle; }

.navbar { background-color: #122e41; color: #fff; }
.navbar-brand { font-size: 1.5rem; font-weight: bold; }

.filters {
  padding: 10px;
  border-radius: 5px;
  background-color: #122e41;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 40px;
}

.wallet-filter {
  display: flex;
  flex-direction: column;
  position: relative;
  color: #f6f3f3;
}

.wallet-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  border: 1px solid #007bff;
  padding: 6px 10px;
  border-radius: 10px;
  min-width: 250px;
  background-color: #f8f9fa;
}

.wallet-input input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 120px;
  padding: 4px 6px;
  font-size: 0.9rem;
}

.wallet-tag {
  background: #122e41;
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.wallet-tag .remove { cursor: pointer; font-weight: bold; }

.suggestions {
  border: 1px solid #007bff;
  max-height: 100px;
  overflow-y: auto;
  margin-top: 4px;
  border-radius: 10px;
  background: #fff;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  position: absolute;
  top: 100%;
  left: 0;
  color: #000;
}

.suggestion-item {
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.suggestion-item:hover,
.suggestion-item.active {
  background-color: #122e41;
  color: #f7f5f5;
}
</style>
