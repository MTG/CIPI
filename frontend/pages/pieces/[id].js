import { useRouter } from 'next/router'

export default ({}) => {
    const {id} = useRouter()?.query
    return <div>
        Here will go the page for piece: {id}
    </div>
}