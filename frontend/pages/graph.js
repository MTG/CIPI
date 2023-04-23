/* eslint react/jsx-handler-names: "off" */
import React, { useState } from 'react';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { RectClipPath } from '@visx/clip-path';
import genPhyllotaxis, {
  GenPhyllotaxisFunction,
  PhyllotaxisPoint,
} from '@visx/mock-data/lib/generators/genPhyllotaxis';
import { withTooltip, Tooltip } from '@visx/tooltip';

const bg = '#ffffff';
const points = [{
  x: 0,
  y: 0,
  bg: '#ff0000',
  tooltip: null,
  id: 1
},
{
  x: -2,
  y: +1,
  bg: '#666666',
  tooltip: {
    name: 'beethoven 2nd 7th'
  },
  id: 2
},
{
  x: -3,
  y: +2,
  bg: '#666666',
  tooltip: {
    name: 'beethoven 3nd 7th'
  },
  id: 3
},
{
  x: 2,
  y: -3,
  bg: '#666666',
  tooltip: {
    name: 'beethoven 4th 7th'
  },
  id: 4
},
{
  x: 3,
  y: -4,
  bg: '#666666',
  tooltip: {
    name: 'beethoven 5th 7th'
  },
  id: 5
},
{
  x: 3.5,
  y: -5,
  bg: '#666666',
  tooltip: {
    name: 'beethoven 8th 7th'
  },
  id: 6
}];

const initialTransform = (width, height) => ({
  scaleX: 20,
  scaleY: 20,
  translateX: width/2,
  translateY: height/2,
  skewX: 0,
  skewY: 0,
});

const ZoomI = ({ width, height }) => {
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [hoveringPiece, setHoveringPiece] = useState(null)

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();
  // If you don't want to use a Portal, simply replace `TooltipInPortal` below with
  // `Tooltip` or `TooltipWithBounds` and remove `containerRef`
  const { TooltipInPortal } = useTooltipInPortal({
    // use TooltipWithBounds
    detectBounds: true,
    // when tooltip containers are scrolled, this will correctly update the Tooltip position
    scroll: true,
  })
  const handleMouseOver = (event, datum) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum
    });
  };

  if (!width && !height) return <></>
  return (
    <>
      <Zoom
        width={width}
        height={height}
        scaleXMin={10}
        scaleXMax={50}
        scaleYMin={10}
        scaleYMax={50}
        initialTransformMatrix={initialTransform(width, height)}
      >
        {(zoom) => {
          const onDragStart = (e) => {
            hideTooltip()
            setSelectedPiece(null)
            setHoveringPiece(null)
            zoom.dragStart(e)
            if (selectedPiece) selectedPiece.bg = "#666666"
          }
          return <div className="relative">
            <svg
              width={width}
              height={height}
              className={ 'touch-none ' + (zoom.isDragging ? 'cursor-grabbing' : 'cursor-grab') }
              ref={zoom.containerRef}
                      
            >
              <RectClipPath id="zoom-clip" width={width} height={height} />
              <rect width={width} height={height} rx={14} fill={bg}  />
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
                {points.map((point, i) => {
                  const { x, y, bg } = point;
                  return <React.Fragment key={`dot-${i}`}>
                    <circle
                    className={point.tooltip && "cursor-pointer"}
                      cx={x}
                      cy={y}
                      r={0.5}
                      fill={point.tooltip === null? point.bg: selectedPiece === point ? '#222222': hoveringPiece === point? '#444444': '#666666'}
                     onClick={(e) => {
                      if (point.tooltip) {
                      setSelectedPiece(point)
                      handleMouseOver(e, point)
                      }
                    } }
                    onMouseOver={e => {
                      if (point.tooltip) {
                        setHoveringPiece(point)
                      }
                      
                    }}
                    onMouseLeave={e => {
                      if (point.tooltip){
                        setHoveringPiece(null)
                      }
                    }}
                    />
                  </React.Fragment>
                })}
                
              </g>
              
            </svg>

            {tooltipOpen && (
                <TooltipWithBounds
                  // set this to random so it correctly updates with parent bounds
                  key={Math.random()}
                  top={tooltipTop}
                  left={tooltipLeft}
                >
                  <strong>{tooltipData?.tooltip?.name}</strong>
                </TooltipWithBounds>
              )}
          </div>
        }}
      </Zoom>
    </>
  );
}

import { useTooltip, useTooltipInPortal, TooltipWithBounds } from '@visx/tooltip';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

export default function Example() {
    /*
    
    */
  return <div className="flex justify-center content-center h-screen w-screen bg-white">
      <div className="app-graph ">
          <ParentSize debounceTime={10}>
            {({ width: visWidth, height: visHeight }) => (
              <ZoomI width={visWidth} height={visHeight} />
            )}
          </ParentSize>
        </div>

      <style jsx>{`
        .app {
          display: flex;
          height: 100vh;
          width: 100vw;
          background-color: #ffffff;
        }
        .app-graph {
          display: flex;
          flex: 1;
          overflow: hidden;
          max-width: 100%;
          max-height: 100%;
        }
      `}</style>
    </div>
}