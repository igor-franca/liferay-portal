/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.content.marketing.platform.web.internal.fragment.renderer;

import com.liferay.content.marketing.platform.web.internal.util.ObjectEntryUtil;
import com.liferay.fragment.renderer.FragmentRenderer;
import com.liferay.fragment.renderer.FragmentRendererContext;
import com.liferay.object.field.util.ObjectFieldUtil;
import com.liferay.object.model.ObjectEntry;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.portal.kernel.util.DateUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.MapUtil;
import com.liferay.portal.kernel.util.Validator;

import jakarta.servlet.http.HttpServletRequest;

import java.io.Serializable;

import java.util.Locale;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Igor Franca
 */
@Component(service = FragmentRenderer.class)
public class DueDateAlertComponentSectionFragmentRenderer
	extends BaseComponentSectionFragmentRenderer {

	@Override
	public String getCollectionKey() {
		return "sections";
	}

	@Override
	protected String getComponentName(HttpServletRequest httpServletRequest) {
		return "DueDateAlert";
	}

	@Override
	protected String getLabelKey() {
		return "due-date-alert";
	}

	@Override
	protected String getModuleName() {
		return "content-marketing-platform-web";
	}

	@Override
	protected Map<String, Object> getProps(
			FragmentRendererContext fragmentRendererContext,
			HttpServletRequest httpServletRequest)
		throws Exception {

		ObjectEntry objectEntry = ObjectEntryUtil.getObjectEntry(
			httpServletRequest);

		if (objectEntry == null) {
			return null;
		}

		ObjectEntry parentObjectEntry =
			_objectEntryLocalService.fetchObjectEntry(
				MapUtil.getLong(
					objectEntry.getValues(),
					"r_cmpTaskToCMPTasks_c_cmpTaskId"));

		if (parentObjectEntry == null) {
			return null;
		}

		Map<String, Serializable> values = parentObjectEntry.getValues();

		String dueDate = String.valueOf(values.get("dueDate"));

		if (Validator.isNull(dueDate)) {
			return null;
		}

		return HashMapBuilder.<String, Object>put(
			"parentDueDate",
			DateUtil.getDate(
				DateUtil.parseDate(
					ObjectFieldUtil.getDateTimePattern(dueDate), dueDate,
					Locale.US),
				"yyyy-MM-dd", Locale.US)
		).build();
	}

	@Reference
	private ObjectEntryLocalService _objectEntryLocalService;

}
