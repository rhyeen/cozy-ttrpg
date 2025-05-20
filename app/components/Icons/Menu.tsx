import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function MenuIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M167.5-248q-15.5 0-26.5-11t-11-26.5q0-15.5 11-26.5t26.5-11h625q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11h-625Zm0-195q-15.5 0-26.5-11t-11-26.5q0-15.5 11-26.5t26.5-11h625q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11h-625Zm0-195q-15.5 0-26.5-11t-11-26.5q0-15.5 11-26.5t26.5-11h625q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11h-625Z"/></svg>
  );
}

export default MenuIcon;