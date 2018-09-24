let pnp;

try {
  pnp = require(`pnpapi`);
} catch (error) {
  // not in PnP; not a problem
}

module.exports = () => ({
  name: `pnp`,
  resolveId: (importee, importer) => {
    if (!pnp) {
      return;
    }

    if (/\0/.test(importee)) {
      return null;
    }

    if (!importer) {
      return;
    }

    return pnp.resolveRequest(importee, importer);
  },
});
