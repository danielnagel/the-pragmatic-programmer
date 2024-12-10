/**
 * In diesem Programm sollen Addressbuchdaten (Name, Telefonnummer, Addresse) in einem binären Format gespeichert werden.
 * Diese sollen anschlißend in XML und JSON übersetzt werden.
 */

const textToBinary = (text: string) => {
    let binaryString = ''
    for(let i = 0; i < text.length; i++) {
        binaryString += text.charCodeAt(i).toString(2).padStart(8, '0');
    }
    return binaryString;
}

const binaryToText = (binary: string) => {
    if(binary.length%8 !== 0) throw new Error('Wrong binary format');
    let textString = '';
    for(let i = 0; i < binary.length; i+=8) {
        textString += String.fromCharCode(parseInt(binary.substring(i, i+8), 2));
    }
    return textString
}

const newAddressBookEntry = (name: string, phoneNumber: string, address: string) => {
    let binaryEntry = '';
    binaryEntry += textToBinary(`name=${name}`);
    binaryEntry += textToBinary(`phoneNumber=${phoneNumber}`);
    binaryEntry += textToBinary(`address=${address}`);
    return binaryEntry;
}

const getEntryIndices = (enriesString: string, startOfEntryString: string) => {
    const entryIndices = [enriesString.indexOf(startOfEntryString)];
    while(entryIndices[entryIndices.length - 1] >= 0) {
        entryIndices.push(enriesString.indexOf(startOfEntryString, entryIndices[entryIndices.length - 1] + startOfEntryString.length));
    }
    entryIndices.pop();
    return entryIndices;
}

const getDataFromEntry = (entry: string) => {
    const nameString = 'name=';
    const nameStringIndex = entry.indexOf(nameString);
    const phoneNumberString = 'phoneNumber=';
    const phoneNumberStringIndex = entry.indexOf(phoneNumberString);
    const addressString = 'address=';
    const addressStringIndex = entry.indexOf(addressString);
    const name = entry.substring(nameStringIndex + nameString.length, phoneNumberStringIndex)
    const phoneNumber = entry.substring(phoneNumberStringIndex + phoneNumberString.length, addressStringIndex)
    const address = entry.substring(addressStringIndex + addressString.length, entry.length);
    return {name, phoneNumber, address};
}

const binaryDataBaseToJson = (databaseBinary: string) => {
    const text = binaryToText(databaseBinary);
    const entryIndices = getEntryIndices(text, 'name=');
    return entryIndices.map((v, i) => getDataFromEntry(text.substring(v, i === entryIndices.length - 1 ? text.length : entryIndices[i + 1])));
}

const binaryDataBaseToXml = (databaseBinary: string) => {
    const database = binaryDataBaseToJson(databaseBinary);
    let xml = '<AddressBook>';
    database.forEach(d => {
        xml += '\n';
        xml += '\t<Entry>\n';
        xml += `\t\t<Name>${d.name}</Name>\n`;
        xml += `\t\t<PhoneNumber>${d.phoneNumber}</PhoneNumber>\n`;
        xml += `\t\t<Address>${d.address}</Address>\n`;
        xml += '\t</Entry>';
    })
    xml += '\n</AddressBook>'
    return xml;
}


const database: string[] = [];
database.push(newAddressBookEntry('daniel', '018723603', 'Neue Straße 96'));
database.push(newAddressBookEntry('kristina', '0097234069', 'Kleine Straße 77'));
database.push(newAddressBookEntry('goro', '017384927', 'Tokioplatz 8'));

const binaryDataBase = database.join('');
console.log('--- binary ---')
console.log(binaryDataBase);

const jsonDataBase = binaryDataBaseToJson(binaryDataBase)
console.log('--- json ---')
console.log(jsonDataBase);

const xmlDataBase = binaryDataBaseToXml(binaryDataBase);
console.log('--- xml ---')
console.log(xmlDataBase);