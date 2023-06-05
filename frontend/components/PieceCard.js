import { useRouter } from 'next/router'

export const PieceCard = ({ selectedPiece }) => {
    const router = useRouter()
    const onGoToPiece = () => {
      if (selectedPiece === null) return;
      router.push(`/pieces/${selectedPiece?.id}`)
    };
    return <div onClick={onGoToPiece} className={`border p-4 rounded-md flex ${selectedPiece === null ? '' : 'cursor-pointer hover:bg-zinc-50'}`}>
      <div className={`grow ${selectedPiece === null ? 'text-gray-400' : ''}`}>
        <div className="flex mb-1">
          <div className={`rounded-full mr-2 mt-1.5 w-4 h-4 ${selectedPiece === null ? 'bg-red-300' : 'bg-red-600'}`} />
          <div className="flex flex-col">
            <span className="font-medium text-lg ">{selectedPiece?.title ?? 'Select a piece'}</span>
            <span className="text-md">{selectedPiece?.author ?? '...'}</span>
          </div>
        </div>
      </div>
      <div className="">
        <button className={`grow-0 rounded-md text-white font-medium p-2  ${selectedPiece === null ? 'bg-gray-300 cursor-default' : 'cursor-pointer  bg-black hover:bg-gray-800 '}`}>
          Learn more
        </button>
      </div>
    </div>
  }