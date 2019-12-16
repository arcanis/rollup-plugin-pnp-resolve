let pnp;

try {
  pnp = require(`pnpapi`);
} catch (error) {
  // not in PnP; not a problem
}

const path = require("path");

module.exports = (options) => ({
  name: `pnp`,
  resolveId: function (importee, importer) {
    if (!pnp) {
      return;
    }

    if (/\0/.test(importee)) {
      return null;
    }

    if (path.isAbsolute(importee)) {
      return null;
    }

    if (!importer) {
      return;
    }

    const resolved = pnp.resolveToUnqualified(importee, importer, options);

    if (!resolved) {
      return null;
    }

    return this.resolve(resolved, importer);
  },
});
