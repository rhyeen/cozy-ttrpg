import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function HeartBrokenIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M481-141q-14 0-27.14-5-13.15-5-23.86-15-107-100.5-174-168.25T151.5-447q-37.5-50-50.75-89.75T87.5-620q0-90.95 63.27-154.23Q214.05-837.5 305-837.5q64.5 0 114 24.25T454.5-742L415-604.5q-5 18.43 5.91 32.72 10.91 14.28 29.59 14.28h72l-26 241q-1 8 6.34 9 7.35 1 9.3-6l72.36-241q5.5-18.5-5.68-33.25T549-602.5h-70.5l60-179q11-33.5 45.19-44.75T655-837.5q90.95 0 154.23 63.27Q872.5-710.95 872.5-620q0 41.5-15.25 82.75t-54 93.25Q764.5-392 699-324T532-161q-10.44 10-23.72 15T481-141Z"/></svg>
  );
}

export default HeartBrokenIcon;