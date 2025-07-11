import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function MailIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M165-169q-31 0-53-22t-22-53v-472q0-31 22-53t53-22h630q31 0 53 22t22 53v472q0 31-22 53t-53 22H165Zm315-281q5 0 9.75-1.5t9.75-4l280.5-176q7-5 11-11.75t4-15.25q0-18.5-15.75-28.25t-32.75.75L480-519 213.5-686q-16-9.5-32.25-.5t-16.25 28q0 9 4.25 16t10.75 11l280.5 176q5 2.5 9.75 4T480-450Z"/></svg>
  );
}

export default MailIcon;