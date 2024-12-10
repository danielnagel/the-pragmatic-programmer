/**
 * get source path from cli
 * create dir, if not existent
 * load yaml, write in json
 */
import {parseAllDocuments} from 'yaml';

const writeJson = async (path: string, json: any) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(json, null, 2));
    await Deno.writeFile(path, data);
}

(async () => {
    for await (const dirEntry of Deno.readDir(Deno.args[0])) {
        if(dirEntry.isFile && dirEntry.name.endsWith('.yaml')) {
            const path = `${Deno.args[0]}/${dirEntry.name}`
            const file = await Deno.readTextFile(path);
            const jsons = [];
            try {
                const documents = parseAllDocuments(file);
                jsons.push(...documents.map(d => d.toJSON()));
            } catch (e: unknown) {
                if(e instanceof Error) console.error(`Can't parse yaml file '${path}'. Original message: ${e.message}`)
            }
            if(jsons.length) {
                const outDir = 'json';
                const baseName = dirEntry.name.substring(0, dirEntry.name.indexOf('.yaml'));
                const path = `${outDir}/${baseName}`;
                await Deno.mkdir(outDir, {recursive: true});
                if(jsons.length === 1) {
                    await writeJson(`${path}.json`, jsons[0]);
                } else if(jsons.length > 1) {
                    jsons.forEach(async (json, index) => {
                        await writeJson(`${path}-${index}.json`, json);
                    })
                }
            }
        }
    }
})()