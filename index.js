let pnp;
const fs = require("fs");
const path = require("path");
try {
  pnp = require(`pnpapi`);
} catch (error) {
  // not in PnP; not a problem
}

function getMainFields(options) {
  let mainFields;
  if (options.mainFields) {
    if ("module" in options || "main" in options || "jsnext" in options) {
      throw new Error(
        `node-resolve: do not use deprecated 'module', 'main', 'jsnext' options with 'mainFields'`
      );
    }
    mainFields = options.mainFields;
  } else {
    mainFields = [];
    [
      ["module", "module", true],
      ["jsnext", "jsnext:main", false],
      ["main", "main", true]
    ].forEach(([option, field, defaultIncluded]) => {
      if (option in options) {
        // eslint-disable-next-line no-console
        console.warn(
          `node-resolve: setting options.${option} is deprecated, please override options.mainFields instead`
        );
        if (options[option]) {
          mainFields.push(field);
        }
      } else if (defaultIncluded) {
        mainFields.push(field);
      }
    });
  }
  if (options.browser && mainFields.indexOf("browser") === -1) {
    return ["browser"].concat(mainFields);
  }
  if (!mainFields.length) {
    throw new Error(
      `Please ensure at least one 'mainFields' value is specified`
    );
  }
  return mainFields;
}

module.exports = options => {
  const mainFields = getMainFields(options);

  return {
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

      try {

        // Get if importee is a scoped package, a normal package or a relative path
        const nameMatch = importee.match(/^((?<scopedName>@([^\/]+)\/([^\/]+))|(?<pathName>(\.*\/*)[^\/]*)|(?<basicName>[^\/]+))(\/(?<suffix>.+))?$/).groups; 
        
        const location = pnp.resolveToUnqualified(nameMatch.scopedName||nameMatch.pathName||nameMatch.basicName, importer, {
          extensions: options.extensions
        });

        let mainField=null;

        if(!nameMatch.suffix){

          const packageJson = JSON.parse(
            fs.readFileSync(path.resolve(location, "./package.json"))
          );

          // Guess which main field to use
          let overriddenMain = false;
          let overridenMainField = null;
          for (let i = 0; i < mainFields.length; i++) {
            const field = mainFields[i];
            if (typeof packageJson[field] === "string") {
              overridenMainField = packageJson[field];
              overriddenMain = true;
              break;
            }
          }
          mainField = overriddenMain ? overridenMainField : "main";
        } else {
          mainField = nameMatch.suffix
        }
        const resolution = path.resolve(location, mainField);
        return resolution;
        
      } catch (e) {
        console.log("Object.keys(pnp)");
        console.log(pnp.getPackageInformation(importee))
        throw "From " +
          importer +
          ", could not import " +
          importee +
          " located at " +
          pnp.resolveToUnqualified(importee, importer, {
            extensions: options.extensions
          });
      }
    }
  };
};
