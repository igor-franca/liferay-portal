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

import ClayButton from '@clayui/button';
import {ClayCheckbox} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayList from '@clayui/list';
import ClayModal, {useModal} from '@clayui/modal';
import {ManagementToolbarSearch} from '@liferay/object-js-components-web';
import {ManagementToolbar} from 'frontend-js-components-web';
import React, {useMemo, useState} from 'react';

import './ModalAddColumns.scss';

interface ModalAddColumnsProps {
	disableRequired?: boolean;
	disableRequiredChecked?: boolean;
	getLabel?: (label: ObjectField) => string;
	getName?: (name: ObjectField) => string;
	header?: string;
	items: ObjectField[];
	onSave?: (selected: ObjectField[]) => void;
	onVisibilityChange: (value: boolean) => void;
	selected: ObjectField[];
	title?: string;
}

interface ObjectFieldWithCheck extends ObjectField {
	checked: boolean;
}

export function ModalAddColumns({
	disableRequired,
	disableRequiredChecked,
	getLabel,
	getName,
	header,
	items,
	onSave,
	onVisibilityChange,
	selected,
	title,
}: ModalAddColumnsProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedItems, setSelectedItems] = useState(selected);

	const {observer, onClose} = useModal({
		onClose: () => onVisibilityChange(false),
	});

	const filteredItems = useMemo(() => {
		const loweredTerm = searchTerm.toLowerCase();
		const selectedIds = new Set(selectedItems.map(({id}) => id));

		const filtered: ObjectFieldWithCheck[] = [];
		items.forEach((item) => {
			if (getName?.(item).toLowerCase().includes(loweredTerm)) {
				filtered.push({
					...item,
					checked:
						disableRequired &&
						item.required &&
						!disableRequiredChecked
							? true
							: selectedIds.has(item.id),
				});
			}
		});

		return filtered;
	}, [
		disableRequired,
		disableRequiredChecked,
		getName,
		searchTerm,
		selectedItems,
		items,
	]);

	const toggleFieldCheckbox = (id: unknown, checked: boolean) => {
		let newSelectedItems: ObjectField[];
		if (checked) {
			const item = items.find((item) => item.id === id) as ObjectField;
			newSelectedItems = [...selectedItems, item];
		}
		else {
			newSelectedItems = selectedItems.filter((item) => item.id !== id);
		}

		setSelectedItems(newSelectedItems);
	};

	return items.length ? (
		<ClayModal
			className="lfr-object__object-view-modal-add-columns"
			observer={observer}
		>
			<ClayModal.Header>{header}</ClayModal.Header>

			<ClayModal.Body>
				<div className="lfr-object__object-view-modal-add-columns-selection-title">
					{title}
				</div>

				<ManagementToolbar.Container>
					<ManagementToolbar.ItemList>
						<ManagementToolbar.Item>
							<ClayCheckbox
								checked={items.length === selectedItems.length}
								indeterminate={
									!!selectedItems.length &&
									items.length !== selectedItems.length
								}
								onChange={() => {
									const requiredFields = selectedItems.filter(
										(item) => item.required
									);
									const newSelectedItems =
										items.length - requiredFields.length ===
										selectedItems.length -
											requiredFields.length
											? [...requiredFields]
											: [...items];

									setSelectedItems(newSelectedItems);
								}}
							/>
						</ManagementToolbar.Item>
					</ManagementToolbar.ItemList>

					<ManagementToolbarSearch
						query={searchTerm}
						setQuery={(query) => setSearchTerm(query)}
					/>
				</ManagementToolbar.Container>
			</ClayModal.Body>

			<ClayList className="lfr-object__object-view-modal-add-columns-list">
				{filteredItems.map((item, index) => (
					<ClayList.Item flex key={`list-item-${index}`}>
						<ClayCheckbox
							checked={!!item.checked}
							disabled={
								disableRequired &&
								item.required &&
								!disableRequiredChecked
							}
							label={getLabel?.(item) ?? getName?.(item)}
							onChange={() => {
								toggleFieldCheckbox(item.id, !item.checked);
							}}
						/>

						{disableRequired && item.required && (
							<span className="lfr-object__object-view-modal-add-columns-reference-mark">
								<ClayIcon symbol="asterisk" />
							</span>
						)}
					</ClayList.Item>
				))}
			</ClayList>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							displayType="primary"
							onClick={() => {
								onSave?.(selectedItems);
								onClose();
							}}
						>
							{Liferay.Language.get('save')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	) : null;
}
