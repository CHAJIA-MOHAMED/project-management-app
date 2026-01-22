<template>
    <div class="box">
      <div class="container">
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
        <div class="filters d-flex mb-3 gap-4">
          <div
            class="wallet-filter d-flex flex-column"
            @focusin="isWalletFocused = true"
            @focusout="isWalletFocused = false"
            >

                    <label class="mb-1">Wallets:</label>
                    <div class="wallet-input">
                    <!-- Tags / Pills -->
                    <div class="wallet-tag" v-for="w in selectedWallets" :key="w.id">
                        {{ w.name }}
                        <span class="remove" @click="removeWallet(w.id)">×</span>
                    </div>
                    <!-- Input for typing -->
                    <input
                        type="text"
                        v-model="walletInput"
                        placeholder="Type wallet name..."
                        @input="filterWallets"
                        @keydown.enter.prevent="addWalletByName(walletInput)"
                        @focus="onWalletFocus"
                        @blur="onWalletBlur"
                        />

                    </div>
                    <!-- Suggestions dropdown -->
                    <div v-if="suggestions.length && isWalletFocused" class="suggestions">
                    <div
                        class="suggestion-item"
                        v-for="w in suggestions"
                        :key="w.id"
                        @click="addWalletByName(w.name)"
                        @mousedown.prevent="addWalletByName(w.name)"
                    >
                        {{ w.name }}</div>
                    </div>
          </div>
            <div class="d-flex align-items-start">
              <button class="btn btn-secondary mt-4" @click="downloadPdf">
                Télécharger PDF
              </button>
            </div>
        </div>
          

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
    
    async mounted() {
        this.loadStats();
    },

    
    methods: {
        onWalletFocus() {
        this.isWalletFocused = true;
        this.filterWallets();
        },

        onWalletBlur() {
        this.isWalletFocused = false;
        },

        filterWallets() {
        const val = this.walletInput.toLowerCase();
        this.suggestions = this.walletOptions.filter(
            w =>
            w.name.toLowerCase().includes(val) &&
            !this.selectedWallets.some(sw => sw.id === w.id)
        );
        },

        addWalletByName(name) {
        const wallet = this.walletOptions.find(
            w => w.name.toLowerCase() === name.toLowerCase()
        );
        if (!wallet) return;

        if (!this.selectedWallets.some(w => w.id === wallet.id)) {
            this.selectedWallets.push(wallet);
            this.loadStats();
        }

        this.walletInput = "";
        this.suggestions = [];
        },

        removeWallet(id) {
        this.selectedWallets = this.selectedWallets.filter(w => w.id !== id);
        this.loadStats();
        },


        async loadStats() {
        try {
        const res = await axios.get("/api/logsTable/monthly", {
        params: {
            start: this.startDate,
            end: this.endDate,
            wallets: this.selectedWallets.map(w => w.id).join(",")
        }
        });
        this.stats = res.data.data;

        if (this.stats.length && !this.startDate && !this.endDate) {
        // حدّد أول وأخر تاريخ من data
        const months = this.stats.map(s => ({ year: s.year, month: s.month }));
        // sort ascending
        months.sort((a,b) => a.year - b.year || a.month - b.month);

        const first = months[0];
        const last = months[months.length-1];

        this.startDate = `${first.year}-${String(first.month).padStart(2,'0')}-01`;

        // last day of month calculation
        const lastDay = new Date(last.year, last.month, 0).getDate();
        this.endDate = `${last.year}-${String(last.month).padStart(2,'0')}-${lastDay}`;

        }
        } catch (err) {
            console.error("Stats error:", err);
        }
    },
    monthName(m) {
        return [
        "", "Janvier","Février","Mars","Avril","Mai","Juin",
        "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
        ][m];
    }
    }
};

</script>

<style scoped>
* { box-sizing: border-box; }
.box {width: 100%;height: 100vh;padding-top: 60px; padding-left: 280px;background-color: rgba(240, 238, 238, 0.87); color: #4A4A4A;}
.container { width: 100%;height: 100%;padding: 0 20px;overflow: auto; }
.container-fluid { padding: 0; }
/* Table */
.table-wrapper {
  max-height: 400px; /* taille de la table */
  overflow-y: auto;  /* Scroll vertical */
  overflow-x: auto;  /* Scroll horizontal (optionnel) */
  border: 1px solid #ccc;
  background-color: #fff;
}
.table {background-color: #fff; table-layout: auto; width: 100%; font-size: 0.8rem;}
.table thead {background-color: #4A4A4A; color: #fff;white-space: nowrap;}
.table-striped tbody tr:nth-of-type(odd) {background-color: #f9f9f9;}
.table td, .table th {
  white-space: normal;
  word-break: break-word;
  vertical-align: middle;
  font-size: 0.9rem;
  padding: 6px 8px;       
  vertical-align: middle;
}


/* Navbar */
.navbar {background-color: #122e41 ; color: #fff;width: 100%;}
.navbar-brand {font-size: 1.5rem;font-weight: bold;}
.btn-ajoute {
  background-color: #FF6600;color: #fff;padding: 8px 16px;border: none;border-radius: 8px;font-size: 16px;font-weight: 600;text-transform: uppercase;letter-spacing: 1px;border: 1px solid #4A4A4A;cursor: pointer;box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);}
.btn-ajoute:hover {background-color: #e65c00;border-color: #e65c00;box-shadow: 0 6px 12px rgba(230, 92, 0, 0.4);}
.btn-ajoute:focus {outline: none;}
input[type="date"] {
  border-radius: 6px;
  border: 1px solid #ccc;
  padding: 4px 8px;
}
.filters > div {
  flex: 1;
}
.filters {
  padding: 10px;
  border-color: #f5f2f2;
  border-radius: 5px;
  background-color: #122e41;
  display: flex;
  align-items: flex-start;
    justify-content: space-between;
  gap: 40px;
}

.wallet-filter,
.status-filter {
  display: flex;
  flex-direction: column;
  color: #f6f3f3;
   position: relative;
}

.wallet-filter .checkbox-list,
.status-filter .checkbox-list {
  display: grid;
  flex-direction: column; 
  gap: 15px;
  color: #f6f3f3;
  grid-template-columns: repeat(2, 1fr); /* 2 colonnes */
  white-space: nowrap;
}
.navbar .badge {
  font-size: 0.9rem;
  border-radius: 8px;
  background: #ffffff;
  color: #122e41 !important;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  margin-right: 20px;
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
  /* max-width: 400px; */
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

.wallet-tag .remove {
  cursor: pointer;
  font-weight: bold;
}

.suggestions {
  border: 1px solid #007bff;
  max-height: 100px;
  /* max-width: 400px; */
  overflow-y: auto;
  margin-top: 4px;
  border-radius: 10px;
  background: #fff;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  color: #000;
  position: absolute;
  top: 100%;
  left: 0;
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

