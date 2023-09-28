/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.object.web.internal.object.definitions.portlet.action;

import com.liferay.object.constants.ObjectPortletKeys;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectField;
import com.liferay.object.model.ObjectValidationRule;
import com.liferay.object.model.ObjectValidationRuleSetting;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectFieldLocalService;
import com.liferay.object.service.ObjectValidationRuleLocalService;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.portlet.JSONPortletResponseUtil;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCResourceCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.ParamUtil;

import java.util.List;

import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Carolina Barbosa
 */
@Component(
	property = {
		"javax.portlet.name=" + ObjectPortletKeys.OBJECT_DEFINITIONS,
		"mvc.command.name=/object_definitions/get_object_field_delete_info"
	},
	service = MVCResourceCommand.class
)
public class GetObjectFieldDeleteInfoMVCResourceCommand
	extends BaseMVCResourceCommand {

	@Override
	protected void doServeResource(
			ResourceRequest resourceRequest, ResourceResponse resourceResponse)
		throws Exception {

		ObjectField objectField = _objectFieldLocalService.fetchObjectField(
			ParamUtil.getLong(resourceRequest, "objectFieldId"));

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.fetchObjectDefinition(
				objectField.getObjectDefinitionId());

		JSONPortletResponseUtil.writeJSON(
			resourceRequest, resourceResponse,
			JSONUtil.put(
				"objectFieldObjectValidationComposedKey",
				() -> _isObjectFieldValidationComposedKey(
					objectField, objectDefinition)
			).put(
				"showDeletionModal",
				() -> _shouldShowDeletionModal(objectDefinition, objectField)
			).put(
				"uniqueObjectFieldObjectDefinitionApproved",
				() -> _isUniqueObjectFieldObjectDefinitionApproved(
					objectDefinition, objectField)
			));
	}

	private boolean _isObjectFieldValidationComposedKey(
		ObjectField objectField, ObjectDefinition objectDefinition) {

		List<ObjectValidationRule> objectValidationRules =
			(List<ObjectValidationRule>)
				_objectValidationRuleLocalService.getObjectValidationRules(
					objectDefinition.getObjectDefinitionId(), true);

		if (objectValidationRules != null) {
			for (int i = 0; i < objectValidationRules.size(); i++) {
				if (objectValidationRules.get(
						i
					).getEngine(
					).equals(
						"composedKey"
					)) {

					List<ObjectValidationRuleSetting>
						objectValidationRuleSettings =
							objectValidationRules.get(
								i
							).getObjectValidationRuleSettings();

					for (int index = 0;
						 index < objectValidationRuleSettings.size(); index++) {

						if (objectField.getObjectFieldId() ==
								GetterUtil.getInteger(
									objectValidationRuleSettings.get(
										index
									).getValue())) {

							return true;
						}
					}
				}
			}
		}

		return false;
	}

	private boolean _isUniqueObjectFieldObjectDefinitionApproved(
		ObjectDefinition objectDefinition, ObjectField objectField) {

		if (!objectDefinition.isApproved() || objectDefinition.isSystem()) {
			return false;
		}

		int customObjectFieldsCount =
			_objectFieldLocalService.getObjectFieldsCount(
				objectField.getObjectDefinitionId(), false);

		if (customObjectFieldsCount <= 1) {
			return true;
		}

		return false;
	}

	private boolean _shouldShowDeletionModal(
		ObjectDefinition objectDefinition, ObjectField objectField) {

		if (objectDefinition.isApproved() &&
			!(_isObjectFieldValidationComposedKey(
				objectField, objectDefinition) ||
			  _isUniqueObjectFieldObjectDefinitionApproved(
				  objectDefinition, objectField))) {

			return true;
		}

		return false;
	}

	@Reference
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Reference
	private ObjectFieldLocalService _objectFieldLocalService;

	@Reference
	private ObjectValidationRuleLocalService _objectValidationRuleLocalService;

}