import { $selector } from "../Helpers/selector"

import '../../css/app.scss'

const Component = (el) => {
    el.innerHTML = 'COMPONENT'
    $selector(el)
}

export default Component