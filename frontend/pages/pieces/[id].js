import { useRouter } from 'next/router'
import Head from 'next/head';
import { PieceGraph, grayscaleHex, mapRange } from '../../components/GraphExplorer'
import { PieceCard } from '@/components/PieceCard'
import React from 'react';
import { DifficultyBar } from '@/components/DifficultyBar';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import { API_HOST } from '@/config';
import { AuthContext } from '@/contexts/AuthContext';
import { useHasUserData } from '@/hooks/useHasUserData';
import Link from 'next/link'

const getPiece = async (id) => {
    const response = await fetch(`${API_HOST}/api/pieces/${id}`);
    const data = await response.json();
    return data.data;
}
const getPieces = async (id) => {
    const response = await fetch(`${API_HOST}/api/pieces/${id}/neighbors`);
    const body = await response.json();
    return body;
}

export const GraphExplorer = ({ pieces, id }) => {
    const [selectedPiece, setSelectedPiece] = useState(null)
    const getPieceColor = ({ piece, isHovered, isSelected }) => {
        const mappedDifficulty = 1 - mapRange((piece.difficulty.x1 + piece.difficulty.x2) / 2, -5, 5, 0.2, 0.7);
        if (isSelected) return '#dc2626';
        if (piece.id == id) return '#ffa19c';
        if (isHovered) return grayscaleHex(mappedDifficulty - 0.2);
        return grayscaleHex(mappedDifficulty);
    };
    return <div className="flex flex-1 flex-col p-4 max-h-full overflow-hidden">
        <PieceCard selectedPiece={selectedPiece} />
        <PieceGraph
            pieces={pieces}
            onSelectPiece={setSelectedPiece}
            selectedPiece={selectedPiece}
            getPieceColor={getPieceColor}
            isPieceSelectable={() => true}
            radius = {0.125}
            initZoom = {100}
        />
        </div>
}

export default function PiecePage ({}){
    const router = useRouter();
    const { id } = router.query;
    const hasData = useHasUserData();

    const [piece, setPiece] = useState(null);
    const [pieces, setPieces] = useState([]);

    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState('');

    const {requireLogin, credential} = useContext(AuthContext);

    useEffect(() => {
        if( id != undefined){
            getPieces(id).then(r => setPieces(r['array']))
        }
      }, [id]); 

    useEffect(() => {
        if( id != undefined){
            getPiece(id).then((r) => setPiece(r));
        }
    }, [id]);


    const handleUrl = () => {
        window.location.href = piece.url; 
    };
    const handleLike = async() => {
        requireLogin({ allowSkip: false }).then(isLoggedIn => {
            if (!isLoggedIn) return
            if (!hasData) return router.push('/survey')
                setLiked(!liked);
                setDisliked(false);
                setShowCommentBox(false);
                setComment('');
                const feedbackData = {
                    musicsheetid: id,
                    liked: !liked ? 1 : 0,
                    disliked: 0,
                    comment: ''
                };

            const response =  sendFeedbackData(credential, feedbackData);
        })
    };
    const handleDislike = async() => {requireLogin({ allowSkip: false }).then(isLoggedIn => {
        if (!isLoggedIn) return
        if(!hasData) return router.push('/survey')
        setDisliked(!disliked);
        setLiked(false);
        if (disliked) {
            setShowCommentBox(false);
            setComment('');
          }
          const feedbackData = {
            musicsheetid: id,
            liked: 0,
            disliked: !disliked ? 1 : 0,
            comment: ''
        };
        const response = sendFeedbackData(credential, feedbackData);
        
    })
    };
    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          handleCommentSubmit();
        }
    };

    const handleCommentSubmit = async() => {
        requireLogin({ allowSkip: false }).then(isLoggedIn => {
            if (!isLoggedIn) return
            if(!hasData) return router.push('/survey')
       
            const feedbackData = {
                musicsheetid: id,
                liked: 0,
                disliked: 0,
                comment: comment
            };
        
        
            const response = sendFeedbackData(credential, feedbackData);
        
    
        // Clear comment field
        setComment('');
        })
    };


    const sendFeedbackData = async (credential, data) => {
        const response = await fetch(`${API_HOST}/api/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication': `Bearer ${credential}`
          },
          body: JSON.stringify(data),
        });
        
        const result = await response.json();
        return result;
      };

    if( id == undefined || piece === null) return <></>
    return (
        <>
        <Head>
            <title>Can I Play It?</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.png" />
        </Head>
        
        <div className={'min-h-screen flex flex-col w-screen h-screen overflow-hidden p-2'}>

        <Link href="/"><div className={'ml-2 font-bold text-gray-600 text-center'} > CIPI </div></Link>
        
        <div className={'my-10 px-10 flex flex-1 flex-col'}>
            <div className={'ml-2 text-sm font-medium text-gray-600'}> {piece.author} </div>
            <div className={'ml-2 text-2xl font-bold'}>{piece.title}</div>

            <div className={'pt-5 ml-2 text-sm font-bold'}> Difficulty: {piece.normalized_difficulty} </div>
            <div className="ml-2 h-0 w-full bg-neutral-200 dark:bg-neutral-600">
                <DifficultyBar filled={piece.normalized_difficulty/9} />
            </div>
            <div className="pt-7 flex justify-center mt-2">
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
                    <div className="ml-2 p-2">
                    <input
                        type="text"
                        value={comment}
                        onChange={handleCommentChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a comment..."
                        disabled={!disliked}
                        className="rounded-md px-2 py-1 mr-1"
                        style={{ outline: 'none', boxShadow: 'none' }}

                    />
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
          
                <p className={`rounded-full ml-5 mt-6 w-3 h-3 bg-red-300`}/>
                <p className={'pt-5 ml-2 text-sm font-medioum text-gray-500 hover:underline'}>{piece.title} </p>
             </div>

             <div className="flex flex-1 justify-center content-center bg-white overflow-hidden">
                <GraphExplorer pieces={[piece,...pieces]} id = {id} />
             </div>

        </div>
    </div>
    <footer className="bg-white py-4 flex flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <img src="/UPFLogo.png" alt="GitHub Logo" className="h-10 mb-2" />
          <div className="text-gray-600 text-sm">
            <p className="mb-1">
              This is an Open Source project performed by a group of students from UPF.
            </p>
            <p className="mb-0">
              All collected data will be used for academic purposes only.
            </p>
          </div>
        </div>
        <a href="https://github.com/miquelvir/CIPI.git" target="_blank" rel="noopener noreferrer" className=" text-gray-600 text-sm block underline hover:text-blue-500">
          CIPI GitHub
        </a>    
      </footer>  
    </>
    );
}

