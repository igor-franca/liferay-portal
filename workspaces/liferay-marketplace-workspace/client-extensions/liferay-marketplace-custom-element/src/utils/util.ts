import { TYPES } from '../manage-app-state/actionTypes';
import {createProductSpecification, createSpecification, getCatalogs, updateProductSpecification} from './api';

export async function getMasterCatalogId() {
	const response = await getCatalogs();

	const catalogs = response.items;

	return catalogs.find(({name}: {name: string}) => name === 'Master')?.id;
}

async function submitSpecification(appId: string, productId: number, productSpecificationId: number, key: string, title: string, value: string): Promise<number> {
    const dataSpecification = await createSpecification({
      body: {
        key: key,
        title: { en_US: title },
      },
    });
    if (productSpecificationId) {
      updateProductSpecification({
        body: {
          specificationKey: dataSpecification.key,
          value: { en_US: value },
        },
        id: productSpecificationId,
      });
  
      return -1;
    } else {
      const { id } = await createProductSpecification({
        body: {
          productId,
          specificationId: dataSpecification.id,
          specificationKey: dataSpecification.key,
          value: { en_US: value },
        },
        appId,
      });
  
      return id;
    }
  };

export async function saveSpecification(appId: string, productId: number, productSpecificationId: number, key: string, title: string, value: string, action: TYPES) {
    return await submitSpecification(appId, productId, productSpecificationId, key, title, value);
}

export async function submitFile(
	appERC: string,
	fileBase64: string,
	requestFunction: Function,
	title: string
) {
	const response = await requestFunction({
		body: {
			attachment: fileBase64,
			title: {en_US: title},
		},
		externalReferenceCode: appERC,
	});
	const file = await response.json();
}

export function submitBase64EncodedFile(
	appERC: string,
	file: File,
	requestFunction: Function,
	title: string
) {
	const reader = new FileReader();

	reader.addEventListener(
		'load',
		() => {
			let result = reader.result as string;

			if (result?.includes('application/zip')) {
				result = result?.substring(28);
			}
			else if (
				result?.includes('image/gif') ||
				result?.includes('image/png')
			) {
				result = result?.substring(22);
			}
			else if (result?.includes('image/jpeg')) {
				result = result?.substring(23);
			}

			if (result) {
				submitFile(appERC, result, requestFunction, title);
			}
		},
		false
	);

	reader.readAsDataURL(file);
}
