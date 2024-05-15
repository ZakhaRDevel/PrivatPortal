export class Model {
    constructor(data?: any) {
        if (data) {
            Object.keys(data).forEach((key) => {
                this[key] = data[key] || null;
            });
        }
    }

    static fromJson(data: any): any {
        const model: any = new this(data);

        return model;
    }

    static fromJsonArray(data: any[]): any[] {
        const models = [];

        if (data.length) {
            data.forEach((item) => {
                models.push(this.fromJson(item));
            });
        }

        return models;
    }
}
