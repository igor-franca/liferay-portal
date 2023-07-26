import { sub } from 'frontend-js-web';
import React from 'react';
import {ClayButtonWithIcon} from '@clayui/button';

import './RightSidebarObjectRelationship.scss'
import { Input, InputLocalized, SingleSelect } from '@liferay/object-js-components-web';
import { useFolderContext } from '../objectFolderContext';
import { firstLetterUppercase } from '../../../utils/string';
import {TDeletionType} from '../../ObjectRelationship/EditRelationship';

interface RightSidebarObjectRelationshipProps{
	deletionTypes: TDeletionType[];
}

export function RightSidebarObjectRelationship({
	deletionTypes,
}: RightSidebarObjectRelationshipProps) {
	const [{selectedDefinitionNode, selectedObjectRelationship}] = useFolderContext();

	const readOnly = !selectedDefinitionNode.hasUpdateObjectDefinitionPermission || selectedObjectRelationship.reverse;
    return (
        <>
            <div className="lfr-objects__model-builder-right-sidebar-relationship-title-container">
				<div className="lfr-objects__model-builder-right-sidebar-relationship-title">
					<span>
						{sub(
							Liferay.Language.get('x-details'),
							Liferay.Language.get('relationship')
						)}
					</span>
				</div>

				<ClayButtonWithIcon
					aria-label={Liferay.Language.get('delete-relationship')}
					displayType="secondary"
					symbol="trash"
					title={Liferay.Language.get('delete-relationship')}
				/>
			</div>

			<div className="lfr-objects__model-builder-right-sidebar-relationship-content">
				<InputLocalized
					disableFlag={readOnly}
					disabled={readOnly}
					error={''}
					label={Liferay.Language.get('label')}
					onChange={() => {}}
					required
					translations={selectedObjectRelationship.label as LocalizedValue<string>}
				/>

				<Input
					disabled={readOnly}
					error={''}
					label={Liferay.Language.get('name')}
					onChange={() => {}}
					required
					value={selectedObjectRelationship.name}
				/>

				<Input
					disabled={readOnly}
					error={''}
					label={selectedObjectRelationship.type === 'manyToMany' ? Liferay.Language.get('many-records-of') : Liferay.Language.get('one-record-of')}
					onChange={() => {}}
					required
					value={selectedDefinitionNode.name}
				/>

				<Input
					disabled={readOnly}
					error={''}
					label={Liferay.Language.get('many-records-of')}
					onChange={() => {}}
					required
					value={selectedObjectRelationship.objectDefinitionName2}
				/>

				<SingleSelect
					disabled={readOnly}
					label={Liferay.Language.get('deletion-type')}
					onChange={() => {}}
					options={deletionTypes}
					required
					value={firstLetterUppercase(selectedObjectRelationship.deletionType as string)}
				/>
			</div>
        </>
    )
}