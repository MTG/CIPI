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
  tooltip: null
},
{
  x: -2,
  y: +1,
  bg: '#222222',
  tooltip: {
    name: 'beethoven 2nd 7th'
  }
},
{
  x: -3,
  y: +2,
  bg: '#222222',
  tooltip: {
    name: 'beethoven 3nd 7th'
  }
},
{
  x: 2,
  y: -3,
  bg: '#222222',
  tooltip: {
    name: 'beethoven 4th 7th'
  }
},
{
  x: 3,
  y: -4,
  bg: '#222222',
  tooltip: {
    name: 'beethoven 5th 7th'
  }
},
{
  x: 3.5,
  y: -5,
  bg: '#222222',
  tooltip: {
    name: 'beethoven 8th 7th'
  }
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
    console.log("alohaaa")
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
        {(zoom) => (
          <div className="relative">
            <svg
              width={width}
              height={height}
              style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
              ref={zoom.containerRef}
                      
            >
              <RectClipPath id="zoom-clip" width={width} height={height} />
              <rect width={width} height={height} rx={14} fill={bg}  />
              <rect
                width={width}
                height={height}
                rx={14}
                fill="transparent"
                onTouchStart={zoom.dragStart}
                onTouchMove={zoom.dragMove}
                onTouchEnd={zoom.dragEnd}
                onMouseDown={zoom.dragStart}
                onMouseMove={zoom.dragMove}
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd();
                }}
                onDoubleClick={(event) => {
                  const point = localPoint(event) || { x: 0, y: 0 };
                  zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                }}
              />
              <g transform={zoom.toString()}>
                {points.map((point, i) => {
                  const { x, y, bg } = point;
                  return <React.Fragment key={`dot-${i}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r={0.5}
                      fill={bg}
                      
              onMouseOver={e => {
                if (point.tooltip) {
                  point.bg = "#666666"
                  handleMouseOver(e, point)
                }
                
              }}
              onMouseLeave={e => {
                if (point.tooltip){
                  point.bg = '#222222'
                  hideTooltip()
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
        )}
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