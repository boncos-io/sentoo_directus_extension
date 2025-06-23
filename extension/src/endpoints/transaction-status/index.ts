import { defineEndpoint } from "@directus/extensions-sdk";
import { App } from "../../shared/app";
import express from "express";

export default defineEndpoint({
  id: "sentoo",
  handler: (router, context) => {
    const app = App.fromDirectusContext(context);
    router.post(
      "/transaction-status",
      express.urlencoded({ extended: true }),
      async (_req, res) => {
        const { transaction_id } = _req.body as { transaction_id: string };
        await app.transactionsService.updateLocalTransactionForGatewayTransactionId(
          transaction_id
        );
        return res.status(200).json({ success: true });
      }
    );
  },
});
