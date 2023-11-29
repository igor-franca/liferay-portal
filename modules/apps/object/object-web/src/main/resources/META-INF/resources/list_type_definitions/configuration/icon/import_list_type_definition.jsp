<%--
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
--%>

<%@ include file="/init.jsp" %>

<div>

	<%
	Map<String, Object> warningModalText = HashMapBuilder.<String, Object>put(
		"body", Arrays.asList(LanguageUtil.format(request, "there-is-another-x-with-the-same-external-reference-code-as-the-imported-one", StringUtil.toLowerCase(LanguageUtil.get(request, "picklist"))), LanguageUtil.format(request, "before-importing-the-new-x-you-may-want-to-back-up-its-entries-to-prevent-data-loss", StringUtil.toLowerCase(LanguageUtil.get(request, "picklist"))), LanguageUtil.get(request, "do-you-want-to-proceed-with-the-import-process"))
	).put(
		"header", LanguageUtil.get(request, "update-existing-picklist")
	).build();
	%>

	<react:component
		module="js/components/ModalImport"
		props='<%=
			HashMapBuilder.<String, Object>put(
				"apiURL", "/o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/"
			).put(
				"externalReferenceCodeFeedbackMessage", LanguageUtil.get(request, "unique-key-for-referencing-the-picklist-definition")
			).put(
				"importURL",
				PortletURLBuilder.createActionURL(
					renderResponse
				).setActionName(
					"/list_type_definitions/import_list_type_definition"
				).setRedirect(
					currentURL
				).buildString()
			).put(
				"JSONInputId", "listTypeDefinitionJSON"
			).put(
				"nameMaxLength", ModelHintsConstants.TEXT_MAX_LENGTH
			).put(
				"portletNamespace", liferayPortletResponse.getNamespace()
			).put(
				"title", LanguageUtil.format(request, "import-x", "picklist")
			).put(
				"warningModalText", warningModalText
			).build()
		%>'
	/>
</div>

<aui:script>
	function <portlet:namespace />openImportModal() {}

	Liferay.Util.setPortletConfigurationIconAction(
		'<portlet:namespace />importListTypeDefinition',
		() => {
			Liferay.componentReady('<portlet:namespace />importModal').then(
				(importModal) => {
					importModal.open();
				}
			);
		}
	);
</aui:script>