// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  beOrigin: process.env.AZURE_BE_ORIGIN || 'http://localhost:3000/',
  beVersionEndPoint: process.env.AZURE_BE_VERSION || 'version',
  beTableDataEndPoint: process.env.AZURE_BE_TABLE_DATA || 'table-data',
  beMetaDataEndPoint: process.env.AZURE_BE_METADATA || 'meta-data',
  beTableChangeLogs: process.env.AZURE_BE_TABLE_CHANGE_LOGS || 'table-change-logs',
  beTableDataBaseEndPoint: process.env.AZURE_BE_TABLE_DATA_BASE || 'table-data-base',
  redirectUrl: process.env.AZURE_REDIRECT_URL || 'http://localhost:8080',
  cloudUrl: process.env.AZURE_CLOUD_URL || 'https://login.microsoftonline.com',
  clientId: process.env.AZURE_CLIENT_ID,
  tenantId: process.env.AZURE_TENANT_ID
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
