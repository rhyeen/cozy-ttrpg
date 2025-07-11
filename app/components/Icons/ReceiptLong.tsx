import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function ReceiptLongIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M244-90q-47.5 0-81.25-33.25T129-204v-73.5q0-15.5 11-26.5t26.5-11H247v-531.5q0-6.5 5.5-9t10.5 2l30 29.5q5.5 5.5 13 5.5t13-5.5l32-32q5.5-5.5 13-5.5t13 5.5l32 32q5.5 5.5 13 5.5t13-5.5l33-32q5.5-5.5 13-5.5t13 5.5l32 32q5.5 5.5 13 5.5t13-5.5l32-32q5.5-5.5 13-5.5t13 5.5l33 32q5.5 5.5 13 5.5t13-5.5l32-32q5.5-5.5 13-5.5t13 5.5l33 32q5.5 5.5 13 5.5t13-5.5l29-29q5-5 10.5-2.5t5.5 9V-204q0 47.5-33.75 80.75T716-90H244Zm472-75q17 0 28.5-11t11.5-28v-552H322v441h317.5q15.5 0 26.5 11t11 26.5v73.5q0 17 11 28t28 11ZM400.5-676h159q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11h-159q-15.5 0-26.5-11t-11-26.5q0-15.5 11-26.5t26.5-11Zm0 118h159q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11h-159q-15.5 0-26.5-11t-11-26.5q0-15.5 11-26.5t26.5-11Zm276-43q-15.5 0-26.5-11t-11-26.5q0-15.5 11-26.5t26.5-11q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11Zm0 118q-15.5 0-26.5-11t-11-26.5q0-15.5 11-26.5t26.5-11q15.5 0 26.5 11t11 26.5q0 15.5-11 26.5t-26.5 11Z"/></svg>
  );
}

export default ReceiptLongIcon;