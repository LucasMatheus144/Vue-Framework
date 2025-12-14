import { defineStore } from "pinia";
import { http } from "./apiService.js";

const KEY = "auth";

function writeStorage(token, user) {
  localStorage.setItem(KEY, JSON.stringify({ token, user }));
}
function clearStorage() {
  localStorage.removeItem(KEY);
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (s) => !!s.token,
  },

  actions: {
    logout() {
      this.token = null;
      this.user = null;
      this.error = null;
      clearStorage();
    },

    async loginWithGoogle(googleIdToken) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await http.post("/auth/google", {
          idToken: googleIdToken,
        });

        this.token = data.token;
        this.user = data.user;

        writeStorage(data.token, data.user);
      } catch (e) {
        this.error = e?.response?.data?.message ?? "Falha no login com Google";
        this.logout();
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
});
