<%--
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */
--%>

<%@ include file="/init.jsp" %>

<%
String backURL = ParamUtil.getString(request, "backURL", String.valueOf(renderResponse.createRenderURL()));

ObjectDefinition objectDefinition = (ObjectDefinition)request.getAttribute(ObjectWebKeys.OBJECT_DEFINITION);
ObjectDefinitionsActionsDisplayContext objectDefinitionsActionsDisplayContext = (ObjectDefinitionsActionsDisplayContext)request.getAttribute(ObjectWebKeys.OBJECT_DEFINITIONS_ACTIONS_DISPLAY_CONTEXT);
ObjectDefinitionsDetailsDisplayContext objectDefinitionsDetailsDisplayContext = (ObjectDefinitionsDetailsDisplayContext)request.getAttribute(ObjectWebKeys.OBJECT_DEFINITIONS_DETAILS_DISPLAY_CONTEXT);
ObjectDefinitionsFieldsDisplayContext objectDefinitionsFieldsDisplayContext = (ObjectDefinitionsFieldsDisplayContext)request.getAttribute(ObjectWebKeys.OBJECT_DEFINITIONS_FIELDS_DISPLAY_CONTEXT);
ObjectDefinitionsLayoutsDisplayContext objectDefinitionsLayoutsDisplayContext = (ObjectDefinitionsLayoutsDisplayContext)request.getAttribute(ObjectWebKeys.OBJECT_DEFINITIONS_LAYOUTS_DISPLAY_CONTEXT);
ObjectDefinitionsViewsDisplayContext objectDefinitionsViewsDisplayContext = (ObjectDefinitionsViewsDisplayContext)request.getAttribute(ObjectWebKeys.OBJECT_DEFINITIONS_VIEWS_DISPLAY_CONTEXT);

portletDisplay.setShowBackIcon(true);
portletDisplay.setURLBack(backURL);

renderResponse.setTitle(LanguageUtil.format(request, "edit-x", objectDefinition.getLabel(locale, true), false));
%>

<liferay-portlet:resourceURL copyCurrentRenderParameters="<%= false %>" var="baseResourceURL" />

<div class="lfr-object__edit-object-definition">
	<react:component
		module="js/components/ObjectDefinition/EditObjectDefinition"
		props='<%=
			HashMapBuilder.<String, Object>put(
				"actionDropdownItems", objectDefinitionsActionsDisplayContext.getFDSActionDropdownItems()
			).put(
				"actionId", ObjectDefinitionsFDSNames.OBJECT_ACTIONS
			).put(
				"actionsApiURL", objectDefinitionsActionsDisplayContext.getAPIURL()
			).put(
				"actionsCreationMenu", objectDefinitionsActionsDisplayContext.getCreationMenu()
			).put(
				"backURL", ParamUtil.getString(request, "backURL", String.valueOf(renderResponse.createRenderURL()))
			).put(
				"baseResourceURL", String.valueOf(baseResourceURL)
			).put(
				"companyKeyValuePair", objectDefinitionsDetailsDisplayContext.getScopeKeyValuePairs("company")
			).put(
				"creationLanguageId", objectDefinition.getDefaultLanguageId()
			).put(
				"dbTableName", objectDefinition.getDBTableName()
			).put(
				"externalReferenceCode", objectDefinition.getExternalReferenceCode()
			).put(
				"fieldDropdownItems", objectDefinitionsFieldsDisplayContext.getFDSActionDropdownItems()
			).put(
				"fieldId", ObjectDefinitionsFDSNames.OBJECT_FIELDS
			).put(
				"fieldsApiURL", objectDefinitionsFieldsDisplayContext.getAPIURL()
			).put(
				"fieldsCreationMenu", objectDefinitionsFieldsDisplayContext.getCreationMenu(objectDefinition)
			).put(
				"filterOperators", LocalizedJSONArrayUtil.getFilterOperatorsJSONObject(locale)
			).put(
				"forbiddenChars", PropsUtil.getArray(PropsKeys.DL_CHAR_BLACKLIST)
			).put(
				"forbiddenLastChars", objectDefinitionsFieldsDisplayContext.getForbiddenLastCharacters()
			).put(
				"forbiddenNames", PropsUtil.getArray(PropsKeys.DL_NAME_BLACKLIST)
			).put(
				"hasPublishObjectPermission", objectDefinitionsDetailsDisplayContext.hasPublishObjectPermission()
			).put(
				"hasUpdateObjectDefinitionPermission", objectDefinitionsDetailsDisplayContext.hasUpdateObjectDefinitionPermission()
			).put(
				"isApproved", objectDefinition.isApproved()
			).put(
				"isDefaultStorageType", objectDefinition.isDefaultStorageType()
			).put(
				"label", LocalizationUtil.getLocalizationMap(objectDefinition.getLabel())
			).put(
				"layoutDropdownitems", objectDefinitionsLayoutsDisplayContext.getFDSActionDropdownItems()
			).put(
				"layoutFDSId", ObjectDefinitionsFDSNames.OBJECT_LAYOUTS
			).put(
				"layoutsApiURL", objectDefinitionsLayoutsDisplayContext.getAPIURL()
			).put(
				"layoutsCreationMenu", objectDefinitionsLayoutsDisplayContext.getCreationMenu()
			).put(
				"nonRelationshipObjectFieldsInfo", objectDefinitionsDetailsDisplayContext.getNonrelationshipObjectFieldsInfo()
			).put(
				"objectActionExecutors", objectDefinitionsActionsDisplayContext.getObjectActionExecutorsJSONArray()
			).put(
				"objectActionTriggers", objectDefinitionsActionsDisplayContext.getObjectActionTriggersJSONArray()
			).put(
				"objectDefinitionId", objectDefinition.getObjectDefinitionId()
			).put(
				"objectDefinitionsRelationshipsURL", objectDefinitionsActionsDisplayContext.getObjectDefinitionsRelationshipsURL()
			).put(
				"objectFieldTypes", objectDefinitionsFieldsDisplayContext.getObjectFieldBusinessTypeMaps(true, locale)
			).put(
				"pluralLabel", LocalizationUtil.getLocalizationMap(objectDefinition.getPluralLabel())
			).put(
				"portletNamespace", liferayPortletResponse.getNamespace()
			).put(
				"readOnly", !objectDefinitionsFieldsDisplayContext.hasUpdateObjectDefinitionPermission()
			).put(
				"readOnlySidebarElements", objectDefinitionsFieldsDisplayContext.getObjectCodeEditorElements()
			).put(
				"screenNavigationCategoryKey", ParamUtil.getString(request, "screenNavigationCategoryKey")
			).put(
				"shortName", objectDefinition.getShortName()
			).put(
				"sidebarElements", objectDefinitionsFieldsDisplayContext.getObjectCodeEditorElements()
			).put(
				"siteKeyValuePair", objectDefinitionsDetailsDisplayContext.getScopeKeyValuePairs("site")
			).put(
				"storageTypes", objectDefinitionsDetailsDisplayContext.getStoragesJSONArray()
			).put(
				"system", objectDefinition.isSystem()
			).put(
				"validateActionExpressionURL", objectDefinitionsActionsDisplayContext.getValidateExpressionURL()
			).put(
				"viewsApiURL", objectDefinitionsViewsDisplayContext.getAPIURL()
			).put(
				"viewsCreationMenu", objectDefinitionsViewsDisplayContext.getCreationMenu()
			).put(
				"viewsDropdownItems", objectDefinitionsViewsDisplayContext.getFDSActionDropdownItems()
			).put(
				"viewsFDSId", ObjectDefinitionsFDSNames.OBJECT_VIEWS
			).put(
				"workflowStatusJSONArray", LocalizedJSONArrayUtil.getWorkflowStatusJSONArray(locale)
			).build()
		%>'
	/>
</div>