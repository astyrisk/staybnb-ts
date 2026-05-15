import {Page} from "@playwright/test";

export class BasePage {

    constructor(protected readonly page: Page) {
        this.page = page;
    }


    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }

    async getTitle() {
        return this.page.title;
    }

    async getCurrentUrl() {
        return this.page.url();
    }

    context() {
        return this.page.context();
    }
}