import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: '03-pokedex-app',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
