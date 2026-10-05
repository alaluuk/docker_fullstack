import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: Number(env.PORT || 3000),
      strictPort: true,
      watch: {
        usePolling: env.CHOKIDAR_USEPOLLING === "true",
      },
    },
  };
});
