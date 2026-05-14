import {Page} from "@playwright/test";

export class BaseComponent {
    constructor(protected readonly page: Page) {
        this.page = page;
    }
}