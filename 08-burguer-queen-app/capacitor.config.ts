import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: '08-burguer-queen-app',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: false
    }
  },
  server: {
    cleartext: true,
    androidScheme: 'http'
  }
};

export default config;
