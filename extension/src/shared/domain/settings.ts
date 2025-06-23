type Settings = {
  apiHost: "https://api.sandbox.sentoo.io" | "https://api.sentoo.io";
  merchantId: string;
  merchantSecret: string;
  defaultCurrency: string;
  defaultReturnUrl: string;
};
export default Settings;
