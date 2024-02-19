/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
type Locale =
	| 'ar_SA'
	| 'ca_ES'
	| 'de_DE'
	| 'en_US'
	| 'es_ES'
	| 'fi_FI'
	| 'fr_FR'
	| 'hu_HU'
	| 'nl_NL'
	| 'ja_JP'
	| 'pt_BR'
	| 'sv_SE'
	| 'zh_CN'
	| 'zh_Hans_CN'
	| 'zh_Hant_TW'
	| 'zh_TW';

type FullyLocalizedValue<T> = {[key in Locale]: T};
type LocalizedValue<T> = Partial<FullyLocalizedValue<T>>;
