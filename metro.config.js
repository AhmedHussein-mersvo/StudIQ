const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

function toMetroFileMapChange(eventsQueue) {
  const addedFiles = new Map();
  const modifiedFiles = new Map();
  const removedFiles = new Map();

  for (const event of eventsQueue) {
    const filePath = event.filePath;
    const canonicalPath = path.relative(__dirname, filePath);
    const metadata = event.metadata ?? {
      modifiedTime: Date.now(),
      size: 1,
      type: 'virtual',
    };

    if (event.type === 'add') {
      addedFiles.set(canonicalPath, metadata);
    } else if (event.type === 'delete') {
      removedFiles.set(canonicalPath, metadata);
    } else {
      modifiedFiles.set(canonicalPath, metadata);
    }
  }

  return {
    changes: {
      addedFiles,
      modifiedFiles,
      removedFiles,
    },
    rootDir: __dirname,
  };
}

function patchNativeWindChangeEmitter(metroConfig) {
  const enhanceMiddleware = metroConfig.server?.enhanceMiddleware;

  return {
    ...metroConfig,
    server: {
      ...metroConfig.server,
      enhanceMiddleware(middleware, metroServer) {
        metroServer
          .getBundler()
          .getBundler()
          .getDependencyGraph()
          .then((graph) => {
            const haste = graph._haste;

            if (!haste || haste.__nativewindChangeEmitterPatched) {
              return;
            }

            const emit = haste.emit.bind(haste);
            haste.emit = (eventName, payload, ...args) => {
              if (
                eventName === 'change' &&
                payload?.eventsQueue &&
                !payload.changes
              ) {
                return emit(
                  eventName,
                  toMetroFileMapChange(payload.eventsQueue),
                  ...args,
                );
              }

              return emit(eventName, payload, ...args);
            };
            haste.__nativewindChangeEmitterPatched = true;
          });

        return enhanceMiddleware
          ? enhanceMiddleware(middleware, metroServer)
          : middleware;
      },
    },
  };
}

const nativeWindConfig = withNativeWind(
  mergeConfig(getDefaultConfig(__dirname), config),
  {
    input: './global.css',
  },
);

module.exports = patchNativeWindChangeEmitter(nativeWindConfig);
