export const environment = {
  production: true,
  beOrigin: process.env.AZURE_BE_ORIGIN,
  beHomeEndPoint: 'home',
  beVersionEndPoint: 'version',
  beTableDataEndPoint: 'table-data',
  beMetaDataEndPoint: 'meta-data',
  beTableChangeLogs: 'table-change-logs',
  beTableDataBaseEndPoint: 'table-data-base',
  redirectUrl: process.env.AZURE_REDIRECT_URL,
  cloudUrl: process.env.AZURE_CLOUD_URL,
  clientId: process.env.AZURE_CLIENT_ID,
  tenantId: process.env.AZURE_TENANT_ID
};
