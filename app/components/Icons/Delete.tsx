import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function DeleteIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M283-130q-31 0-53-22t-22-53v-512h-1.5q-15.5 0-26.5-11t-11-26.5q0-15.5 11-26.5t26.5-11H362v-.5q0-15.5 11-26.5t26.5-11h162q15.5 0 26.5 11t11 26.5v.5h155.5q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11H753v512q0 31-22 53t-53 22H283Zm119.5-153.5q15.5 0 26.5-11t11-26.5v-280q0-15.5-11-26.5t-26.5-11q-15.5 0-26.5 11T365-601v280q0 15.5 11 26.5t26.5 11Zm156 0q15.5 0 26.5-11t11-26.5v-280q0-15.5-11-26.5t-26.5-11q-15.5 0-26.5 11T521-601v280q0 15.5 11 26.5t26.5 11Z"/></svg>
  );
}

export default DeleteIcon;