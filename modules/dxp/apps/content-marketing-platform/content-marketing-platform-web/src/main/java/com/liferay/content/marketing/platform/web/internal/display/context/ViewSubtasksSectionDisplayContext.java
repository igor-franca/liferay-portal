/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.content.marketing.platform.web.internal.display.context;

import com.liferay.asset.kernel.service.AssetTagLocalService;
import com.liferay.content.marketing.platform.web.internal.constants.CMPActionConstants;
import com.liferay.content.marketing.platform.web.internal.util.ActionUtil;
import com.liferay.content.marketing.platform.web.internal.util.CMPObjectEntryUtil;
import com.liferay.content.marketing.platform.web.internal.util.ObjectEntryUtil;
import com.liferay.depot.service.DepotEntryLocalService;
import com.liferay.frontend.data.set.model.FDSActionDropdownItem;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.CreationMenu;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.CreationMenuBuilder;
import com.liferay.list.type.service.ListTypeEntryLocalService;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectEntry;
import com.liferay.object.service.ObjectEntryService;
import com.liferay.object.service.ObjectFieldLocalService;
import com.liferay.object.service.ObjectStateFlowLocalService;
import com.liferay.object.service.ObjectStateLocalService;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.service.ClassNameLocalService;
import com.liferay.portal.kernel.service.RoleService;
import com.liferay.portal.kernel.util.MapUtil;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

/**
 * @author Igor Franca
 */
public class ViewSubtasksSectionDisplayContext
	extends BaseTasksSectionDisplayContext {

	public ViewSubtasksSectionDisplayContext(
		AssetTagLocalService assetTagLocalService,
		ClassNameLocalService classNameLocalService,
		ObjectDefinition cmpProjectObjectDefinition,
		ObjectDefinition cmpTaskObjectDefinition,
		DepotEntryLocalService depotEntryLocalService,
		HttpServletRequest httpServletRequest,
		ListTypeEntryLocalService listTypeEntryLocalService,
		ObjectEntryService objectEntryService,
		ObjectFieldLocalService objectFieldLocalService,
		ObjectStateFlowLocalService objectStateFlowLocalService,
		ObjectStateLocalService objectStateLocalService,
		RoleService roleService) {

		super(
			assetTagLocalService, classNameLocalService,
			cmpProjectObjectDefinition, cmpTaskObjectDefinition,
			depotEntryLocalService, httpServletRequest,
			listTypeEntryLocalService, objectEntryService,
			objectFieldLocalService, objectStateFlowLocalService,
			objectStateLocalService, roleService);
	}

	@Override
	public String getAPIURL() {
		return StringBundler.concat(
			"/o/search/v1.0/search?emptySearch=true&filter=(",
			"objectDefinitionId eq ", objectDefinition.getObjectDefinitionId(),
			" and cmpTaskCMPTaskId eq ", assetEntry.getClassPK(), ")",
			getNestedFieldsAPIURLParameters(
				"cmpProjectToCMPTasks", "cmpTaskToCMPTasks"));
	}

	@Override
	public Map<String, Object> getAdditionalProps() throws Exception {
		Map<String, Object> additionalProps = super.getAdditionalProps();

		additionalProps.remove("additionalAPIURLParameters");

		return additionalProps;
	}

	@Override
	public CreationMenu getCreationMenu() throws Exception {
		if (!hasAddObjectEntryPortletResourcePermission()) {
			return null;
		}

		ObjectEntry objectEntry = ObjectEntryUtil.getObjectEntry(
			httpServletRequest);

		return CreationMenuBuilder.addPrimaryDropdownItem(
			dropdownItem -> {
				dropdownItem.putData("action", CMPActionConstants.CREATE_TASK);
				dropdownItem.putData(
					"redirect",
					StringBundler.concat(
						ActionUtil.getAddTaskURL(
							objectEntry.getGroupId(), objectDefinition,
							MapUtil.getLong(
								objectEntry.getValues(),
								"r_cmpProjectToCMPTasks_c_cmpProjectId"),
							themeDisplay),
						"&parentId=", objectEntry.getObjectEntryId()));
				dropdownItem.setIcon("forms");
				dropdownItem.setLabel(
					LanguageUtil.get(httpServletRequest, "new-subtask"));
			}
		).build();
	}

	@Override
	public List<FDSActionDropdownItem> getFDSActionDropdownItems() {
		return getProjectTasksFDSActionDropdownItems(
			objectDefinition.getClassName());
	}

	public boolean isVisible() {
		ObjectEntry objectEntry = ObjectEntryUtil.getObjectEntry(
			httpServletRequest);

		return (objectEntry != null) &&
			   (CMPObjectEntryUtil.getDepth(objectEntry) < 2);
	}

}
