export const DifficultyBar = ({ filled }) => {
    return <div className="w-full bg-gray-200 h-5 my-2">
        <div className="bg-[#dc2626] h-5" style={{ width: `${Math.round(filled*100)}%` }}/>
    </div>
}