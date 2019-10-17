let pnp;

try {
  pnp = require(`pnpapi`);
} catch (error) {
  // not in PnP; not a problem
}

function getMainFields (options) {
	let mainFields;
	if (options.mainFields) {
		if ('module' in options || 'main' in options || 'jsnext' in options) {
			throw new Error(`node-resolve: do not use deprecated 'module', 'main', 'jsnext' options with 'mainFields'`);
		}
		mainFields = options.mainFields;
	} else {
		mainFields = [];
		[['module', 'module', true], ['jsnext', 'jsnext:main', false], ['main', 'main', true]].forEach(([option, field, defaultIncluded]) => {
			if (option in options) {
				// eslint-disable-next-line no-console
				console.warn(`node-resolve: setting options.${option} is deprecated, please override options.mainFields instead`);
				if (options[option]) {
					mainFields.push(field);
				}
			} else if (defaultIncluded) {
				mainFields.push(field);
			}
		});
	}
	if (options.browser && mainFields.indexOf('browser') === -1) {
		return ['browser'].concat(mainFields);
	}
	if ( !mainFields.length ) {
		throw new Error( `Please ensure at least one 'mainFields' value is specified` );
	}
	return mainFields;
}

module.exports = (options) => {

  const mainFields = getMainFields(options);

  return ({
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
      
      const location = pnp.resolveToUnqualified(importee, importer, {
        extensions: options.extensions,
      });
      /* 
       * intuitevly packageInformation points to @material-ui/core's package.json
       * but it returns the workspace root 
      const locator = pnp.findPackageLocator(location);
      const packageInformation = pnp.getPackageInformation(locator); */
      const packageJson = fse.readJsonSync(
        path.resolve(location, './package.json'),
      );
      
      // Guess which main field to use
      let overriddenMain = false;
      let overridenMainField = null;
      for ( let i = 0; i < mainFields.length; i++ ) {
        const field = mainFields[i];
        if ( typeof packageJson[ field ] === 'string' ) {
          overridenMainField = packageJson[ field ]
				  overriddenMain = true;
				  break;
			  }
		  }
      const mainField = overriddenMain ? overridenMainField : "main"
      
      const resolution = path.resolve(location, packageJson[mainField]);
      return resolution;
      //return pnp.resolveRequest(importee, importer, options);
    }
  })
};
