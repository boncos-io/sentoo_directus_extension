import { defineOperationApp } from "@directus/extensions-sdk";
import { logger } from "../../shared/utils/logger";

export default defineOperationApp({
  id: "pay-with-sentoo",
  name: "Pay with Sentoo",
  icon: "payment",
  description: "Make a payment transaction using Sentoo",
  overview: ({
    amount,
    currency,
    description,
    return_url,
    customer,
    expires,
  }) => {
    logger.info("Generating overview for payment operation");
    logger.info(
      `Amount: ${amount}, Currency: ${currency}, Description: ${description}, Return URL: ${return_url}, Customer: ${customer}, Expires: ${expires}`
    );
    const overview = [
      { label: "Amount", text: amount },
      { label: "Description", text: description || "Default" },
    ];
    if (currency) {
      overview.push({ label: "Currency", text: currency });
    }
    if (return_url) {
      overview.push({ label: "Return URL", text: return_url });
    }
    if (customer) {
      overview.push({ label: "Customer ID", text: customer });
    }
    if (expires) {
      overview.push({ label: "Expiration Time", text: expires });
    }
    return overview;
  },
  options: [
    {
      field: "amount",
      name: "Amount",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        required: true,
        note: "Enter the amount for the payment in cents (e.g., 1000 for 10.00 AWG)",
      },
    },
    {
      field: "currency",
      name: "Currency",
      type: "integer",
      meta: {
        width: "full",
        interface: "select-dropdown",
        required: false,
        note: "Select the currency for the payment (leave empty for default)",
        options: {
          choices: [
            {
              text: "Aruban Florin (AWG)",
              value: "AWG",
            },
            {
              text: "United States Dollar (USD)",
              value: "USD",
            },
            {
              text: "Euro (EUR)",
              value: "EUR",
            },
            {
              text: "East Caribbean Dollar (XCD)",
              value: "XCD",
            },
          ],
        },
      },
    },
    {
      field: "description",
      name: "Description",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        required: true,
      },
    },
    {
      field: "return_url",
      name: "Return URL",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        required: false,
        note: "URL to redirect after payment completion (optional). Leave empty for default behavior url.",
      },
    },
    {
      field: "customer",
      name: "Customer ID",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        required: false,
        note: "Optional customer identifier for tracking purposes",
      },
    },
    {
      field: "expires",
      name: "Expiration Time",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        required: false,
        note: "(Optional) Provide an expiry date for the transaction in a valid ISO 8601 format (including the timezone offset from UTC). For example, 2023-06-23T02:56:00-04:00. If not provided, the transaction will expire 1 hour after creation. The maximum expiration date is 1 year from now.",
      },
    },
  ],
});
