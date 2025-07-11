import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function EditIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M167.5-130q-15.5 0-26.5-11t-11-26.5V-258q0-15 5.75-28.75T152-311l498-497.5q11-10.5 24.25-16t28.25-5.5q15 0 29 5.75t25 16.75l52 52.5q11 10.5 16.25 24.25T830-702.5q0 15-5.25 28.5t-16.25 24.5L311-152q-10.5 10.5-24.25 16.25T258-130h-90.5Zm535-520 52.5-52.5-52.5-52.5-52.5 52.5 52.5 52.5Z"/></svg>
  );
}

export default EditIcon;