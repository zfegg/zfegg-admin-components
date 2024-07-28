import {ArrayProvider, Query} from "@moln/data-source";

export const data: Record<any, any>[] = []
for (let i = 1; i < 100; i++) {
    data.push({
        name: 'test' + i,
        barcode: i,
        group: i % 10,
        created_at: new Date('2021-01-' + (i % 30) + ' 01:01:01'),
        enabled: !(i % 2),
    })
}

export class Ar extends ArrayProvider {
    fetch(params: any): Promise<any> {

        const page = params?.page;
        const pageSize = params?.pageSize;

        let data = new Query(this.data);

        if (params?.sort) {
            data = data.order(params.sort)
        }
        if (params?.filter) {
            data = data.filter(params.filter)
        }

        if (!page || !pageSize) {
            return Promise.resolve({
                data: data.toArray(),
                total: this.data.length,
            });
        }

        return new Promise((resolve) => {
            const start = (page - 1) * pageSize;
            setTimeout(() => {
                console.log('data resolved')
                resolve({
                    data: data.range(start, pageSize).toArray(),
                    total: data.toArray().length,
                })
            }, 3000)
        })
    }
    async create(model: Partial<Record<string, any>>) {
        await delay(3000)
        return super.create(model);
    }
}

function delay(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    })
}

let groupEnum = new Map()
// let groupEnum: Record<any, any> = {}

for (let i = 0; i < 10; i++) {
    groupEnum.set(i, `@${i}`)
    // groupEnum[i] = `@${i}`
}
