<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../services/storageService.js";

const auth = useAuthStore();
const el = ref(null);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function loadGsi() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();

    const t = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(t);
        resolve();
      }
    }, 50);

    setTimeout(() => {
      clearInterval(t);
      reject(new Error("Google Identity Services não carregou."));
    }, 5000);
  });
}

onMounted(async () => {
  await loadGsi();

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: async (response) => {
      await auth.loginWithGoogle(response.credential);
    },
  });

  window.google.accounts.id.renderButton(el.value, {
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "pill",
  });
});
</script>

<template>
  <div class="page">
    <div class="card">
      <div class="header">
        <h1>Entrar</h1>
        <p class="subtitle">
          Acesse com sua conta Google para continuar.
        </p>
      </div>

      <div class="content">
        <div v-if="error" class="alert">
          {{ error }}
        </div>

        <div class="status">
          {{ status }}
        </div>

        <div class="google-btn" ref="el"></div>

        <p class="hint">
          Ao continuar, você concorda com os termos e políticas do sistema.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page{
  min-height: 100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 24px;
}

.card{
  width: 100%;
  max-width: 420px;
  border: 1px solid #e6e6e6;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0,0,0,.06);
  background: #fff;
}

.header h1{
  margin: 0;
  font-size: 22px;
}

.subtitle{
  margin: 8px 0 0;
  opacity: .75;
  font-size: 14px;
}

.content{
  margin-top: 16px;
  display:flex;
  flex-direction:column;
  gap: 12px;
}

.alert{
  border: 1px solid #f0b4b4;
  background: #fff1f1;
  color: #8b0000;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
}

.status{
  font-size: 13px;
  opacity: .8;
}

.google-btn{
  display:flex;
  justify-content:center;
}

.hint{
  margin: 0;
  font-size: 12px;
  opacity: .65;
  text-align:center;
}
</style>