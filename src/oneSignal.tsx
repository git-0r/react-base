import OneSignal from 'react-onesignal';

export default async function runOneSignal() {
  const appId = process.env.ONESIGNAL_APP_ID;
  if (appId) {
    await OneSignal.init({
      appId,
      allowLocalhostAsSecureOrigin: true,
    });
    OneSignal.showSlidedownPrompt();
  } else {
    console.log({ appId });
  }
}
