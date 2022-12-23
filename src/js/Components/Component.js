import { $selector } from "../Helpers/selector"

const Component = (el) => {
    el.innerHTML = 'COMPONENT'
    $selector(el)
}

export default Component