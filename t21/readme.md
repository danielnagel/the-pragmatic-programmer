# topic 21

script for converting yaml files into json files.

The used example yaml files are from the [yaml wikipedia article](https://en.wikipedia.org/wiki/YAML).

```bash
deno run start
```

## issues

keys as sequences aren't supported by the used yaml library, see `yaml/mixed.yaml`.