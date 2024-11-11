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
  moduleId: 'custom-oauth2-proxy',
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
              const name = info.result
                .getHeader('x-forwarded-preferred-username')
                ?.split('@')[0];
              if (!name) {
                throw new Error('No username found in headers');
              }
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
