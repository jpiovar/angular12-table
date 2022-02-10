export const environment = {
  production: true,
  beOrigin: 'http://localhost:3000/',
  beHomeEndPoint: 'home',
  beVersionEndPoint: 'version',
  beTableDataEndPoint: 'table-data',
  beMetaDataEndPoint: 'meta-data',
  beTableChangeLogs: 'table-change-logs',
  beTableDataBaseEndPoint: 'table-data-base',
  redirectUrl: 'http://localhost:4200',
  cloudUrl: 'https://login.microsoftonline.com',
  clientId: process.env.AZURE_CLIENT_ID,
  tenantId: process.env.AZURE_TENANT_ID
};
