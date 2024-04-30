export const logObject = (label: string, object: any) => {
    if (object === undefined || object === null) {
        console.log(`${label}:`, object);
        return;
    }
    const stringified = JSON.stringify(object, null, 2);
    const maxChunkSize = 1000;
    for (let offset = 0; offset < stringified.length; offset += maxChunkSize) {
        const chunk = stringified.slice(offset, offset + maxChunkSize);
        console.log(`${label} (cont. ${offset / maxChunkSize})`, chunk);
    }
};
