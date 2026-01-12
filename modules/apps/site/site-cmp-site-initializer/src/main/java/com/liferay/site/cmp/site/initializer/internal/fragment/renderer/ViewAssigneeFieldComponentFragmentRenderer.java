/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.site.cmp.site.initializer.internal.fragment.renderer;

import com.liferay.fragment.renderer.FragmentRenderer;
import com.liferay.fragment.renderer.FragmentRendererContext;
import com.liferay.layout.display.page.LayoutDisplayPageObjectProvider;
import com.liferay.layout.display.page.constants.LayoutDisplayPageWebKeys;
import com.liferay.object.model.ObjectEntry;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.MapUtil;
import com.liferay.portal.kernel.util.WebKeys;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

import org.osgi.service.component.annotations.Component;

/**
 * @author Igor Franca
 */
@Component(service = FragmentRenderer.class)
public class ViewAssigneeFieldComponentFragmentRenderer
	extends BaseComponentSectionFragmentRenderer {

	@Override
	public String getCollectionKey() {
		return "assignee-field";
	}

	@Override
	protected String getComponentName() {
		return "Assignee";
	}

	@Override
	protected String getLabelKey() {
		return "assignee-field";
	}

	@Override
	protected String getModuleName() {
		return "object-dynamic-data-mapping-form-field-type";
	}

	@Override
	protected Map<String, Object> getProps(
			FragmentRendererContext fragmentRendererContext,
			HttpServletRequest httpServletRequest)
		throws Exception {

		return HashMapBuilder.<String, Object>put(
			"label", "Assignee"
		).put(
			"name", "ObjectField_r_userToCMPProjectSponsor_userId"
		).put(
			"searchURL",
			() -> {
				ThemeDisplay themeDisplay =
					(ThemeDisplay)httpServletRequest.getAttribute(
						WebKeys.THEME_DISPLAY);

				return themeDisplay.getPortalURL() + "/o/cmp/assignee-context/";
			}
		).put(
			"value",
			() -> {
				LayoutDisplayPageObjectProvider<?>
					layoutDisplayPageObjectProvider =
						(LayoutDisplayPageObjectProvider<?>)
							httpServletRequest.getAttribute(
								LayoutDisplayPageWebKeys.
									LAYOUT_DISPLAY_PAGE_OBJECT_PROVIDER);

				if (layoutDisplayPageObjectProvider == null) {
					return null;
				}

				Object displayObject =
					layoutDisplayPageObjectProvider.getDisplayObject();

				if (!(displayObject instanceof ObjectEntry)) {
					return null;
				}

				ObjectEntry objectEntry = (ObjectEntry)displayObject;

				return MapUtil.getString(objectEntry.getValues(), "assignee");
			}
		).put(
			"visible", true
		).build();
	}

}