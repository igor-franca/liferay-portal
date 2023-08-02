/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.object.service.impl;

import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectFolderItem;
import com.liferay.object.model.ObjectRelationship;
import com.liferay.object.relationship.util.ObjectRelationshipUtil;
import com.liferay.object.service.base.ObjectFolderItemLocalServiceBaseImpl;
import com.liferay.object.service.persistence.ObjectDefinitionPersistence;
import com.liferay.object.service.persistence.ObjectFolderItemPK;
import com.liferay.object.service.persistence.ObjectFolderPersistence;
import com.liferay.object.service.persistence.ObjectRelationshipPersistence;
import com.liferay.portal.aop.AopService;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.Validator;

import java.util.ArrayList;
import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Murilo Stodolni
 */
@Component(
	property = "model.class.name=com.liferay.object.model.ObjectFolderItem",
	service = AopService.class
)
public class ObjectFolderItemLocalServiceImpl
	extends ObjectFolderItemLocalServiceBaseImpl {

	@Override
	public ObjectFolderItem addObjectFolderItem(
			long objectDefinitionId, long objectFolderId, long userId,
			int positionX, int positionY)
		throws PortalException {

		_objectDefinitionPersistence.findByPrimaryKey(objectDefinitionId);

		_objectFolderPersistence.findByPrimaryKey(objectFolderId);

		ObjectFolderItem objectFolderItem = objectFolderItemPersistence.create(
			new ObjectFolderItemPK(objectDefinitionId, objectFolderId));

		User user = _userLocalService.getUser(userId);

		objectFolderItem.setCompanyId(user.getCompanyId());

		objectFolderItem.setUserId(userId);
		objectFolderItem.setUserName(user.getFullName());

		objectFolderItem.setPositionX(positionX);
		objectFolderItem.setPositionY(positionY);

		return objectFolderItemPersistence.update(objectFolderItem);
	}

	@Override
	public ObjectFolderItem deleteObjectFolderItem(
			long objectDefinitionId, long objectFolderId)
		throws PortalException {

		ObjectFolderItem objectFolderItem =
			objectFolderItemPersistence.findByPrimaryKey(
				new ObjectFolderItemPK(objectDefinitionId, objectFolderId));

		return objectFolderItemLocalService.deleteObjectFolderItem(
			objectFolderItem);
	}

	@Override
	public ObjectFolderItem deleteObjectFolderItem(
			ObjectFolderItem objectFolderItem)
		throws PortalException {

		ObjectDefinition objectDefinition =
			_objectDefinitionPersistence.findByPrimaryKey(
				objectFolderItem.getObjectDefinitionId());

		if (!_hasOnlyLinkedDefinition(
				objectDefinition, objectFolderItem.getObjectFolderId()) ||
			!objectDefinition.isLinkedDefinition(
				objectFolderItem.getObjectFolderId())) {

			return objectFolderItem;
		}

		return objectFolderItemPersistence.remove(objectFolderItem);
	}

	@Override
	public ObjectFolderItem deleteObjectFolderItem(
			ObjectFolderItemPK objectFolderItemPK)
		throws PortalException {

		ObjectFolderItem objectFolderItem =
			objectFolderItemPersistence.findByPrimaryKey(objectFolderItemPK);

		return objectFolderItemLocalService.deleteObjectFolderItem(
			objectFolderItem);
	}

	@Override
	public void deleteObjectFolderItemsByObjectDefinitionId(
		long objectDefinitionId) {

		List<ObjectFolderItem> objectFolderItems =
			objectFolderItemPersistence.findByObjectDefinitionId(
				objectDefinitionId);

		for (ObjectFolderItem objectFolderItem : objectFolderItems) {
			objectFolderItemPersistence.remove(objectFolderItem);
		}
	}

	@Override
	public void deleteObjectFolderItemsByObjectFolderId(long objectFolderId) {
		List<ObjectFolderItem> objectFolderItems =
			objectFolderItemPersistence.findByObjectFolderId(objectFolderId);

		for (ObjectFolderItem objectFolderItem : objectFolderItems) {
			objectFolderItemPersistence.remove(objectFolderItem);
		}
	}

	@Override
	public List<ObjectFolderItem> fetchObjectFolderItemsByObjectDefinitionId(
		long objectDefinitionId) {

		return objectFolderItemPersistence.findByObjectDefinitionId(
			objectDefinitionId);
	}

	@Override
	public List<ObjectFolderItem> fetchObjectFolderItemsByObjectFolderId(
		long objectFolderId) {

		return objectFolderItemPersistence.findByObjectFolderId(objectFolderId);
	}

	@Override
	public ObjectFolderItem getObjectFolderItem(
			long objectDefinitionId, long objectFolderId)
		throws PortalException {

		return objectFolderItemPersistence.findByPrimaryKey(
			new ObjectFolderItemPK(objectDefinitionId, objectFolderId));
	}

	@Override
	public ObjectFolderItem updateObjectFolderItem(
			long objectDefinitionId, long objectFolderId, int positionX,
			int positionY)
		throws PortalException {

		ObjectFolderItem objectFolderItem =
			objectFolderItemPersistence.findByPrimaryKey(
				new ObjectFolderItemPK(objectDefinitionId, objectFolderId));

		objectFolderItem.setPositionX(positionX);
		objectFolderItem.setPositionY(positionY);

		return objectFolderItemPersistence.update(objectFolderItem);
	}

	@Override
	public void updateObjectFolderItem(
			long objectDefinitionId, long newObjectFolderId,
			long oldObjectFolderId)
		throws PortalException {

		if (newObjectFolderId == oldObjectFolderId) {
			return;
		}

		ObjectDefinition objectDefinition =
			_objectDefinitionPersistence.findByPrimaryKey(objectDefinitionId);

		_updateObjectFolderItem(
			objectDefinitionId, newObjectFolderId, oldObjectFolderId,
			objectDefinition.getUserId());

		for (ObjectDefinition relatedObjectDefinition :
				_getRelatedObjectDefinitions(objectDefinition)) {

			_updateObjectFolderItem(
				relatedObjectDefinition.getObjectDefinitionId(),
				newObjectFolderId, oldObjectFolderId,
				objectDefinition.getUserId());
		}
	}

	private List<ObjectDefinition> _getRelatedObjectDefinitions(
		ObjectDefinition objectDefinition) {

		List<ObjectDefinition> relatedObjectDefinitions = new ArrayList<>();

		for (ObjectRelationship objectRelationship :
				ListUtil.concat(
					_objectRelationshipPersistence.findByODI1_R(
						objectDefinition.getObjectDefinitionId(), false),
					_objectRelationshipPersistence.findByODI2_R(
						objectDefinition.getObjectDefinitionId(), false))) {

			if (objectRelationship.isSelf()) {
				continue;
			}

			relatedObjectDefinitions.add(
				ObjectRelationshipUtil.getRelatedObjectDefinition(
					objectDefinition, objectRelationship));
		}

		return relatedObjectDefinitions;
	}

	private boolean _hasOnlyLinkedDefinition(
			ObjectDefinition objectDefinition, long objectFolderId)
		throws PortalException {

		for (ObjectDefinition relatedObjectDefinition :
				_getRelatedObjectDefinitions(objectDefinition)) {

			if (!relatedObjectDefinition.isLinkedDefinition(objectFolderId)) {
				return false;
			}
		}

		return true;
	}

	private void _updateObjectFolderItem(
			long objectDefinitionId, long newObjectFolderId,
			long oldObjectFolderId, long userId)
		throws PortalException {

		objectFolderItemLocalService.deleteObjectFolderItem(
			objectDefinitionId, oldObjectFolderId);

		if (Validator.isNotNull(
				objectFolderItemPersistence.fetchByPrimaryKey(
					new ObjectFolderItemPK(
						objectDefinitionId, newObjectFolderId)))) {

			return;
		}

		objectFolderItemLocalService.addObjectFolderItem(
			objectDefinitionId, newObjectFolderId, userId, 0, 0);
	}

	@Reference
	private ObjectDefinitionPersistence _objectDefinitionPersistence;

	@Reference
	private ObjectFolderPersistence _objectFolderPersistence;

	@Reference
	private ObjectRelationshipPersistence _objectRelationshipPersistence;

	@Reference
	private UserLocalService _userLocalService;

}