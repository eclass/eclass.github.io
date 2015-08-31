'use strict';

// Handlebars
import handlebars from 'handlebars';
import layouts from 'handlebars-layouts';
import _ from 'lodash';
// import errors from e('./errors'),

// assetPath
handlebars.registerHelper('assetPath', function(path, context) {
	return [context.data.root.rev[path]].join('/');
});

// Make handlebars layout helpers available
handlebars.registerHelper(layouts(handlebars));
