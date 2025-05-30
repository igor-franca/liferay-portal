/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.object.internal.upgrade.v10_20_0.test;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.object.constants.ObjectDefinitionConstants;
import com.liferay.object.field.builder.TextObjectFieldBuilder;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectField;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectFieldLocalService;
import com.liferay.object.test.util.ObjectDefinitionTestUtil;
import com.liferay.portal.kernel.cache.MultiVMPool;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.upgrade.UpgradeProcess;
import com.liferay.portal.test.log.LogCapture;
import com.liferay.portal.test.log.LoggerTestUtil;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;
import com.liferay.portal.test.rule.PermissionCheckerMethodTestRule;
import com.liferay.portal.upgrade.registry.UpgradeStepRegistrator;
import com.liferay.portal.upgrade.test.util.UpgradeTestUtil;
import com.liferay.portal.vulcan.util.LocalizedMapUtil;

import java.util.Collections;

import org.junit.Assert;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author Jhosseph Gonzalez
 */
@RunWith(Arquillian.class)
public class ObjectFieldUpgradeProcessTest {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new AggregateTestRule(
			new LiferayIntegrationTestRule(),
			PermissionCheckerMethodTestRule.INSTANCE);

	@Test
	public void testUpgrade() throws Exception {
		ObjectDefinition objectDefinition =
			ObjectDefinitionTestUtil.publishObjectDefinition(
				ObjectDefinitionTestUtil.getRandomName(),
				Collections.singletonList(
					new TextObjectFieldBuilder(
					).labelMap(
						LocalizedMapUtil.getLocalizedMap(
							RandomTestUtil.randomString())
					).name(
						"textObjectField"
					).build()),
				ObjectDefinitionConstants.SCOPE_COMPANY,
				TestPropsValues.getUserId());

		try (LogCapture logCapture = LoggerTestUtil.configureLog4JLogger(
				_CLASS_NAME, LoggerTestUtil.OFF)) {

			UpgradeProcess upgradeProcess = UpgradeTestUtil.getUpgradeStep(
				_upgradeStepRegistrator, _CLASS_NAME);

			upgradeProcess.upgrade();

			_multiVMPool.clear();
		}

		ObjectField displayDate = _objectFieldLocalService.getObjectField(
			objectDefinition.getObjectDefinitionId(), "displayDate");
		ObjectField expirationDate = _objectFieldLocalService.getObjectField(
			objectDefinition.getObjectDefinitionId(), "expirationDate");
		ObjectField reviewDate = _objectFieldLocalService.getObjectField(
			objectDefinition.getObjectDefinitionId(), "reviewDate");

		Assert.assertEquals("displayDate", displayDate.getName());
		Assert.assertEquals("expirationDate", expirationDate.getName());
		Assert.assertEquals("reviewDate", reviewDate.getName());

		ObjectDefinition userObjectDefinition =
			_objectDefinitionLocalService.getObjectDefinition(
				TestPropsValues.getCompanyId(), "User");

		displayDate = _objectFieldLocalService.getObjectField(
			userObjectDefinition.getObjectDefinitionId(), "displayDate");
		expirationDate = _objectFieldLocalService.getObjectField(
			userObjectDefinition.getObjectDefinitionId(), "expirationDate");
		reviewDate = _objectFieldLocalService.getObjectField(
			userObjectDefinition.getObjectDefinitionId(), "reviewDate");

		Assert.assertEquals("displayDate", displayDate.getName());
		Assert.assertEquals("expirationDate", expirationDate.getName());
		Assert.assertEquals("reviewDate", reviewDate.getName());
	}

	private static final String _CLASS_NAME =
		"com.liferay.object.internal.upgrade.v10_19_0." +
			"ObjectFieldUpgradeProcess";

	@Inject(
		filter = "component.name=com.liferay.object.internal.upgrade.registry.ObjectServiceUpgradeStepRegistrator"
	)
	private static UpgradeStepRegistrator _upgradeStepRegistrator;

	@Inject
	private MultiVMPool _multiVMPool;

	@Inject
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Inject
	private ObjectFieldLocalService _objectFieldLocalService;

}