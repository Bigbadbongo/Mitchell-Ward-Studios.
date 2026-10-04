import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mitchellward.artgallery',
  appName: 'Mitchell Ward Studios',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'checkout.stripe.com',
      '*.stripe.com'
    ]
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"]
    }
  }
};

export default config;
