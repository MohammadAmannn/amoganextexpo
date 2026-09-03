import React from 'react'
import Svg, {
  Circle,
  G,
  Path,
  Rect,
} from 'react-native-svg'

export function SystemModeSvg({ width = 100, height = 64 }: { width?: number; height?: number }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox='0 0 79.86 51.14'
      style={{ borderRadius: 6, overflow: 'hidden' }}
    >
      {/* Light Side */}
      <Rect x={0.53} y={0.5} width={78.83} height={50.14} rx={3.5} ry={3.5} fill='#d9d9d9' />
      <Path d='M22.88 0h52.97c2.21 0 4 1.79 4 4v43.14c0 2.21-1.79 4-4 4H22.88V0z' fill='#ecedef' />
      <Circle cx={6.7} cy={7.04} r={3.54} fill='#fff' />
      <Path d='M18.12 6.39h-5.87c-.6 0-1.09-.45-1.09-1s.49-1 1.09-1h5.87c.6 0 1.09.45 1.09 1s-.49 1-1.09 1zM16.55 9.77h-4.24c-.55 0-1-.45-1-1s.45-1 1-1h4.24c.55 0 1 .45 1 1s-.45 1-1 1z' fill='#fff' />
      <Path d='M18.32 17.37H4.59c-.69 0-1.25-.47-1.25-1.05s.56-1.05 1.25-1.05h13.73c.69 0 1.25.47 1.25 1.05s-.56 1.05-1.25 1.05z' fill='#fff' />
      <Path d='M15.34 21.26h-11c-.55 0-1-.41-1-.91s.45-.91 1-.91h11c.55 0 1 .41 1 .91s-.45.91-1 .91z' fill='#fff' />
      <Path d='M16.46 25.57H4.43c-.6 0-1.09-.44-1.09-.98s.49-.98 1.09-.98h12.03c.6 0 1.09.44 1.09.98s-.49.98-1.09.98z' fill='#fff' />

      {/* Light Charts */}
      <G fill='#c0c4c4'>
        <Rect x={33.36} y={19.73} width={2.75} height={3.42} rx={0.33} opacity={0.32} />
        <Rect x={29.64} y={16.57} width={2.75} height={6.58} rx={0.33} opacity={0.44} />
        <Rect x={37.16} y={14.44} width={2.75} height={8.7} rx={0.33} opacity={0.53} />
        <Rect x={41.19} y={10.75} width={2.75} height={12.4} rx={0.33} opacity={0.53} />
      </G>

      {/* Dark Split Overlay */}
      <Path
        d='M50 0h25.85c2.21 0 4 1.79 4 4v43.14c0 2.21-1.79 4-4 4H50V0z'
        fill='#0d1628'
        opacity={0.9}
      />
      <G fill='#2a62bc'>
        <Rect x={55} y={16.57} width={2.75} height={6.58} rx={0.33} opacity={0.6} />
        <Rect x={60} y={12.44} width={2.75} height={10.7} rx={0.33} opacity={0.8} />
        <Rect x={65} y={8.75} width={2.75} height={14.4} rx={0.33} opacity={0.9} />
      </G>
    </Svg>
  )
}

export function LightModeSvg({ width = 100, height = 64 }: { width?: number; height?: number }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox='0 0 79.86 51.14'
      style={{ borderRadius: 6, overflow: 'hidden' }}
    >
      <G fill='#d9d9d9'>
        <Rect x={0.53} y={0.5} width={78.83} height={50.14} rx={3.5} ry={3.5} />
      </G>
      <Path
        d='M22.88 0h52.97c2.21 0 4 1.79 4 4v43.14c0 2.21-1.79 4-4 4H22.88V0z'
        fill='#ecedef'
      />
      <Circle cx={6.7} cy={7.04} r={3.54} fill='#fff' />
      <Path
        d='M18.12 6.39h-5.87c-.6 0-1.09-.45-1.09-1s.49-1 1.09-1h5.87c.6 0 1.09.45 1.09 1s-.49 1-1.09 1zM16.55 9.77h-4.24c-.55 0-1-.45-1-1s.45-1 1-1h4.24c.55 0 1 .45 1 1s-.45 1-1 1z'
        fill='#fff'
      />
      <Path
        d='M18.32 17.37H4.59c-.69 0-1.25-.47-1.25-1.05s.56-1.05 1.25-1.05h13.73c.69 0 1.25.47 1.25 1.05s-.56 1.05-1.25 1.05z'
        fill='#fff'
      />
      <Path
        d='M15.34 21.26h-11c-.55 0-1-.41-1-.91s.45-.91 1-.91h11c.55 0 1 .41 1 .91s-.45.91-1 .91z'
        fill='#fff'
      />
      <Path
        d='M16.46 25.57H4.43c-.6 0-1.09-.44-1.09-.98s.49-.98 1.09-.98h12.03c.6 0 1.09.44 1.09.98s-.49.98-1.09.98z'
        fill='#fff'
      />
      <G fill='#c0c4c4'>
        <Rect x={33.36} y={19.73} width={2.75} height={3.42} rx={0.33} opacity={0.32} />
        <Rect x={29.64} y={16.57} width={2.75} height={6.58} rx={0.33} opacity={0.44} />
        <Rect x={37.16} y={14.44} width={2.75} height={8.7} rx={0.33} opacity={0.53} />
        <Rect x={41.19} y={10.75} width={2.75} height={12.4} rx={0.33} opacity={0.53} />
      </G>
    </Svg>
  )
}

export function DarkModeSvg({ width = 100, height = 64 }: { width?: number; height?: number }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox='0 0 79.86 51.14'
      style={{ borderRadius: 6, overflow: 'hidden' }}
    >
      <G fill='#1d2b3f'>
        <Rect x={0.53} y={0.5} width={78.83} height={50.14} rx={3.5} ry={3.5} />
      </G>
      <Path
        d='M22.88 0h52.97c2.21 0 4 1.79 4 4v43.14c0 2.21-1.79 4-4 4H22.88V0z'
        fill='#0d1628'
      />
      <Circle cx={6.7} cy={7.04} r={3.54} fill='#426187' />
      <Path
        d='M18.12 6.39h-5.87c-.6 0-1.09-.45-1.09-1s.49-1 1.09-1h5.87c.6 0 1.09.45 1.09 1s-.49 1-1.09 1zM16.55 9.77h-4.24c-.55 0-1-.45-1-1s.45-1 1-1h4.24c.55 0 1 .45 1 1s-.45 1-1 1z'
        fill='#426187'
      />
      <Path
        d='M18.32 17.37H4.59c-.69 0-1.25-.47-1.25-1.05s.56-1.05 1.25-1.05h13.73c.69 0 1.25.47 1.25 1.05s-.56 1.05-1.25 1.05z'
        fill='#426187'
      />
      <Path
        d='M15.34 21.26h-11c-.55 0-1-.41-1-.91s.45-.91 1-.91h11c.55 0 1 .41 1 .91s-.45.91-1 .91z'
        fill='#426187'
      />
      <Path
        d='M16.46 25.57H4.43c-.6 0-1.09-.44-1.09-.98s.49-.98 1.09-.98h12.03c.6 0 1.09.44 1.09.98s-.49.98-1.09.98z'
        fill='#426187'
      />
      <G fill='#2a62bc'>
        <Rect x={33.36} y={19.73} width={2.75} height={3.42} rx={0.33} opacity={0.32} />
        <Rect x={29.64} y={16.57} width={2.75} height={6.58} rx={0.33} opacity={0.44} />
        <Rect x={37.16} y={14.44} width={2.75} height={8.7} rx={0.33} opacity={0.53} />
        <Rect x={41.19} y={10.75} width={2.75} height={12.4} rx={0.33} opacity={0.53} />
      </G>
    </Svg>
  )
}
