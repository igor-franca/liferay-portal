/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import fs from 'fs';
import {createRequire} from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

// Curated set of Clay icon symbols the widget actually renders. Keeping the
// bundled spritemap minimal (vs the full ~375 KB Clay sprite) is what makes
// shipping Clay icons on an agnostic embed cheap. When inside Liferay the
// portal spritemap is used instead (see getIconSpriteMap.ts).

const USED_SYMBOLS = [
	'check-circle-full',
	'comments',
	'exclamation-full',
	'magic',
	'order-arrow-right',
	'stars',
	'thumbs-down',
	'thumbs-up',
	'times',
];

const outDir = path.resolve('src/assets');
const outFile = path.join(outDir, 'icons.svg');

// Resolve the Clay spritemap through Node module resolution so it is found
// whether @clayui/css is installed locally or hoisted to the yarn workspace
// root. If it cannot be resolved (e.g. a pruned install), keep the committed
// src/assets/icons.svg rather than failing the build.

let source;

try {
	source = require.resolve('@clayui/css/lib/images/icons/icons.svg');
}
catch (error) {
	console.warn(
		'Clay spritemap not resolvable; keeping the committed src/assets/icons.svg'
	);

	process.exit(0);
}

const svg = fs.readFileSync(source, 'utf8');

const symbols = [];

for (const name of USED_SYMBOLS) {
	const match = svg.match(new RegExp(`<symbol id="${name}"[\\s\\S]*?</symbol>`));

	if (match) {
		symbols.push(match[0]);
	}
	else {
		throw new Error(`Icon symbol "${name}" not found in Clay spritemap`);
	}
}

fs.mkdirSync(outDir, {recursive: true});

fs.writeFileSync(
	outFile,
	`<svg xmlns="http://www.w3.org/2000/svg" style="display: none">${symbols.join(
		''
	)}</svg>`
);

console.log(
	`Wrote ${symbols.length} icons to ${path.relative(process.cwd(), outFile)}`
);
