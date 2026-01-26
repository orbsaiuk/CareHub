require('dotenv').config();
const { createClient } = require("next-sanity");

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-08-11";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_ADMIN_TOKEN;

console.log('Sanity Config:', {
    projectId: projectId ? 'Set' : 'Missing',
    dataset: dataset ? 'Set' : 'Missing',
    token: token ? 'Set' : 'Missing',
    apiVersion
});

const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: "published",
});

module.exports = { writeClient };