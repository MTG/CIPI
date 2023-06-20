import { useRouter } from 'next/router'
import Head from 'next/head';
import { PieceGraph } from '../../components/GraphExplorer';
import { PieceCard } from '@/components/PieceCard'
import React from 'react';
import { DifficultyBar } from '@/components/DifficultyBar';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { API_HOST } from '@/config'

const getPiece = async (id) => {
    const response = await fetch(`${API_HOST}/api/pieces/${id}`);
    const data = await response.json();
    console.log(data.data)
    return data.data;
}
const getPieces = async (id) => {
    const response = await fetch(`${API_HOST}/api/pieces/${id}/neighbors`);
    const body = await response.json();
    return body;
}

export const GraphExplorer = ({ pieces }) => {
    const [selectedPiece, setSelectedPiece] = useState(null)
    const getPieceColor = ({ piece, isHovered, isSelected }) => {
    const mappedDifficulty = 1 - mapRange((piece.normalized_difficulty) / 2, -5, 5, 0.2, 0.7);
    if (isSelected) return router.push(`/pieces/${piece.id}`);
    if (isHovered) return grayscaleHex(mappedDifficulty - 0.2);
    return grayscaleHex(mappedDifficulty);
    };
    return <div className="flex flex-1 flex-col p-4 max-h-full overflow-hidden">
        <PieceGraph
            pieces={pieces}
            onSelectPiece={setSelectedPiece}
            selectedPiece={selectedPiece}
            getPieceColor={getPieceColor}
            isPieceSelectable={() => true}
        />
        </div>
}


export default function PiecePage ({}){
    const router = useRouter();
    const { id } = router.query;
    const [pieces, setPieces] = useState([]);

    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState('');
    
    const [piece, setPiece] = useState([]);

    useEffect(() => {
        getPieces(id).then(r => setPieces(r['array']))
      }, []); 

    useEffect(() => {
        getPiece(id).then((r) => setPiece(r));
    }, [id]);

    const handleUrl = () => {
        window.location.href = piece.url; 
    };

    const handleLike = () => {
        setLiked(!liked);
        setDisliked(false);
        setShowCommentBox(false);
        setComment('');
    };
    const handleDislike = () => {
        setDisliked(!disliked);
        setLiked(false);
        if (disliked) {
            setShowCommentBox(false);
            setComment('');
          }
    };
    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // Process the comment here
        console.log('Submitted comment:', comment);
    };

    return (
        <>
        <Head>
            <title>Can I Play It?</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.png" />
        </Head>
        
        <div className={'min-h-screen flex flex-col w-screen h-screen overflow-hidden p-2'}>

        <div className={'ml-2 font-bold text-gray-600 text-center'} > CIPI </div>
        
        <div className={'my-10 items-center px-60'}>
            <div className={'ml-2 text-sm font-medium text-gray-600'}> {piece.author} </div>
            <div className={'ml-2 text-2xl font-bold'}>{piece.title}</div>

            <div className={'pt-5 ml-2 text-sm font-bold'}> Difficulty</div>
            <div className="ml-2 h-5 w-full bg-neutral-200 dark:bg-neutral-600">

            <DifficultyBar filled={piece.normalized_difficulty/10} />
                
            </div>
            <div className="flex justify-center mt-2">
                <button
                    className={`mr-2 ${
                    liked ? 'text-green-500' : 'text-gray-500'
                    }`}
                    onClick={handleLike}>
                    <FaThumbsUp size={20} />
                </button>
                <button
                    className={`ml-2 ${
                    disliked ? 'text-red-500' : 'text-gray-500'
                    }`}
                    onClick={handleDislike}>
                    <FaThumbsDown size={20} />
                </button>
                {disliked && (
                    <div className="ml-2 border rounded-md p-2">
                    <input
                        type="text"
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder="Add a comment..."
                        disabled={!disliked}
                        className="border border-gray-300 rounded-md px-2 py-1 mr-1"
                    />
                    <button className="bg-red-700 hover:bg-red-800 text-white rounded-md px-2 py-1" onClick={handleCommentSubmit}>+</button>
                    </div>
                )}
            </div>

            <div className={'pt-5 ml-2 text-sm font-bold'}> Time Period </div>
            <div className={'pb-5 ml-2 text-sm font-medium text-gray-600'}> {piece.period} </div>

            <button className="bg-black text-white rounded hover:bg-gray-800 text-white py-2 px-4 text-sm" onClick={handleUrl}>
                Download PDF
            </button>

            <hr className="border-t border-gray-500 my-4" />
        
            <div className="flex justify-center">
                <p className={'pt-5 ml-2 text-sm font-bold'}>Explore pieces of similar difficulty to: </p>
          
                <p className={`rounded-full ml-5 mt-6 w-3 h-3 bg-red-600`}/>
                <p className={'pt-5 ml-2 text-sm font-medioum text-gray-500 hover:underline'}>{piece.title} </p>
             </div>

             <div className="flex justify-center content-center flex-1 bg-white overflow-hidden">
                <GraphExplorer pieces={pieces} />
             </div>

        </div>
    </div>
    </>
    );
}

