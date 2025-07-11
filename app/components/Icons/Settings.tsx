import { DEFAULT_ICON_COLOR, DEFAULT_ICON_SIZE, type IconProps } from './IconProps';

function SettingsIcon(props: IconProps) {
  const fill = props.color || DEFAULT_ICON_COLOR;
  const height = props.size || DEFAULT_ICON_SIZE;
  const width = props.size || DEFAULT_ICON_SIZE;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M427-90q-22 0-38.25-14.75T369.5-141l-10-73.5q-13-5.5-26.25-12.75T309-242.5l-68.5 28q-20.5 9-41 1.75t-32-26.25L114-331.5q-11.5-19-6.75-40.5t22.25-35.5l60-45.5q-1-6.5-1-12.5V-480q0-6 .25-13t1.25-16l-59.5-44Q113-567 108-588.25t6.5-40.75l53-92q11.5-19 32.25-26.25T241-745.5l69.5 29q10-8 22.25-15t26.75-13l10-75.5q3-21.5 19.5-36.25T427.5-871H533q22 0 38.25 14.75T590.5-820l10 74q14 5.5 25.75 12.75T649-716.5l70.5-29q20.5-9 41-1.75t32 26.25l53 92q11.5 19 6.5 40.5T829.5-553l-62 46q1 7 1 12.75v29q0 6.25-1.5 12.75l61 45q17.5 14 22.5 35.5t-6.5 40.5L790.5-239q-11.5 19-32.25 26.25T717-214.5l-68-29q-9.5 7.5-20.75 14T600.5-215l-10 74q-3 21.5-19.25 36.25T533-90H427Zm52.5-255q56 0 95.5-39.5t39.5-95.5q0-56-39.5-95.5T479.5-615q-56.5 0-95.75 39.5T344.5-480q0 56 39.25 95.5T479.5-345Z"/></svg>
  );
}

export default SettingsIcon;