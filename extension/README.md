# Directus Sentoo Extension by Boncos

> **Note:** This extension is a **third-party integration** developed by Boncos and is **not an official Sentoo plugin**. It is **not built, endorsed, or supported by Sentoo**.  
> You must have an **active Sentoo merchant account** to use this integration, as access to production API credentials is only granted under contract with Sentoo.  
> **Sentoo does not provide support for this extension.** For support, please contact the extension maintainers.

This Directus extension integrates **Sentoo**, an online payment platform for the Dutch Caribbean, directly into your Directus instance.

## What is Sentoo?

**Sentoo** is a digital payment platform designed for the Dutch Caribbean, enabling businesses and consumers to make secure, real-time payments directly from their bank accounts. Sentoo provides a seamless checkout experience, allowing users to pay online without the need for credit cards. The platform supports instant payments, is widely adopted by local banks, and is focused on providing a safe, efficient, and user-friendly payment solution for the region.  
Learn more at [sentoo.io](https://sentoo.io).

## Features

- Integrates Sentoo payment gateway with Directus.
- Provides custom payment fields and status tracking.
- Allows payment triggering via flows.
- Automatically installs database tables for transaction management.

## Sentoo Settings

After installation, you can configure the extension in the Directus settings panel under **Sentoo Settings**.

![Sentoo Settings](https://raw.githubusercontent.com/boncos-io/sentoo_directus_extension/main/extension/readme_images/sentoo_configure_directus_settings.png)

These include:

- **API Host**: The Sentoo API endpoint to use.
- **Merchant Id** and **Secret**: Your merchant credentials provided by Sentoo.
- **Default Currency**: The default currency.
- **Default Return Url**: The default return url.

## Installed Tables

When the extension is installed, the following data models are added to your Directus project:

![Sentoo Tables](https://raw.githubusercontent.com/boncos-io/sentoo_directus_extension/main/extension/readme_images/sentoo_data_models.png)

- `sentoo_meta_info`: Contains metadata such as the extension version.
- `sentoo_transactions`: Stores all transaction records and states.

## Usage

To initiate payments, use the **"Pay with Sentoo"** operation available in the flows builder.

### Operation Options

- **Amount**: The amount to charge (required).
- **Currency**: The currency type to use (optional). Leave empty to use the default currency.
- **Description**: Shown to the user in the Sentoo payment page (required).
- **Return Url**: URL to redirect after payment completion (optional). Leave empty for default behavior url.
- **Customer Id**: Optional customer identifier for tracking purposes.
- **Expiration Time**: (Optional) Provide an expiry date for the transaction in a valid ISO 8601 format (including the timezone offset from UTC). For example, 2023-06-23T02:56:00-04:00. If not provided, the transaction will expire 1 hour after creation. The maximum expiration date is 1 year from now.

These options support dynamic templating using Directus flow context variables, for example:

- `{{$trigger.payload.amount}}`
- `{{$last.value}}`
- `{{operation_key.value}}`
- Static values like `"2971234567"` or `"Payment for invoice #123"`

### Operation Setup Example

Below is an example showing how to configure the operation inputs using values from the trigger payload in the data chain:

![Pay with Sentoo Operation Setup](https://raw.githubusercontent.com/boncos-io/sentoo_directus_extension/main/extension/readme_images/sentoo_operation_options.png)

### Example

Below is a visual example of the **Pay with Sentoo** flow operation in use within a Directus flow:

![Pay with Sentoo Operation](https://raw.githubusercontent.com/boncos-io/sentoo_directus_extension/main/extension/readme_images/sentoo_flow_operation.png)

To fully integrate Sentoo payments, you should also create a **"Mark as Paid"** flow in Directus (see example image below). This flow listens for transaction updates from Sentoo (such as payment success or failure) and updates the relevant order or record status in your application accordingly. This ensures your application reflects the real-time payment status and can handle actions like marking orders as paid, failed, or cancelled.

![Mark as Paid Flow](https://raw.githubusercontent.com/boncos-io/sentoo_directus_extension/main/extension/readme_images/sentoo_mark_as_paid_flow.png)

### Result

The operation adds a `sentoo_transactions` entry and outputs the result under the key defined in the operation block.

Refer to the Directus documentation for more on flow operations and data output.
