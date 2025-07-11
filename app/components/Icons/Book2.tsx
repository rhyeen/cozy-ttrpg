import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function Book2Icon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M307.5-90Q250-90 210-130t-40-97.5V-733q0-57.5 40-97.5t97.5-40H715q31 0 53 22t22 53v482q0 9.5-6.25 17.25T763.5-282.5Q748-276 739-261.25t-9 33.75q0 19 8.75 33.75T763-173q12.5 5 19.75 15.25T790-134.5v5q0 16.5-11 28T752.5-90h-445Zm55-275q15.5 0 26.5-11t11-26.5V-758q0-15.5-11-26.5t-26.5-11q-15.5 0-26.5 11T325-758v355.5q0 15.5 11 26.5t26.5 11Zm-55 200h362q-7-14-10.75-29.75T655-227.5q0-16.5 3.5-32.5t11-30h-362q-26.5 0-44.5 18.5t-18 44q0 26.5 18 44.5t44.5 18Z"/></svg>
  );
}

export default Book2Icon;