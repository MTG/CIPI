import React, { useState } from 'react';
import { Zoom, applyMatrixToPoint } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { RectClipPath } from '@visx/clip-path';
import genPhyllotaxis, {
    GenPhyllotaxisFunction,
    PhyllotaxisPoint,
} from '@visx/mock-data/lib/generators/genPhyllotaxis';
import { withTooltip, Tooltip, useTooltip, TooltipWithBounds } from '@visx/tooltip';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useRouter } from 'next/router'
import Link from 'next/link'

const initialTransform = (width, height) => ({
    scaleX: 450,
    scaleY: 450,
    translateX: width / 2,
    translateY: height / 2,
    skewX: 0,
    skewY: 0,
});

const ZoomI = ({ width, height, pieces, selectedPiece, setSelectedPiece, bg = '#ffffff' }) => {
    const [hoveringPiece, setHoveringPiece] = useState(null)
    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip();
    const handleMouseOver = (event, piece) => {
        const coords = localPoint(event.target.ownerSVGElement, event);
        showTooltip({
            tooltipLeft: coords.x,
            tooltipTop: coords.y,
            tooltipData: piece
        });
    };

    if (!width && !height) return <></>
    return (
        <>
            <Zoom
                width={width}
                height={height}
                scaleXMin={220}
                scaleXMax={1000}
                scaleYMin={220}
                scaleYMax={1000}
                initialTransformMatrix={initialTransform(width, height)}
            >
                {(zoom) => {
                    const onDragStart = (e) => {
                        hideTooltip()
                        setHoveringPiece(null)
                        zoom.dragStart(e)
                        if (selectedPiece) selectedPiece.bg = "#666666"
                    }
                    return <div className="relative">
                        <svg
                            width={width}
                            height={height}
                            className={'touch-none ' + (zoom.isDragging ? 'cursor-grabbing' : 'cursor-grab')}
                            ref={zoom.containerRef}

                        >
                            <RectClipPath id="zoom-clip" width={width} height={height} />
                            <rect width={width} height={height} rx={14} fill={bg} />
                            <rect
                                width={width}
                                height={height}
                                rx={14}
                                fill="transparent"
                                onTouchStart={onDragStart}
                                onTouchMove={zoom.dragMove}
                                onTouchEnd={zoom.dragEnd}
                                onMouseDown={onDragStart}
                                onMouseMove={zoom.dragMove}
                                onMouseUp={zoom.dragEnd}
                                onMouseLeave={() => {
                                    if (zoom.isDragging) zoom.dragEnd();
                                }}
                            />
                            <g transform={zoom.toString()}>
                                {pieces.map((piece, i) => {
                                    const { difficulty, bg } = piece;
                                    const x = difficulty.x1 - 0.5;
                                    const y = 1 - difficulty.x2 - 0.5;
                                    return <React.Fragment key={`dot-${i}`}>
                                        <circle
                                            className={piece.title && "cursor-pointer"}
                                            cx={x}
                                            cy={y}
                                            r={0.025}
                                            fill={piece.title === null ? piece.bg : selectedPiece === piece ? '#dc2626' : hoveringPiece === piece ? '#444444' : '#666666'}
                                            onClick={(e) => {
                                                if (piece.title) {
                                                    setSelectedPiece(piece)
                                                }
                                            }}
                                            onMouseOver={e => {
                                                if (piece.title) {
                                                    setHoveringPiece(piece)
                                                    handleMouseOver(e, piece)
                                                }
                                            }}
                                            onMouseLeave={e => {
                                                if (piece.title) {
                                                    setHoveringPiece(null)
                                                }
                                                if (tooltipData === piece){
                                                    hideTooltip();
                                                }
                                            }}
                                        />
                                    </React.Fragment>
                                })}

                            </g>

                        </svg>

                        {tooltipOpen && (
                            <TooltipWithBounds top={tooltipTop} left={tooltipLeft}>
                                <div className="p-2" >
                                    <h2 className="font-medium text-lg">{tooltipData?.title}</h2>
                                    <h3 className="text-md">{tooltipData?.author}</h3>
                                </div>
                            </TooltipWithBounds>
                        )}
                    </div>
                }}
            </Zoom>
        </>
    );
}

const SelectedPieceCard = ({ selectedPiece }) => {
    const router = useRouter()
    return <div onClick={() => {
        if (selectedPiece === null) return;
        router.push(`/pieces/${selectedPiece?.id}`)
    }} className={`border p-4 rounded-md flex ${selectedPiece === null? '': 'cursor-pointer hover:bg-zinc-50'}`}>
        <div className={`grow ${selectedPiece === null? 'text-gray-400': ''}`}>
            
            <div className="flex mb-1">
                <div className={`rounded-full mr-2 mt-1.5 w-4 h-4 ${selectedPiece === null? 'bg-red-300': 'bg-red-600'}`}/>
                <div className="flex flex-col">
                    <span className="font-medium text-lg ">{selectedPiece?.title ?? 'Select a piece'}</span>
                    <span className="text-md">{selectedPiece?.author ?? '...'}</span>
                </div>
            </div>
            
        </div>
        <div className="">
            <button className={`grow-0 rounded-md text-white font-medium p-2  ${selectedPiece === null? 'bg-gray-300 cursor-default': 'cursor-pointer  bg-black hover:bg-gray-800 '}`}>
                Learn more
            </button>
        </div>
    </div>
}
export const GraphExplorer = ({ pieces }) => {
    const [selectedPiece, setSelectedPiece] = useState(null)
    
    return  <div className="flex flex-1 flex-col p-4 max-h-full overflow-hidden">
                <SelectedPieceCard selectedPiece={selectedPiece} />
                <div className="relative flex flex-1 max-w-full overflow-hidden my-2">
                    <ParentSize debounceTime={10}>
                        {({ width: vw, height: vh }) => (
                            <ZoomI width={vw} height={vh} pieces={pieces} selectedPiece={selectedPiece} setSelectedPiece={setSelectedPiece} />
                        )}
                    </ParentSize>
                    <span className="bottom-0 left-5 absolute underline underline-offset-4 text-gray-600">easier</span>
                    <span className="top-0 right-5 absolute underline underline-offset-4 text-gray-600">harder</span>
                </div>
            </div>
}
