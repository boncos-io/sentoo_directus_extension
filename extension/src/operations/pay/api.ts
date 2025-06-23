import { defineOperationApi } from "@directus/extensions-sdk";
import { App } from "../../shared/app";
import { Liquid } from "liquidjs";

type Options = {
  amount: string;
  currency?: string;
  description: string;
  return_url?: string;
  customer?: string;
  expires?: string;
};
const liquidEngine = new Liquid();

export default defineOperationApi<Options>({
  id: "pay-with-sentoo",
  handler: async (
    { amount, currency, description, return_url, customer, expires },
    context
  ) => {
    const amountRender = await liquidEngine.parseAndRender(
      amount,
      context.data
    );
    const currencyRender = currency
      ? await liquidEngine.parseAndRender(currency, context.data)
      : undefined;
    const descriptionRender = await liquidEngine.parseAndRender(
      description,
      context.data
    );
    const returnUrlRender = return_url
      ? await liquidEngine.parseAndRender(return_url, context.data)
      : undefined;
    const customerRender = customer
      ? await liquidEngine.parseAndRender(customer, context.data)
      : undefined;
    const expiresRender = expires
      ? await liquidEngine.parseAndRender(expires, context.data)
      : undefined;

    const app = App.fromDirectusContext(context);
    return await app.transactionsService.createTransaction({
      amount: parseInt(amountRender),
      description: descriptionRender,
      currency: currencyRender,
      return_url: returnUrlRender,
      customer: customerRender,
      expires: expiresRender,
    });
  },
});
