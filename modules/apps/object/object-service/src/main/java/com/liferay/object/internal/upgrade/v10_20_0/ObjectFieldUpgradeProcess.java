/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.object.internal.upgrade.v10_20_0;

import com.liferay.object.constants.ObjectFieldConstants;
import com.liferay.object.constants.ObjectFieldSettingConstants;
import com.liferay.object.model.ObjectEntryTable;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.dao.orm.common.SQLTransformer;
import com.liferay.portal.kernel.dao.jdbc.AutoBatchPreparedStatementUtil;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.settings.LocalizedValuesMap;
import com.liferay.portal.kernel.upgrade.UpgradeProcess;
import com.liferay.portal.kernel.upgrade.UpgradeProcessFactory;
import com.liferay.portal.kernel.upgrade.util.UpgradeProcessUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.LocalizationUtil;
import com.liferay.portal.kernel.uuid.PortalUUIDUtil;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * @author Jhosseph Gonzalez
 */
public class ObjectFieldUpgradeProcess extends UpgradeProcess {

	@Override
	protected void doUpgrade() throws Exception {
		try (PreparedStatement preparedStatement1 = connection.prepareStatement(
				SQLTransformer.transform(
					StringBundler.concat(
						"select ObjectDefinition.companyId, ",
						"ObjectDefinition.dbTableName, ",
						"ObjectDefinition.objectDefinitionId, ",
						"ObjectDefinition.userName, ObjectDefinition.userId, ",
						"ObjectDefinition.system_ from ObjectDefinition where ",
						"ObjectDefinition.objectDefinitionId not in (select ",
						"distinct ObjectField.objectDefinitionId from ",
						"ObjectField where ObjectField.name in",
						"('displaydate', 'expirationDate','reviewdate'))")));
			PreparedStatement preparedStatement2 =
				AutoBatchPreparedStatementUtil.concurrentAutoBatch(
					connection,
					StringBundler.concat(
						"insert into ObjectField (mvccVersion, uuid_, ",
						"objectFieldId, companyId, userId, userName, ",
						"createDate, modifiedDate, externalReferenceCode, ",
						"listTypeDefinitionId, objectDefinitionId, ",
						"businessType, dbColumnName, dbTableName, dbType, ",
						"indexed, indexedAsKeyword, indexedLanguageId, label, ",
						"name, relationshipType, required, state_, system_, ",
						"readOnlyConditionExpression, readOnly, localized) ",
						"values (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ",
						"?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"));
			ResultSet resultSet = preparedStatement1.executeQuery()) {

			while (resultSet.next()) {
				long companyId = resultSet.getLong("companyId");
				String dbTableName = resultSet.getString("dbTableName");
				long objectDefinitionId = resultSet.getLong(
					"objectDefinitionId");
				long userId = resultSet.getLong("userId");
				String userName = resultSet.getString("userName");

				Locale defaultLocale = LocaleUtil.fromLanguageId(
					UpgradeProcessUtil.getDefaultLanguageId(companyId));

				Timestamp now = new Timestamp(System.currentTimeMillis());

				if (!resultSet.getBoolean("system_")) {
					dbTableName = "ObjectEntry";
				}

				_insertObjectField(
					preparedStatement2, companyId, userId, userName, now,
					objectDefinitionId,
					ObjectFieldConstants.BUSINESS_TYPE_DATE_TIME,
					ObjectEntryTable.INSTANCE.displayDate.getName(),
					dbTableName, ObjectFieldConstants.DB_TYPE_DATE_TIME,
					LocalizationUtil.getXml(
						new LocalizedValuesMap() {
							{
								put(
									defaultLocale,
									LanguageUtil.get(
										defaultLocale, "display-date"));
							}
						},
						"Label"),
					"displayDate");

				_insertObjectField(
					preparedStatement2, companyId, userId, userName, now,
					objectDefinitionId,
					ObjectFieldConstants.BUSINESS_TYPE_DATE_TIME,
					ObjectEntryTable.INSTANCE.expirationDate.getName(),
					dbTableName, ObjectFieldConstants.DB_TYPE_DATE_TIME,
					LocalizationUtil.getXml(
						new LocalizedValuesMap() {
							{
								put(
									defaultLocale,
									LanguageUtil.get(
										defaultLocale, "expiration-date"));
							}
						},
						"Label"),
					"expirationDate");

				_insertObjectField(
					preparedStatement2, companyId, userId, userName, now,
					objectDefinitionId,
					ObjectFieldConstants.BUSINESS_TYPE_DATE_TIME,
					ObjectEntryTable.INSTANCE.reviewDate.getName(), dbTableName,
					ObjectFieldConstants.DB_TYPE_DATE_TIME,
					LocalizationUtil.getXml(
						new LocalizedValuesMap() {
							{
								put(
									defaultLocale,
									LanguageUtil.get(
										defaultLocale, "review-date"));
							}
						},
						"Label"),
					"reviewDate");

				preparedStatement2.executeBatch();

				try (PreparedStatement preparedStatement3 =
						AutoBatchPreparedStatementUtil.concurrentAutoBatch(
							connection,
							StringBundler.concat(
								"insert into ObjectFieldSetting",
								"(mvccVersion, uuid_, objectFieldSettingId, ",
								"companyId, userId, userName, createDate,",
								"modifiedDate, objectFieldId , name, value) ",
								"values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"))) {

					for (Long objectFieldId : _newlyInsertedObjectFieldIds) {
						preparedStatement3.setLong(1, 0);
						preparedStatement3.setString(
							2, PortalUUIDUtil.generate());
						preparedStatement3.setLong(3, increment());
						preparedStatement3.setLong(4, companyId);
						preparedStatement3.setLong(5, userId);
						preparedStatement3.setString(6, userName);
						preparedStatement3.setTimestamp(7, now);
						preparedStatement3.setTimestamp(8, now);
						preparedStatement3.setLong(9, objectFieldId);
						preparedStatement3.setString(
							10, ObjectFieldSettingConstants.NAME_TIME_STORAGE);
						preparedStatement3.setString(
							11,
							ObjectFieldSettingConstants.VALUE_CONVERT_TO_UTC);
						preparedStatement3.addBatch();
					}

					_newlyInsertedObjectFieldIds.clear();

					preparedStatement3.executeBatch();
				}
			}
		}

		UpgradeProcessFactory.addColumns(
			"ObjectDefinition", "enableObjectEntrySchedule BOOLEAN");
	}

	private void _insertObjectField(
			PreparedStatement preparedStatement, long companyId, long userId,
			String userName, Timestamp timestamp, long objectDefinitionId,
			String businessType, String dbColumnName, String dbTableName,
			String dbType, String label, String name)
		throws SQLException {

		preparedStatement.setLong(1, 0);

		String uuid = PortalUUIDUtil.generate();

		long fieldId = increment();

		preparedStatement.setString(2, uuid);
		preparedStatement.setLong(3, fieldId);
		preparedStatement.setLong(4, companyId);
		preparedStatement.setLong(5, userId);
		preparedStatement.setString(6, userName);
		preparedStatement.setTimestamp(7, timestamp);
		preparedStatement.setTimestamp(8, timestamp);
		preparedStatement.setString(9, uuid);
		preparedStatement.setLong(10, 0);
		preparedStatement.setLong(11, objectDefinitionId);
		preparedStatement.setString(12, businessType);
		preparedStatement.setString(13, dbColumnName);
		preparedStatement.setString(14, dbTableName);
		preparedStatement.setString(15, dbType);
		preparedStatement.setBoolean(16, true);
		preparedStatement.setBoolean(17, false);
		preparedStatement.setString(18, null);
		preparedStatement.setString(19, label);
		preparedStatement.setString(20, name);
		preparedStatement.setString(21, null);
		preparedStatement.setBoolean(22, false);
		preparedStatement.setBoolean(23, false);
		preparedStatement.setBoolean(24, true);
		preparedStatement.setString(25, null);
		preparedStatement.setBoolean(26, false);
		preparedStatement.setBoolean(27, false);

		preparedStatement.addBatch();

		_newlyInsertedObjectFieldIds.add(fieldId);
	}

	private final List<Long> _newlyInsertedObjectFieldIds = new ArrayList<>();

}