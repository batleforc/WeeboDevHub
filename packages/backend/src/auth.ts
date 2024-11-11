import { createBackendModule } from '@backstage/backend-plugin-api';
import { oauth2ProxyAuthenticator } from '@backstage/plugin-auth-backend-module-oauth2-proxy-provider';
import {
  authProvidersExtensionPoint,
  createProxyAuthProviderFactory,
} from '@backstage/plugin-auth-node';

const customAuth = createBackendModule({
  // This ID must be exactly "auth" because that's the plugin it targets
  pluginId: 'auth',
  // This ID must be unique, but can be anything
  moduleId: 'custom-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          // This ID must match the actual provider config, e.g. addressing
          // auth.providers.github means that this must be "github".
          providerId: 'oauth2Proxy',
          // Use createProxyAuthProviderFactory instead if it's one of the proxy
          // based providers rather than an OAuth based one
          factory: createProxyAuthProviderFactory({
            authenticator: oauth2ProxyAuthenticator,
            async signInResolver(info, ctx) {
              /** *******************************************************************
               * Custom resolver code goes here, see farther down in this article! *
               * "info" is the sign in result from the upstream (github here), and *
               * "ctx" contains useful utilities for token issuance etc.           *
               *********************************************************************/
              console.log('***********************************************');
              console.log(info);
              console.log('***********************************************');

              const name = info.result.getHeader(
                'x-forwarded-preferred-username',
              );
              if (!name) {
                throw new Error('No username found in headers');
              }

              // This helper function handles sign-in by looking up a user in the catalog.
              // The lookup can be done either by reference, annotations, or custom filters.
              //
              // The helper also issues a token for the user, using the standard group
              // membership logic to determine the ownership references of the user.
              //
              // There are a number of other methods on the ctx, feel free to explore them!
              return ctx.signInWithCatalogUser({
                entityRef: { name },
              });
            },
          }),
        });
      },
    });
  },
});

export default customAuth;
