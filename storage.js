
let objects = [];

let lastNumber = 0;

function generateObjectNumber() {
    lastNumber++;

    return "OBJ-" + String(lastNumber).padStart(6, "0");
}

export function createObject(userId, broker) {

    const now = new Date().toISOString();

    const object = {

        number: generateObjectNumber(),

        title: "Без названия",

        status: "Черновик",

        archived: false,

        createdAt: now,

        updatedAt: now,

        userId,

        broker,

        sections: {

            address: "",

            residentialComplex: "",

            objectType: "",

            ownersCount: "",

            owners: "",

            registered: "",

            area: "",

            rooms: "",

            floor: "",

            floors: "",

            entrance: "",

            intercom: "",

            elevator: "",

            kitchen: "",

            bathroom: "",

            repair: "",

            windows: "",

            heating: "",

            electricity: "",

            documents: "",

            comments: ""

        }

    };

    objects.push(object);

    return object;
}

export function getObjects(userId) {

    return objects.filter(x => x.userId === userId && !x.archived);

}

export function getObject(number) {

    return objects.find(x => x.number === number);

}

export function archiveObject(number) {

    const obj = getObject(number);

    if (obj) {

        obj.archived = true;

        obj.updatedAt = new Date().toISOString();

    }

}

export function duplicateObject(number) {

    const source = getObject(number);

    if (!source) return null;

    const copy = structuredClone(source);

    copy.number = generateObjectNumber();

    copy.status = "Черновик";

    copy.createdAt = new Date().toISOString();

    copy.updatedAt = copy.createdAt;

    objects.push(copy);

    return copy;

}
