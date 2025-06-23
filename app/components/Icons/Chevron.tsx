import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

interface ChevronIconProps extends IconProps {
  position: 'left' | 'right' | 'up' | 'down';
}

function ChevronIcon(props: ChevronIconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  let rotate = 0;
  if (props.position === 'up') {
    rotate = -90;
  } else if (props.position === 'down') {
    rotate = 90;
  } else if (props.position === 'left') {
    rotate = 180;
  } else if (props.position === 'right') {
    rotate = 0;
  }
  return (
    <svg
      style={{
        transform: `rotate(${rotate}deg)`,
        transition: 'all 0.2s ease-in-out',
      }}
      xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M506-480 351-635q-10.5-10.5-10.5-25.75T351-687q10.5-11 26-11.25t26.5 10.75l181 181q5.5 5.5 8.25 12.25T595.5-480q0 7.5-2.75 14.25t-8.25 12.25l-181 181q-11 11-26.5 10.75T351-273q-10.5-11-10.5-26.25T351-325l155-155Z"
    /></svg>
  );
}

export default ChevronIcon;