# topic 21

## yamlToJson.ts

script for converting yaml files into json files.

The used example yaml files are from the [yaml wikipedia article](https://en.wikipedia.org/wiki/YAML).

```bash
deno run yamltosjon
```

### issues

Keys as sequences aren't supported by the used yaml library, see `yaml/mixed.yaml`.

## camelToSnake.ts

Lists all occurences of camelCase variables and replaces them by their snake case equivalent.
When used with option `--dry`, no file copies will be written. 

```bash
deno run cameltosnake [--dry] <fileNames>
```