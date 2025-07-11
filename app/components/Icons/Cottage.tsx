import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function CottageIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M172.5-197.5v-312l-51 38.5q-12.5 9-27.75 7.25T69-478.5q-9.5-12.5-7.25-27.75T76-531l96.5-73v-84.5q0-15.5 11-26.5t26.5-11q15.5 0 26.5 11t11 26.5v28l190.5-144q10-7.5 21.75-11.25t23.75-3.75q12 0 23.75 4T529-804l355.5 269.5q12 9.5 14.25 24.75T891.5-482q-9.5 12-24.75 14.25T839.5-475l-45-33.5v311q0 31-22 53t-53 22h-180q-8 0-13.25-5.25T521-141v-179q0-15.5-11-26.5t-26.5-11q-15.5 0-26.5 11T446-320v179q0 8-5.25 13.25t-13.25 5.25h-180q-31 0-53-22t-22-53ZM221-766q-21 0-33-16.5t-2.5-34q16-29.5 43.5-47t61-17.5q11 0 20.5-5.25t15-14.25q6-9 14.5-14.75t19.5-5.75q21.5 0 32.75 17.75t.75 35.75q-17 28-43.75 44.75T290-806q-11 0-20.5 5t-15 14.5q-6 9-14.25 14.75T221-766Z"/></svg>
  );
}

export default CottageIcon;