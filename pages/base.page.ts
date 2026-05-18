import {Page} from "@playwright/test";

export class BasePage {

    constructor(protected readonly page: Page) {
        this.page = page;
    }


    async getTitle() {
        return this.page.title();
    }

    async getCurrentUrl() {
        return this.page.url();
    }

    context() {
        return this.page.context();
    }
}