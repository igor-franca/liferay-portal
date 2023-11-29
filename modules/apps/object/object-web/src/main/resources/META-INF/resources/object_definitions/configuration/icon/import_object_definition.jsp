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
		"body", Arrays.asList(LanguageUtil.format(request, "there-is-another-x-with-the-same-external-reference-code-as-the-imported-one", StringUtil.toLowerCase(LanguageUtil.get(request, "object-definition"))), LanguageUtil.format(request, "before-importing-the-new-x-you-may-want-to-back-up-its-entries-to-prevent-data-loss", StringUtil.toLowerCase(LanguageUtil.get(request, "object-definition"))), LanguageUtil.get(request, "do-you-want-to-proceed-with-the-import-process"))
	).put(
		"header", LanguageUtil.get(request, "update-existing-object-definition")
	).build();
	%>

	<react:component
		module="js/components/ModalImport"
		props='<%=
			HashMapBuilder.<String, Object>put(
				"apiURL", "/o/object-admin/v1.0/object-definitions/by-external-reference-code/"
			).put(
				"externalReferenceCodeFeedbackMessage", LanguageUtil.format(request, "unique-key-for-referencing-the-x", StringUtil.toLowerCase(LanguageUtil.get(request, "object-definition")))
			).put(
				"importURL",
				PortletURLBuilder.createActionURL(
					renderResponse
				).setActionName(
					"/object_definitions/import_object_definition"
				).setRedirect(
					currentURL
				).buildString()
			).put(
				"JSONInputId", "objectDefinitionJSON"
			).put(
				"nameMaxLength", ModelHintsConstants.TEXT_MAX_LENGTH
			).put(
				"portletNamespace", liferayPortletResponse.getNamespace()
			).put(
				"title", LanguageUtil.format(request, "import-x", "object-definition")
			).put(
				"warningModalText", warningModalText
			).build()
		%>'
	/>
</div>

<aui:script>
	function <portlet:namespace />openImportModal() {}

	Liferay.Util.setPortletConfigurationIconAction(
		'<portlet:namespace />importObjectDefinition',
		() => {
			Liferay.componentReady('<portlet:namespace />importModal').then(
				(importModal) => {
					importModal.open();
				}
			);
		}
	);
</aui:script>