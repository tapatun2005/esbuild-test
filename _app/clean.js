import { deleteAsync } from 'del'

export const clean = async () => {
    return await deleteAsync(['dist'])
}

clean()