# topic 21

## yamlToJson.ts

script for converting yaml files into json files.

The used example yaml files are from the [yaml wikipedia article](https://en.wikipedia.org/wiki/YAML).

```bash
deno run yamltosjon
```

### issues

keys as sequences aren't supported by the used yaml library, see `yaml/mixed.yaml`.
