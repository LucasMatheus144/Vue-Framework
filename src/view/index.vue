<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { getPersonagens } from "../services/api.js";


const items = ref<Character[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const page = ref(0);          
const limit = ref(10);
const search = ref("");

const totalPages = ref(0);
const totalItems = ref(0);

let t: number | undefined;
function debounceFetch(ms = 400) {
  window.clearTimeout(t);
  t = window.setTimeout(() => fetchData(), ms);
}

const canPrev = computed(() => page.value > 0);
const canNext = computed(() => page.value + 1 < totalPages.value);

async function fetchData() {
  loading.value = true;
  error.value = null;

  try {
    const data = await getPersonagens({
      page: page.value,
      limit: limit.value,
      name: search.value,
    });

    items.value = data.items ?? [];
    totalPages.value = data.meta?.totalPages ?? 0;
    totalItems.value = data.meta?.totalItems ?? 0;
  } catch (e: any) {
    error.value = e?.message ?? "Erro ao buscar personagens";
  } finally {
    loading.value = false;
  }
}

function goPrev() {
  if (!canPrev.value) return;
  page.value--;
}

function goNext() {
  if (!canNext.value) return;
  page.value++;
}

function goTo(p: number) {
  if (p < 0 || p >= totalPages.value) return;
  page.value = p;
}

watch([page, limit], () => {
  fetchData();
});

watch(search, () => {
  page.value = 0;
  debounceFetch(400);
});

onMounted(fetchData);
</script>

<template>
  <div style="max-width: 1100px; margin: 24px auto; padding: 0 16px;">
    <h1>Personagens Dragon Ball</h1>

    <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin: 12px 0 16px;">
      <input
        v-model="search"
        placeholder="Buscar por nome (ex: goku)"
        style="min-width: 260px; padding: 8px 10px;"
      />

      <label style="display:flex; gap:8px; align-items:center;">
        <span>Limite</span>
        <select v-model.number="limit" style="padding: 6px 10px;">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </label>

      <button @click="fetchData" :disabled="loading" style="padding: 8px 12px;">
        {{ loading ? "Carregando..." : "Atualizar" }}
      </button>

      <div style="margin-left:auto; opacity:.85;">
        Total: <b>{{ totalItems }}</b>
        <span v-if="totalPages"> • Páginas: <b>{{ totalPages }}</b></span>
      </div>
    </div>

    <p v-if="error" style="color:#b00020; margin: 0 0 12px;">
      {{ error }}
    </p>

    <div v-if="loading" style="padding: 16px 0;">Carregando...</div>

    <div
      v-else
      style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px;"
    >
      <div
        v-for="c in items"
        :key="c.id"
        style="border: 1px solid #776a6aff; border-radius: 12px; padding: 12px;"
      >
        <div style="display:flex; gap:10px; align-items:center;">
          <img :src="c.image" :alt="c.name" style="width: 64px; height: 64px; object-fit: cover; border-radius: 10px;" />
          <div>
            <div style="font-weight: 700;">{{ c.name }}</div>
            <div style="font-size: 12px; opacity: .8;">
              {{ c.race ?? "-" }} • {{ c.affiliation ?? "-" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 0" style="display:flex; gap:8px; align-items:center; justify-content:center; margin: 18px 0;">
      <button @click="goPrev" :disabled="!canPrev || loading">Anterior</button>

      <button
        v-for="p in Math.min(totalPages, 7)"
        :key="p"
        @click="goTo(p - 1)"
        :disabled="loading"
        :style="(p - 1) === page ? 'font-weight:700; text-decoration: underline;' : ''"
      >
        {{ p }}
      </button>

      <button @click="goNext" :disabled="!canNext || loading">Próxima</button>

      <span style="margin-left: 10px; opacity:.8;">
        Página <b>{{ page + 1 }}</b> de <b>{{ totalPages }}</b>
      </span>
    </div>
  </div>
</template>
