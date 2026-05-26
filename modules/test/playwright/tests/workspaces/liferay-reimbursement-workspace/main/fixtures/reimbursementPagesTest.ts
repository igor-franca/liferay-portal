import {test} from "@playwright/test"

import {HomePage} from "../pages/HomePage";
import {LoginPage} from "../../../liferay-customer-workspace/main/pages/LoginPage";
import {LogoutPage} from "../../../liferay-customer-workspace/main/pages/LogoutPage";

const reimbursementPagesTest = test.extend<{
	homePage: HomePage;
	loginPage: LoginPage;
	logoutPage: LogoutPage;
}>({
	homePage: async ({page}, use) => {
		await use(new HomePage(page));
	},
	loginPage: async ({page}, use) => {
		await use(new LoginPage(page));
	},
	logoutPage: async ({page}, use) => {
		await use(new LogoutPage(page));
	},
});

export {reimbursementPagesTest};