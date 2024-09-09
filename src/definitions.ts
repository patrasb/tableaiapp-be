import { defineSecret, defineString } from "firebase-functions/params";

// String
export const functionsRegion = defineString("FUNCTIONS_REGION");
export const awsTextractRegion = defineString("AWS_TEXTRACT_REGION");

// Secrets
export const awsAccessKeyId = defineSecret("AWS_ACCESS_KEY_ID");
export const awsSecretAccessKey = defineSecret("AWS_SECRET_ACCESS_KEY");
