// src/js/Components/_Default.js
var imports = { "./Components/Component.js": "./V3i3D/Component.js", "./Components/Component2.js": "./V3i3D/Component2.js" };
var components = document.querySelectorAll("[data-component]");
for (let i = 0; i < components.length; i++) {
  const el = components[i];
  const value = el.dataset.component;
  const modules = value.split(" ").map((item) => item.trim());
  for (let name = 0; name < modules.length; name++) {
    import(imports[`./Components/${modules[name]}.js`]).then((Module) => {
      Module.default(el);
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }
}
//# sourceMappingURL=App.js.map
