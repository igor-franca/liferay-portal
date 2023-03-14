export default function propsTransformer({portletNamespace, ...otherProps}) {
    console.log('inicio prop transformer');

    const deactivateUsersEntries = () => {
        console.log('action dactivate user');
    };

    const deleteUserEntries = () => {
        console.log('action delete user');
    };

	return {
		...otherProps,
        onActionButtonClick: (event, {item}) => {
			const data = item?.data;

			const action = data?.action;

			if (action === 'deactivate') {
				deactivateUsersEntries();
			}
			else if (action === 'delete') {
				deleteUserEntries(data);
			}
		},
	};
}