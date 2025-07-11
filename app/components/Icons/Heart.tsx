import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function HeartIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M480-156.5q-13.5 0-26.75-4.75T429.5-176l-63-57.5q-108-98.5-192.25-193T90-633q0-91 61-152t152-61q51.5 0 97.75 22.25T480-761q34-40.5 79.75-62.75T657-846q91 0 152 61t61 152q0 112-84 206.75T593.5-233.5l-63 57.5q-10.5 10-23.75 14.75T480-156.5Z"/></svg>
  );
}

export default HeartIcon;