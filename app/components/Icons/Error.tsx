import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function ErrorIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M479.89-285Q496-285 507-295.89q11-10.9 11-27Q518-339 507.11-350q-10.9-11-27-11Q464-361 453-350.11q-11 10.9-11 27Q442-307 452.89-296q10.9 11 27 11Zm.61-155q15.5 0 26.5-11t11-26.5v-161q0-15.5-11-26.5t-26.5-11q-15.5 0-26.5 11t-11 26.5v161q0 15.5 11 26.5t26.5 11ZM480-90q-80.91 0-152.07-30.76-71.15-30.77-123.79-83.5Q151.5-257 120.75-328.09 90-399.17 90-480q0-80.91 30.76-152.07 30.77-71.15 83.5-123.79Q257-808.5 328.09-839.25 399.17-870 480-870q80.91 0 152.07 30.76 71.15 30.77 123.79 83.5Q808.5-703 839.25-631.91 870-560.83 870-480q0 80.91-30.76 152.07-30.77 71.15-83.5 123.79Q703-151.5 631.91-120.75 560.83-90 480-90Z"/></svg>
  );
}

export default ErrorIcon;