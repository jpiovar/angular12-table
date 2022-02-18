export const environment = {
  production: true,
  beOrigin: process.env.AZURE_BE_ORIGIN || 'http://localhost:3000/',
  beVersionEndPoint: process.env.AZURE_BE_VERSION || 'version',
  beTableDataEndPoint: process.env.AZURE_BE_TABLE_DATA || 'table-data',
  beMetaDataEndPoint: process.env.AZURE_BE_METADATA || 'meta-data',
  beTableChangeLogs: process.env.AZURE_BE_TABLE_CHANGE_LOGS || 'table-change-logs',
  beTableDataBaseEndPoint: process.env.AZURE_BE_TABLE_DATA_BASE || 'table-data-base',
  redirectUrl: process.env.AZURE_REDIRECT_URL || 'http://localhost:4200',
  cloudUrl: process.env.AZURE_CLOUD_URL || 'https://login.microsoftonline.com',
  clientId: process.env.AZURE_CLIENT_ID,
  tenantId: process.env.AZURE_TENANT_ID
};
