import objectScan from 'object-scan';

const scanner = objectScan(['links.*[*]'], {
  filterFn: ({ value, parent, context }) => {
    if (!(value in context)) {
      context[value] = new Set();
    }
    parent
      .filter((v) => v !== value)
      .forEach((v) => context[value].add(v));
  }
});

export default (config) => scanner(config, {});
