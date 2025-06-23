import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function BrushIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M246-131q-42 0-83.75-20T95-205q25-1.5 50.5-21.5T171-284q0-47.5 33.25-81.25T285-399q47.5 0 80.75 33.75T399-284q0 64-44.5 108.5T246-131Zm223-233L364-468l350-350q11-11 27-11.5t28 11.5l49 50q12 12 12 27.5T818-713L469-364Z"/></svg>
  );
}

export default BrushIcon;