// Dynamically imported components
// This is a common function to import scripts dynamically based on data attrubite
// Example: <div data-component="{{ A component name that matches the component file name from js/Components folder }}">

const components = document.querySelectorAll("[data-component]");
for (let i = 0; i < components.length; i++) {
  const el = components[i];
  const value = el.dataset.component
  const modules = value.split(" ").map((item) => item.trim());

  for (let name = 0; name < modules.length; name++) {
    import(`./Components/${modules[name]}.js`)
      .then((Module) => {
        Module.default(el);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}