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
ObjectDefinitionsDetailsDisplayContext objectDefinitionsDetailsDisplayContext = (ObjectDefinitionsDetailsDisplayContext)request.getAttribute(ObjectWebKeys.OBJECT_DEFINITIONS_DETAILS_DISPLAY_CONTEXT);
ObjectDefinitionsFieldsDisplayContext objectDefinitionsFieldsDisplayContext = (ObjectDefinitionsFieldsDisplayContext)request.getAttribute(ObjectWebKeys.OBJECT_DEFINITIONS_FIELDS_DISPLAY_CONTEXT);

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
				"nonRelationshipObjectFieldsInfo", objectDefinitionsDetailsDisplayContext.getNonrelationshipObjectFieldsInfo()
			).put(
				"objectDefinitionId", objectDefinition.getObjectDefinitionId()
			).put(
				"objectFieldTypes", objectDefinitionsFieldsDisplayContext.getObjectFieldBusinessTypeMaps(false, locale)
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
				"workflowStatusJSONArray", LocalizedJSONArrayUtil.getWorkflowStatusJSONArray(locale)
			).build()
		%>'
	/>
</div>