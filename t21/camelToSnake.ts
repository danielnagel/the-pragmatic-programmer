(() => {
  const fileNames = Deno.args;
  let isDryRun = false;
  if (fileNames[0] === "--dry") {
    fileNames.shift();
    isDryRun = true;
  }
  fileNames.forEach(async (fileName, index) => {
    let textFileContent = "";
    try {
      textFileContent = await Deno.readTextFile(fileName);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(
          `Can't open file '${fileName}'. Original message: ${e.message}`,
        );
      }
      console.log("usage: deno run cameltosnake [--dry] <fileName>");
    }
    if (!textFileContent) return;

    let newFileContent = "";
    const camelCaseRegex =
      /(const|let|var)\s[a-z]+((\d)|([A-Z0-9][a-z0-9]+))+([A-Z])?/g;
    const upperCaseRegex = /[A-Z]/g;
    const matchedVariableNames: {camelCase: string, snakeCase: string}[] = [];
    console.log(`Variables of file '${fileName}':`);
    textFileContent.split("\n").forEach((line, index) => {
      let newLine = line;
      let camelCaseMatch = null;
      while ((camelCaseMatch = camelCaseRegex.exec(line)) != null) {
        const matchedCamelCaseVariableName =
          line.substring(camelCaseMatch.index, camelCaseRegex.lastIndex).split(
            " ",
          )[1];
        let upperCaseMatch = null;
        let newVariableName = matchedCamelCaseVariableName;
        while (
          (upperCaseMatch = upperCaseRegex.exec(newVariableName)) != null
        ) {
          const matchedCharacter = newVariableName.charAt(upperCaseMatch.index);
          newVariableName = newVariableName.replace(
            matchedCharacter,
            `_${matchedCharacter.toLowerCase()}`,
          );
        }
        console.log(
          `line ${
            index + 1
          }: ${matchedCamelCaseVariableName} => ${newVariableName}`,
        );
        newLine = newLine.replace(
          matchedCamelCaseVariableName,
          newVariableName,
        );
        matchedVariableNames.push({camelCase: matchedCamelCaseVariableName, snakeCase: newVariableName});
      }
      matchedVariableNames.forEach(mvn => {
        newLine = newLine.replaceAll(mvn.camelCase, mvn.snakeCase)
      });
      newFileContent += `${newLine}\n`;
    });
    if (index + 1 < fileNames.length) {
      console.log("-----------------");
    }
    if (!isDryRun) {
      await Deno.mkdir("snakeCaseFiles", { recursive: true });
      const encoder = new TextEncoder();
      const data = encoder.encode(newFileContent);
      await Deno.writeFile(`snakeCaseFiles/${fileName}`, data);
    }
  });
})();
