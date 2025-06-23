import { defineHook } from "@directus/extensions-sdk";
import { App } from "../../shared/app";

export default defineHook(async ({ action }, context) => {
  const app = App.fromDirectusContext(context);
  action("extensions.installed", () => {
    app.bootstrapService.bootstrap();
  });
  action("server.start", () => {
    app.bootstrapService.bootstrap();
  });
});
