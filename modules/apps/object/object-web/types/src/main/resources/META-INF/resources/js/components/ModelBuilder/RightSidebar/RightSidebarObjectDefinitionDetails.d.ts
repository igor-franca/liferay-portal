/// <reference types="react" />

import './RightSidebarObjectDefinitionDetails.scss';
import {KeyValuePair} from '../../ObjectDetails/EditObjectDetails';
interface RightSidebarObjectDefinitionDetails {
	companyKeyValuePair: KeyValuePair[];
	siteKeyValuePair: KeyValuePair[];
}
export declare function RightSidebarObjectDefinitionDetails({
	companyKeyValuePair,
	siteKeyValuePair,
}: RightSidebarObjectDefinitionDetails): JSX.Element;
export {};
