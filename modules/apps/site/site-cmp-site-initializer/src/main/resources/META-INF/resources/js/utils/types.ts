import { AssigneeValue } from "@liferay/object-dynamic-data-mapping-form-field-type";
import { IAssetObjectEntry } from "@liferay/site-cms-site-initializer/src/main/resources/META-INF/resources/js/common/types/AssetType";

export interface ITaskSchema {
    description: string;
    image?: string;
    labels?: any[];
    link?: string;
    sticker?: string;
    symbol: string;
    title: string;
}

export interface IColumn {
  key: string;
  name: string;
  tasks: ITask[];
}

export interface IKanbanState {
  'not-started': IColumn;
  'in-progress': IColumn;
  'completed': IColumn;
  'blocked': IColumn;
}

interface ICreator {
    additionalName: string;
    contentType: string;
    externalReferenceCode: string;
    familyName: string;
    givenName: string;
    id: number
    name: string;
}

export interface IProjectObjectEntry {
    creator: ICreator;
    dateCreated: string;
    dateModified: string;
    defaultLanguageId: string;
    description: string;
    externalReferenceCode: string;
    friendlyUrlPath: string;
    id: number
    keywords: string[];
    objectEntryFolderExternalReferenceCode: string;
    objectEntryFolderId: number;
    scopeId: number;
    scopeKey: string;
    title: string;
}

export interface ITaskObjectEntry {
    assignTo: AssigneeValue
    cmpProjectToCMPTasks: IProjectObjectEntry;
    creator: ICreator;
    dateCreated: string;
    dateModified: string;
    defaultLanguageId: string;
    description: string;
    dueDate: string;
    externalReferenceCode: string;
    friendlyUrlPath: string;
    id: number
    keywords: string[];
    objectEntryFolderExternalReferenceCode: string;
    objectEntryFolderId: number;
    r_cmpProjectToCMPTasks_c_cmpProject: any;
    r_cmpProjectToCMPTasks_c_cmpProjectERC: string;
    r_cmpProjectToCMPTasks_c_cmpProjectId: number
    scopeId: number;
    scopeKey: string;
    state: {
        key: string;
        name: string;
    }
    status: {
        code: number;
        label: string;
        label_i18n: string;
    }
    systemProperties: {
        scope: {
            externalReferenceCode: string;
            type: string;
        }
        version: {
           number: number;
        }
    }
    title: string;
}

export interface ITask {
    actions: {
        [action: string]: {
            href: string;
            method: string | 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
        };
    };
    dateCreated: string;
    dateModified: string;
    embedded: ITaskObjectEntry;
    entryClassName: string;
    score: number
}