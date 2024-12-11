(async () => {
    let textFileContent = '';
    try {
        textFileContent = await Deno.readTextFile(Deno.args[0]);
    } catch(e: unknown) {
        if(e instanceof Error) console.error(`Can't open file '${Deno.args[0]}'. Original message: ${e.message}`);
        console.log('usage: deno run cameltosnake <fileName>')
    }
    if(!textFileContent) return;
    const regex = /(const|let|var)\s[a-z]+((\d)|([A-Z0-9][a-z0-9]+))+([A-Z])?/g;
    console.log(`Variables of file '${Deno.args[0]}':`);
    textFileContent.split('\n').forEach((line, index) => {
        let match = null;
        while ((match = regex.exec(line)) != null) {
            console.log(`line ${index+1}: ${line.substring(match.index, regex.lastIndex).split(' ')[1]}`);
        }
    });
})();