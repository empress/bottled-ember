---
'buttered-ember': minor
---

Using templates with local directories as well as in-monorepo dependencies now in tested and works.

Support for using a template from a dependency is new though! 

To use a template from a dependency, which may be addon,
add a `template` directory. This allows a template to exist within an existing addon without changing anything that would affect ember consumption of that addon.

Then, in the root of your buttered ember project, specify in your 
`.buttered-emberrc.yaml` file (or any other compatible config name),
the name of the dependency to look for a `template` folder within.
```yml
template: "@nullvoxpopuli/docfy-template-provider"
```

Your `template` folder may contain a `package.json`, which then may add `dependencies` and `devDependencies` to the resulting buttered project.