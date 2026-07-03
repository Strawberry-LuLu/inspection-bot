
export function createObject(userId, broker) {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),

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
}
